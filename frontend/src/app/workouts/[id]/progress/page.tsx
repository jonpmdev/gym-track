'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import './progress.css';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: number;
  rest?: string;
  muscle_groups?: string[];
  focus?: string;
  day: string;
  completed?: boolean;
}

interface Workout {
  id: string;
  title: string;
  notes?: string;
  exercises: Exercise[];
}

const ExerciseProgressPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exerciseWeights, setExerciseWeights] = useState<Record<string, number>>({});
  const [exerciseNotes, setExerciseNotes] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    const fetchWorkout = async () => {
      try {
        console.log(`Fetching workout with ID: ${id}`);
        const response = await fetch(`${apiUrl}/api/workouts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error response: ${errorText}`);
          throw new Error(`No se pudo cargar el entrenamiento: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Workout data received:', responseData);
        
        // La API puede devolver el entrenamiento directamente o dentro de un objeto 'workout'
        const data = responseData.workout || responseData;
        
        if (!data) {
          throw new Error('No se recibieron datos del entrenamiento');
        }
        
        // Verificar si los ejercicios existen y son un array
        if (!data.exercises || !Array.isArray(data.exercises)) {
          console.error('Los ejercicios no están presentes o no son un array:', data);
          data.exercises = [];
        }
        
        setWorkout(data);
        
        // Inicializar los pesos con los valores actuales
        const weights: Record<string, number> = {};
        const notes: Record<string, string> = {};
        data.exercises.forEach((exercise: Exercise) => {
          weights[exercise.id] = exercise.weight || 0;
          notes[exercise.id] = '';
        });
        
        setExerciseWeights(weights);
        setExerciseNotes(notes);
      } catch (err) {
        console.error('Error fetching workout:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id, user, token, router, apiUrl]);

  const handleWeightChange = (exerciseId: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setExerciseWeights(prev => ({
      ...prev,
      [exerciseId]: numericValue
    }));
  };

  const handleNotesChange = (exerciseId: string, value: string) => {
    setExerciseNotes(prev => ({
      ...prev,
      [exerciseId]: value
    }));
  };

  const handleSubmit = async (exerciseId: string) => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      console.log(`Submitting progress for exercise ID: ${exerciseId}`);
      console.log(`Weight: ${exerciseWeights[exerciseId]}, Notes: ${exerciseNotes[exerciseId]}`);
      
      const response = await fetch(`${apiUrl}/api/exercise-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          exercise_id: exerciseId,
          weight: exerciseWeights[exerciseId],
          notes: exerciseNotes[exerciseId]
        })
      });

      const responseText = await response.text();
      console.log(`Response status: ${response.status}, Response text: ${responseText}`);

      if (!response.ok) {
        let errorMessage = 'Error al guardar el progreso';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

      // Mostrar mensaje de éxito
      setSuccessMessage(`Progreso registrado para ${workout?.exercises.find(e => e.id === exerciseId)?.name}`);
      
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      // Limpiar las notas
      setExerciseNotes(prev => ({
        ...prev,
        [exerciseId]: ''
      }));
    } catch (err) {
      console.error('Error submitting progress:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      
      // Limpiar el mensaje de error después de 3 segundos
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  // Función para agrupar ejercicios por día
  const getExercisesByDay = () => {
    if (!workout || !workout.exercises) return {};
    
    return workout.exercises.reduce((acc, exercise) => {
      if (!acc[exercise.day]) {
        acc[exercise.day] = [];
      }
      acc[exercise.day].push(exercise);
      return acc;
    }, {} as Record<string, Exercise[]>);
  };

  const exercisesByDay = getExercisesByDay();
  const days = Object.keys(exercisesByDay);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error && !workout) {
    return <div className="error">{error}</div>;
  }

  if (!workout) {
    return <div className="error">No se encontró el entrenamiento</div>;
  }

  return (
    <div className="workout-details-container">
      <h1 className="workout-details-title">Registrar Progreso: {workout.title}</h1>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      
      <div className="days-tabs">
        {days.map(day => (
          <div key={day} className="day-section">
            <h2 className="day-title">{day}</h2>
            <div className="exercises-list">
              {exercisesByDay[day].map(exercise => (
                <div key={exercise.id} className="exercise-item">
                  <div className="exercise-content">
                    <div className="exercise-info">
                      <h3 className="exercise-name">{exercise.name}</h3>
                      <div className="exercise-details">
                        <p>Series: {exercise.sets}</p>
                        <p>Repeticiones: {exercise.reps}</p>
                        <p>Peso actual: {exercise.weight || 0} kg</p>
                      </div>
                    </div>
                    
                    <div className="progress-form">
                      <div className="form-group">
                        <label htmlFor={`weight-${exercise.id}`}>Nuevo peso (kg):</label>
                        <input
                          id={`weight-${exercise.id}`}
                          type="number"
                          min="0"
                          step="0.5"
                          value={exerciseWeights[exercise.id] || 0}
                          onChange={(e) => handleWeightChange(exercise.id, e.target.value)}
                          className="form-input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor={`notes-${exercise.id}`}>Notas:</label>
                        <textarea
                          id={`notes-${exercise.id}`}
                          value={exerciseNotes[exercise.id] || ''}
                          onChange={(e) => handleNotesChange(exercise.id, e.target.value)}
                          placeholder="Añade notas sobre tu progreso..."
                          className="form-input"
                        />
                      </div>
                      
                      <button 
                        className="save-button" 
                        onClick={() => handleSubmit(exercise.id)}
                        disabled={submitting}
                      >
                        {submitting ? 'Guardando...' : 'Guardar Progreso'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="back-button"
        onClick={() => router.back()}
      >
        Volver al entrenamiento
      </button>
    </div>
  );
};

export default ExerciseProgressPage; 