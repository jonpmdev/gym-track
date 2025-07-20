'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import WorkoutForm from '@/components/WorkoutForm';
import { Workout, Exercise } from '@/types';
import './workout-details.css';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function WorkoutDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    fetchWorkout();
  }, [params.id]);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      const res = await fetch(`http://localhost:5000/api/workouts/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Error al obtener el entrenamiento');
      }

      const responseData = await res.json();
      console.log('Respuesta completa del servidor:', responseData);
      
      // La API devuelve el entrenamiento dentro de un objeto 'workout'
      const data = responseData.workout || responseData;
      
      console.log('Datos del entrenamiento extraídos:', data);
      
      // Verificar la estructura de los ejercicios
      if (!data.exercises || !Array.isArray(data.exercises)) {
        console.error('Los ejercicios no están presentes o no son un array:', data);
        setDebugInfo(`Estructura del entrenamiento recibida: ${JSON.stringify(data, null, 2)}`);
        
        // Si los ejercicios no existen o no son un array, inicializamos como array vacío
        data.exercises = [];
      } else {
        console.log(`Recibidos ${data.exercises.length} ejercicios`);
        
        // Verificar si los ejercicios tienen el campo 'day'
        const exercisesWithoutDay = data.exercises.filter((ex: any) => !ex.day);
        if (exercisesWithoutDay.length > 0) {
          console.warn(`${exercisesWithoutDay.length} ejercicios no tienen el campo 'day'`);
          
          // Asignar un día por defecto a los ejercicios sin día
          data.exercises = data.exercises.map((ex: any) => {
            if (!ex.day) {
              return { ...ex, day: 'Lunes' };
            }
            return ex;
          });
        }
        
        // Verificar si los ejercicios tienen el campo 'muscleGroups' o 'muscle_groups'
        data.exercises = data.exercises.map((ex: any) => {
          // Asegurarse de que muscleGroups siempre esté disponible
          if (!ex.muscleGroups && ex.muscle_groups) {
            ex.muscleGroups = ex.muscle_groups;
          } else if (!ex.muscleGroups) {
            ex.muscleGroups = [];
          }
          return ex;
        });
      }
      
      setWorkout(data);
      setDebugInfo('');
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error: ${err.message}`, {
        position: "top-center",
        autoClose: 3000,
      });
      console.error('Error al obtener el entrenamiento:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExerciseComplete = async (exerciseIndex: number) => {
    if (!workout) return;
    
    try {
      setLoading(true);
      
      // Crear una copia profunda del workout
      const updatedWorkout = JSON.parse(JSON.stringify(workout));
      const exercise = updatedWorkout.exercises[exerciseIndex];
      
      // Actualizar el estado del ejercicio
      const newCompletedState = !exercise.completed;
      exercise.completed = newCompletedState;
      
      const token = Cookies.get('token');
      
      // Usar el nuevo endpoint de ejercicios para actualizar el estado
      if (exercise.id) {
        const res = await fetch(`http://localhost:5000/api/exercises/${exercise.id}/completed`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completed: newCompletedState
          }),
        });

        if (!res.ok) {
          throw new Error('Error al actualizar el ejercicio');
        }
        
        toast.success(`Ejercicio ${newCompletedState ? 'completado' : 'marcado como pendiente'}`, {
          position: "top-center",
          autoClose: 2000,
        });
      }
      
      // Verificar si todos los ejercicios están completados
      const allExercisesCompleted = updatedWorkout.exercises.every((ex: Exercise) => ex.completed);
      
      // Si el estado de completado del workout ha cambiado, actualizarlo
      if (updatedWorkout.completed !== allExercisesCompleted) {
        updatedWorkout.completed = allExercisesCompleted;
        
        // Actualizar el estado de completado del workout
        const workoutRes = await fetch(`http://localhost:5000/api/workouts/${params.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completed: allExercisesCompleted
          }),
        });

        if (!workoutRes.ok) {
          throw new Error('Error al actualizar el estado del entrenamiento');
        }
        
        if (allExercisesCompleted) {
          toast.success('¡Entrenamiento completado!', {
            position: "top-center",
            autoClose: 3000,
            icon: "🎉" as any,
          });
        }
      }

      // Actualizar el estado local
      setWorkout(updatedWorkout);
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error: ${err.message}`, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditWorkout = () => {
    setIsEditing(true);
  };

  const handleUpdateWorkout = async (workoutData: Omit<Workout, 'id' | 'completed'>) => {
    if (!workout) return;

    try {
      setLoading(true);
      const token = Cookies.get('token');
      
      // Preparar los datos del entrenamiento con los ejercicios incluidos
      const validatedWorkoutData = {
        title: String(workoutData.title),
        notes: workoutData.notes ? String(workoutData.notes) : '',
        exercises: workoutData.exercises.map(exercise => ({
          id: exercise.id, // Mantener el ID si existe
          name: String(exercise.name),
          sets: Number(exercise.sets),
          reps: String(exercise.reps),
          weight: exercise.weight !== undefined ? Number(exercise.weight) : 0,
          rest: exercise.rest !== undefined ? String(exercise.rest) : '60',
          muscle_groups: Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.map(String) : [],
          focus: exercise.focus !== undefined ? String(exercise.focus) : '',
          completed: exercise.completed !== undefined ? Boolean(exercise.completed) : false,
          day: String(exercise.day)
        }))
      };
      
      console.log('Enviando datos actualizados:', validatedWorkoutData);
      
      // Actualizar el entrenamiento con todos los ejercicios en una sola petición
      const res = await fetch(`http://localhost:5000/api/workouts/${workout.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(validatedWorkoutData),
      });

      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        console.error("Error al parsear la respuesta:", e);
      }

      if (!res.ok) {
        if (errorData && errorData.errors) {
          // Si hay errores de validación, mostrarlos
          const errorMessages = errorData.errors.map((err: any) => err.msg).join(', ');
          throw new Error(`Error al actualizar el entrenamiento: ${errorMessages}`);
        }
        throw new Error((errorData && errorData.message) || 'Error al actualizar el entrenamiento');
      }

      // Mostrar mensaje de éxito
      toast.success('Entrenamiento actualizado correctamente', {
        position: "top-center",
        autoClose: 2000,
      });
      
      // Actualizar el estado local y salir del modo edición
      await fetchWorkout();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error: ${err.message}`, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleBackToWorkouts = () => {
    router.push('/workouts');
  };

  // Agrupar ejercicios por día
  const exercisesByDay = workout && workout.exercises ? workout.exercises.reduce((acc: Record<string, Exercise[]>, exercise) => {
    if (!acc[exercise.day]) {
      acc[exercise.day] = [];
    }
    acc[exercise.day].push(exercise);
    return acc;
  }, {}) : {};

  if (loading && !isEditing) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !isEditing) {
    return (
      <DashboardLayout>
        <div className="error-message mb-4">{error}</div>
        <button 
          className="back-button"
          onClick={handleBackToWorkouts}
        >
          &larr; Volver a entrenamientos
        </button>
      </DashboardLayout>
    );
  }

  if (!workout && !isEditing) {
    return (
      <DashboardLayout>
        <div className="error-message mb-4">No se encontró el entrenamiento</div>
        <button 
          className="back-button"
          onClick={handleBackToWorkouts}
        >
          &larr; Volver a entrenamientos
        </button>
      </DashboardLayout>
    );
  }

  if (isEditing && workout) {
    return (
      <DashboardLayout>
        <ToastContainer />
        <WorkoutForm 
          onSubmit={handleUpdateWorkout} 
          onCancel={handleCancelEdit} 
          initialData={workout}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer />
      <div className="workout-details-container">
        {debugInfo && (
          <div className="debug-info p-4 mb-4 bg-yellow-100 border border-yellow-400 rounded">
            <h4 className="font-bold mb-2">Información de depuración:</h4>
            <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-40">{debugInfo}</pre>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <button 
              className="back-button mb-2"
              onClick={handleBackToWorkouts}
            >
              &larr; Volver a entrenamientos
            </button>
            <h1 className="workout-details-title">{workout?.title}</h1>
          </div>
          <div className="flex items-center">
            <span
              className={`workout-status mr-4 ${
                workout?.completed ? 'completed' : 'in-progress'
              }`}
            >
              {workout?.completed ? 'Completado' : 'En progreso'}
            </span>
            <button 
              className="primary-button"
              onClick={handleEditWorkout}
            >
              Editar entrenamiento
            </button>
          </div>
        </div>

        {workout?.notes && (
          <div className="workout-notes-section">
            <h3 className="section-title">Notas</h3>
            <p>{workout.notes}</p>
          </div>
        )}

        <div className="workout-exercises-section">
          <h3 className="section-title">Ejercicios</h3>
          
          {Object.keys(exercisesByDay).length === 0 ? (
            <div>
              <p className="text-gray-500 mb-4">No hay ejercicios en este entrenamiento.</p>
              <div className="mt-2 p-4 bg-blue-50 rounded">
                <p className="text-sm text-blue-700 mb-3">Añade ejercicios para comenzar a registrar tu progreso.</p>
                <button 
                  className="primary-button w-full md:w-auto"
                  onClick={handleEditWorkout}
                >
                  Añadir ejercicios
                </button>
              </div>
            </div>
          ) : (
            <div className="days-tabs">
              {Object.entries(exercisesByDay).map(([day, exercises]) => (
                <div key={day} className="day-section">
                  <h4 className="day-title">{day}</h4>
                  <div className="exercises-list">
                    {exercises.map((exercise, index) => {
                      const exerciseIndex = workout?.exercises.findIndex(
                        (e) => e === exercise
                      );
                      return (
                        <div 
                          key={index} 
                          className={`exercise-item ${exercise.completed ? 'completed' : ''}`}
                        >
                          <div className="exercise-content">
                            <div className="exercise-info">
                              <h5 className="exercise-name">{exercise.name}</h5>
                              <p className="exercise-details">
                                {exercise.sets} series x {exercise.reps} repeticiones
                                {exercise.weight ? ` x ${exercise.weight} kg` : ''}
                                {exercise.rest ? ` | Descanso: ${exercise.rest}s` : ''}
                              </p>
                              {(exercise.muscleGroups?.length || exercise.focus) && (
                                <p className="exercise-metadata">
                                  {exercise.muscleGroups && exercise.muscleGroups.length > 0 && `Grupos: ${exercise.muscleGroups.join(', ')}`}
                                  {exercise.muscleGroups && exercise.muscleGroups.length > 0 && exercise.focus && ' | '}
                                  {exercise.focus && `Enfoque: ${exercise.focus}`}
                                </p>
                              )}
                            </div>
                            <div className="exercise-actions">
                              <button
                                className={`toggle-complete-button ${exercise.completed ? 'completed' : ''}`}
                                onClick={() => exerciseIndex !== undefined && handleToggleExerciseComplete(exerciseIndex)}
                              >
                                {exercise.completed ? 'Completado' : 'Marcar completado'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 