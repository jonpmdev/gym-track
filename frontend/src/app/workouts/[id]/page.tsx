'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import WorkoutForm from '@/components/WorkoutForm';
import { Workout } from '@/types';
import './workout-details.css';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function WorkoutDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const handleUpdateWorkout = async (workoutData: Omit<Workout, 'id'>) => {
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
      
      // Redirigir a la lista de entrenamientos
      router.push('/workouts');
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
    router.push('/workouts');
  };

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
          className="back-button"
          onClick={() => router.push('/workouts')}
        >
          &larr; Volver a entrenamientos
        </button>
      </DashboardLayout>
    );
  }

  if (!workout) {
    return (
      <DashboardLayout>
        <div className="error-message mb-4">No se encontró el entrenamiento</div>
        <button 
          className="back-button"
          onClick={() => router.push('/workouts')}
        >
          &larr; Volver a entrenamientos
        </button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer />
      {debugInfo && (
        <div className="debug-info p-4 mb-4 bg-yellow-100 border border-yellow-400 rounded">
          <h4 className="font-bold mb-2">Información de depuración:</h4>
          <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-40">{debugInfo}</pre>
        </div>
      )}
      <WorkoutForm 
        onSubmit={handleUpdateWorkout} 
        onCancel={handleCancelEdit} 
        initialData={workout}
      />
    </DashboardLayout>
  );
} 