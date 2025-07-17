'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import WorkoutForm from '@/components/WorkoutForm';
import { Workout } from '@/types';
import './workouts.css';

export default function WorkoutsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      const token = localStorage.getItem('token');
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleWorkout = async (id: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkout = async (workoutData: Omit<Workout, 'id' | 'completed'>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workoutData),
      });

      if (!res.ok) {
        throw new Error('Error al crear el entrenamiento');
      }

      await fetchWorkouts();
      setShowForm(false);
      // Limpiar parámetros de URL
      router.push('/workouts');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWorkout = async (workoutData: Omit<Workout, 'id' | 'completed'>) => {
    if (!editWorkout) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/workouts/${editWorkout.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workoutData),
      });

      if (!res.ok) {
        throw new Error('Error al actualizar el entrenamiento');
      }

      await fetchWorkouts();
      setEditWorkout(null);
      setShowForm(false);
      // Limpiar parámetros de URL
      router.push('/workouts');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este entrenamiento?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewWorkout = (workout: Workout) => {
    router.push(`/workouts?id=${workout.id}`);
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

  const handleFormSubmit = (workoutData: Omit<Workout, 'id' | 'completed'>) => {
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

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

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
                  <span
                    className={`workout-status ${
                      workout.completed ? 'completed' : 'in-progress'
                    }`}
                  >
                    {workout.completed ? 'Completado' : 'En progreso'}
                  </span>
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
                    Ver detalles
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