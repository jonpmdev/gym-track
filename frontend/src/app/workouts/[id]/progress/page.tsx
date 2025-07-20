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

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    const fetchWorkout = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workouts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar el entrenamiento');
        }

        const data = await response.json();
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
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id, user, token, router]);

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercise-progress`, {
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

      if (!response.ok) {
        throw new Error('Error al guardar el progreso');
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
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!workout) {
    return <div className="error">No se encontró el entrenamiento</div>;
  }

  return (
    <div className="exercise-progress-container">
      <h1>Registrar Progreso: {workout.title}</h1>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="exercise-list">
        {workout.exercises.map(exercise => (
          <div key={exercise.id} className="exercise-card">
            <h2>{exercise.name}</h2>
            <div className="exercise-details">
              <p>Series: {exercise.sets}</p>
              <p>Repeticiones: {exercise.reps}</p>
              <p>Peso actual: {exercise.weight || 0} kg</p>
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
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`notes-${exercise.id}`}>Notas:</label>
                <textarea
                  id={`notes-${exercise.id}`}
                  value={exerciseNotes[exercise.id] || ''}
                  onChange={(e) => handleNotesChange(exercise.id, e.target.value)}
                  placeholder="Añade notas sobre tu progreso..."
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
        ))}
      </div>
      
      <button 
        className="back-button" 
        onClick={() => router.push(`/workouts/${id}`)}
      >
        Volver al Entrenamiento
      </button>
    </div>
  );
};

export default ExerciseProgressPage; 