'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import WorkoutForm from '@/components/WorkoutForm';
import { Workout } from '@/types';
import './workouts.css';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function WorkoutsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editWorkout, setEditWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    fetchWorkouts();
    
    // Manejar parámetros de URL
    const newParam = searchParams.get('new');
    const idParam = searchParams.get('id');
    
    if (newParam === 'true') {
      setShowForm(true);
      setEditWorkout(null);
    } else if (idParam) {
      fetchSingleWorkout(idParam);
    }
  }, [searchParams]);

  const fetchWorkouts = async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch('http://localhost:5000/api/workouts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Error al obtener los entrenamientos');
      }

      const data = await res.json();
      setWorkouts(data);
    } catch (err: any) {
      console.error('Error al obtener los entrenamientos:', err);
      toast.error(`Error: ${err.message}`, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleWorkout = async (id: string) => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      const res = await fetch(`http://localhost:5000/api/workouts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Error al obtener el entrenamiento');
      }

      const workout = await res.json();
      setEditWorkout(workout);
      setShowForm(true);
    } catch (err: any) {
      console.error('Error al obtener el entrenamiento:', err);
      toast.error(`Error: ${err.message}`, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkout = async (workoutData: Omit<Workout, 'id'>) => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      
      if (!token) {
        toast.error('No estás autenticado. Por favor, inicia sesión nuevamente.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        throw new Error('No estás autenticado. Por favor, inicia sesión nuevamente.');
      }
      
      // Preparar los datos del entrenamiento con los ejercicios incluidos
      const validatedWorkoutData = {
        title: String(workoutData.title),
        notes: workoutData.notes ? String(workoutData.notes) : '',
        exercises: workoutData.exercises.map(exercise => ({
          name: String(exercise.name),
          sets: Number(exercise.sets),
          reps: String(exercise.reps),
          weight: exercise.weight !== undefined ? Number(exercise.weight) : 0,
          rest: exercise.rest !== undefined ? String(exercise.rest) : '60',
          muscle_groups: Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.map(String) : [],
          focus: exercise.focus !== undefined ? String(exercise.focus) : '',
          day: String(exercise.day)
        }))
      };
      
      console.log('Enviando datos de entrenamiento:', validatedWorkoutData);
      
      // Crear el entrenamiento con todos los ejercicios en una sola petición
      const res = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(validatedWorkoutData),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        console.error("Error al parsear la respuesta:", e);
      }

      if (!res.ok) {
        if (data && data.errors) {
          // Si hay errores de validación, mostrarlos
          const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
          throw new Error(`Error al crear el entrenamiento: ${errorMessages}`);
        }
        throw new Error((data && data.message) || 'Error al crear el entrenamiento');
      }
      
      // Mostrar mensaje de éxito
              toast.success('Entrenamiento creado correctamente', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Actualizar la lista de entrenamientos y redireccionar después de mostrar el mensaje
        await fetchWorkouts();
        setShowForm(false);
        router.push('/workouts');
    } catch (err: any) {
      console.error('Error al crear el entrenamiento:', err);
      toast.error(`Error: ${err.message}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWorkout = async (workoutData: Omit<Workout, 'id'>) => {
    if (!editWorkout) return;

    try {
      setLoading(true);
      const token = Cookies.get('token');
      
      // Preparar los datos del entrenamiento con los ejercicios incluidos
      const validatedWorkoutData = {
        title: String(workoutData.title),
        notes: workoutData.notes ? String(workoutData.notes) : '',
        exercises: workoutData.exercises.map(exercise => ({
          name: String(exercise.name),
          sets: Number(exercise.sets),
          reps: String(exercise.reps),
          weight: exercise.weight !== undefined ? Number(exercise.weight) : 0,
          rest: exercise.rest !== undefined ? String(exercise.rest) : '60',
          muscle_groups: Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.map(String) : [],
          focus: exercise.focus !== undefined ? String(exercise.focus) : '',
          day: String(exercise.day)
        }))
      };
      
      // Actualizar el entrenamiento con todos los ejercicios en una sola petición
      const res = await fetch(`http://localhost:5000/api/workouts/${editWorkout.id}`, {
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
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Actualizar la lista de entrenamientos y redireccionar después de mostrar el mensaje
        await fetchWorkouts();
        setEditWorkout(null);
        setShowForm(false);
        router.push('/workouts');
    } catch (err: any) {
      console.error('Error al actualizar el entrenamiento:', err);
      toast.error(`Error: ${err.message}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
      try {
        setLoading(true);
        const token = Cookies.get('token');
        const res = await fetch(`http://localhost:5000/api/workouts/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Error al eliminar el entrenamiento');
        }

              await fetchWorkouts();
      toast.success('Entrenamiento eliminado correctamente', {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (err: any) {
      console.error('Error al eliminar el entrenamiento:', err);
      toast.error(`Error: ${err.message}`, {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewWorkout = (workout: Workout) => {
    router.push(`/workouts/${workout.id}`);
  };

  const handleNewWorkout = () => {
    router.push('/workouts?new=true');
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditWorkout(null);
    // Limpiar parámetros de URL
    router.push('/workouts');
  };

  const handleFormSubmit = (workoutData: Omit<Workout, 'id'>) => {
    if (editWorkout) {
      handleUpdateWorkout(workoutData);
    } else {
      handleCreateWorkout(workoutData);
    }
  };

  // Agrupar ejercicios por día
  const getExercisesByDay = (workout: Workout) => {
    const days = new Set(workout.exercises.map(exercise => exercise.day));
    return Array.from(days);
  };

  if (loading && !showForm) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (showForm) {
    return (
      <DashboardLayout>
        <ToastContainer 
          position="top-center"
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={3}
        />
        <WorkoutForm 
          onSubmit={handleFormSubmit} 
          onCancel={handleFormCancel} 
          initialData={editWorkout || undefined}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer 
        position="top-center"
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
      />
      <div className="workouts-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="workouts-title">Mis Entrenamientos</h1>
          <button 
            className="primary-button"
            onClick={handleNewWorkout}
          >
            Nuevo Entrenamiento
          </button>
        </div>

        <div className="workouts-list">
          {workouts.length === 0 ? (
            <div className="empty-state">
              <p>No hay entrenamientos registrados.</p>
              <p>¡Comienza creando uno nuevo!</p>
              <button 
                className="primary-button mt-4"
                onClick={handleNewWorkout}
              >
                Crear mi primer entrenamiento
              </button>
            </div>
          ) : (
            workouts.map((workout) => (
              <div
                key={workout.id}
                className="workout-card"
              >
                <div className="workout-card-header">
                  <h3 className="workout-card-title">{workout.title}</h3>
                </div>

                <div className="workout-card-body">
                  <div className="workout-stats">
                    <div className="workout-stat">
                      <span className="workout-stat-label">Ejercicios</span>
                      <span className="workout-stat-value">{workout.exercises.length}</span>
                    </div>
                    <div className="workout-stat">
                      <span className="workout-stat-label">Días</span>
                      <span className="workout-stat-value">{getExercisesByDay(workout).length}</span>
                    </div>
                  </div>

                  <div className="workout-days">
                    {getExercisesByDay(workout).map((day) => (
                      <span key={day} className="workout-day-tag">
                        {day}
                      </span>
                    ))}
                  </div>

                  {workout.notes && (
                    <div className="workout-notes">
                      <p>{workout.notes}</p>
                    </div>
                  )}
                </div>

                <div className="workout-card-footer">
                  <button 
                    className="workout-action-button view"
                    onClick={() => handleViewWorkout(workout)}
                  >
                    Editar entrenamiento
                  </button>
                  <button 
                    className="workout-action-button delete"
                    onClick={() => handleDeleteWorkout(workout.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 