'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
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

      const data = await res.json();
      setWorkout(data);
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
    router.push(`/workouts?id=${params.id}`);
  };

  const handleBackToWorkouts = () => {
    router.push('/workouts');
  };

  // Agrupar ejercicios por día
  const exercisesByDay = workout?.exercises.reduce((acc: Record<string, Exercise[]>, exercise) => {
    if (!acc[exercise.day]) {
      acc[exercise.day] = [];
    }
    acc[exercise.day].push(exercise);
    return acc;
  }, {}) || {};

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="error-message mb-4">{error}</div>
        <button 
          className="secondary-button"
          onClick={handleBackToWorkouts}
        >
          Volver a entrenamientos
        </button>
      </DashboardLayout>
    );
  }

  if (!workout) {
    return (
      <DashboardLayout>
        <div className="error-message mb-4">No se encontró el entrenamiento</div>
        <button 
          className="secondary-button"
          onClick={handleBackToWorkouts}
        >
          Volver a entrenamientos
        </button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer />
      <div className="workout-details-container">
        <div className="flex justify-between items-center mb-6">
          <div>
            <button 
              className="back-button mb-2"
              onClick={handleBackToWorkouts}
            >
              &larr; Volver a entrenamientos
            </button>
            <h1 className="workout-details-title">{workout.title}</h1>
          </div>
          <div className="flex items-center">
            <span
              className={`workout-status mr-4 ${
                workout.completed ? 'completed' : 'in-progress'
              }`}
            >
              {workout.completed ? 'Completado' : 'En progreso'}
            </span>
            <button 
              className="primary-button"
              onClick={handleEditWorkout}
            >
              Editar entrenamiento
            </button>
          </div>
        </div>

        {workout.notes && (
          <div className="workout-notes-section">
            <h3 className="section-title">Notas</h3>
            <p>{workout.notes}</p>
          </div>
        )}

        <div className="workout-exercises-section">
          <h3 className="section-title">Ejercicios</h3>
          
          {Object.keys(exercisesByDay).length === 0 ? (
            <p className="text-gray-500">No hay ejercicios en este entrenamiento.</p>
          ) : (
            <div className="days-tabs">
              {Object.entries(exercisesByDay).map(([day, exercises]) => (
                <div key={day} className="day-section">
                  <h4 className="day-title">{day}</h4>
                  <div className="exercises-list">
                    {exercises.map((exercise, index) => {
                      const exerciseIndex = workout.exercises.findIndex(
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
                                onClick={() => handleToggleExerciseComplete(exerciseIndex)}
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