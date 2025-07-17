'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Workout } from '@/types';
import './dashboard.css';

export default function DashboardPage() {
  const router = useRouter();
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentWorkouts();
  }, []);

  const fetchRecentWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/workouts?limit=3', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setRecentWorkouts(data);
      }
    } catch (error) {
      console.error('Error fetching recent workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewWorkout = () => {
    router.push('/workouts?new=true');
  };

  const handleViewWorkout = (id: string) => {
    router.push(`/workouts?id=${id}`);
  };

  const getExercisesByDay = (workout: Workout) => {
    const days = new Set(workout.exercises.map(exercise => exercise.day));
    return Array.from(days);
  };

  return (
    <DashboardLayout>
      <div className="dashboard-section">
        <h1 className="dashboard-title">
          Bienvenido a Gym Track
        </h1>
        <p className="dashboard-subtitle">Tu panel de control personalizado</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          <div className="dashboard-card bg-blue-50">
            <h2 className="font-medium text-blue-800">Entrenamientos</h2>
            <p className="text-blue-600">
              Registra y da seguimiento a tus entrenamientos diarios.
            </p>
            <button 
              className="primary-button dashboard-button bg-blue-500 hover:bg-blue-600"
              onClick={handleNewWorkout}
            >
              Nuevo Entrenamiento
            </button>
          </div>
          <div className="dashboard-card bg-green-50">
            <h2 className="font-medium text-green-800">Progreso</h2>
            <p className="text-green-600">
              Visualiza tu progreso y medidas corporales.
            </p>
            <button className="primary-button dashboard-button bg-green-500 hover:bg-green-600">
              Registrar Medidas
            </button>
          </div>
          <div className="dashboard-card bg-purple-50">
            <h2 className="font-medium text-purple-800">Estadísticas</h2>
            <p className="text-purple-600">
              Revisa tus estadísticas y logros.
            </p>
            <button className="primary-button dashboard-button bg-purple-500 hover:bg-purple-600">
              Ver Estadísticas
            </button>
          </div>
        </div>

        {/* Sección de entrenamientos recientes */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Entrenamientos Recientes</h2>
            <button 
              className="text-blue-600 hover:text-blue-800"
              onClick={() => router.push('/workouts')}
            >
              Ver todos
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : recentWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentWorkouts.map((workout) => (
                <div 
                  key={workout.id} 
                  className="recent-workout-card"
                  onClick={() => handleViewWorkout(workout.id)}
                >
                  <h3 className="font-medium text-gray-900">{workout.title}</h3>
                  <div className="flex items-center mt-2 mb-2">
                    <span className="text-sm text-gray-500 mr-2">
                      {workout.exercises.length} ejercicios
                    </span>
                    <span className="text-sm text-gray-500">
                      {getExercisesByDay(workout).length} días
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {getExercisesByDay(workout).slice(0, 3).map((day) => (
                      <span key={day} className="recent-workout-day">
                        {day}
                      </span>
                    ))}
                    {getExercisesByDay(workout).length > 3 && (
                      <span className="recent-workout-day">
                        +{getExercisesByDay(workout).length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No hay entrenamientos recientes</p>
              <button 
                className="mt-2 text-blue-600 hover:text-blue-800"
                onClick={handleNewWorkout}
              >
                Crear tu primer entrenamiento
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 