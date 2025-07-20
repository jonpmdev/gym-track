'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import DashboardLayout from '@/components/DashboardLayout';
import { Workout } from '@/types';
import './dashboard.css';

export default function DashboardPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const token = Cookies.get('token');
      console.log('Dashboard - Token usado:', token ? token.substring(0, 20) + '...' : 'No token');
      
      if (!token) {
        console.error('No hay token disponible');
        router.push('/login');
        return;
      }

      const res = await fetch('http://localhost:5000/api/workouts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setWorkouts(data);
      } else {
        console.error('Error fetching workouts:', await res.text());
        if (res.status === 401) {
          // Token inválido, redirigir al login
          Cookies.remove('token');
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewWorkout = () => {
    router.push('/workouts?new=true');
  };

  const handleViewWorkouts = () => {
    router.push('/workouts');
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
            {workouts.length === 0 ? (
              <button 
                className="primary-button dashboard-button bg-blue-500 hover:bg-blue-600"
                onClick={handleNewWorkout}
              >
                Nuevo Entrenamiento
              </button>
            ) : (
              <button 
                className="primary-button dashboard-button bg-blue-500 hover:bg-blue-600"
                onClick={handleViewWorkouts}
              >
                Ver Entrenamientos
              </button>
            )}
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

        {loading && (
          <div className="flex justify-center items-center h-32 mt-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 