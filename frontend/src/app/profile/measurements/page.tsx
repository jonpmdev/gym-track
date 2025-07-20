'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import './measurements.css';

interface Measurements {
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
}

interface UserProgress {
  weight: number;
  measurements: Measurements;
  notes?: string;
}

const UserMeasurementsPage = () => {
  const router = useRouter();
  const { user, token } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress>({
    weight: 0,
    measurements: {
      chest: 0,
      waist: 0,
      hips: 0,
      biceps: 0,
      thighs: 0
    },
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [progressHistory, setProgressHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Obtener los datos actuales del usuario
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('No se pudieron cargar los datos del usuario');
        }

        const userData = await userResponse.json();
        
        // Obtener el historial de progreso
        const progressResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!progressResponse.ok) {
          throw new Error('No se pudo cargar el historial de progreso');
        }

        const progressData = await progressResponse.json();
        setProgressHistory(progressData);

        // Inicializar el formulario con los datos actuales del usuario
        setUserProgress({
          weight: userData.user.weight || 0,
          measurements: userData.user.measurements || {
            chest: 0,
            waist: 0,
            hips: 0,
            biceps: 0,
            thighs: 0
          },
          notes: ''
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, token, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'weight' || name === 'notes') {
      setUserProgress(prev => ({
        ...prev,
        [name]: name === 'weight' ? parseFloat(value) || 0 : value
      }));
    } else {
      // Es una medida
      setUserProgress(prev => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [name]: parseFloat(value) || 0
        }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    
    setSubmitting(true);
    try {
      // Guardar el progreso
      const progressResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          weight: userProgress.weight,
          measurements: userProgress.measurements,
          notes: userProgress.notes
        })
      });

      if (!progressResponse.ok) {
        throw new Error('Error al guardar el progreso');
      }

      // Actualizar los datos del usuario
      const userUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          weight: userProgress.weight,
          measurements: userProgress.measurements
        })
      });

      if (!userUpdateResponse.ok) {
        throw new Error('Error al actualizar los datos del usuario');
      }

      setSuccessMessage('Medidas registradas correctamente');
      
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      // Limpiar las notas
      setUserProgress(prev => ({
        ...prev,
        notes: ''
      }));
      
      // Actualizar el historial
      const progressData = await progressResponse.json();
      setProgressHistory(prevHistory => [progressData, ...prevHistory]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Cargando...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="measurements-container">
        <h1>Registro de Medidas y Peso</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        <div className="measurements-content">
          <div className="measurements-form-container">
            <h2>Registrar Nuevas Medidas</h2>
            <form onSubmit={handleSubmit} className="measurements-form">
              <div className="form-group">
                <label htmlFor="weight">Peso (kg):</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  min="0"
                  step="0.1"
                  value={userProgress.weight}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <h3>Medidas Corporales (cm)</h3>
              
              <div className="measurements-grid">
                <div className="form-group">
                  <label htmlFor="chest">Pecho:</label>
                  <input
                    type="number"
                    id="chest"
                    name="chest"
                    min="0"
                    step="0.1"
                    value={userProgress.measurements.chest}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="waist">Cintura:</label>
                  <input
                    type="number"
                    id="waist"
                    name="waist"
                    min="0"
                    step="0.1"
                    value={userProgress.measurements.waist}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="hips">Caderas:</label>
                  <input
                    type="number"
                    id="hips"
                    name="hips"
                    min="0"
                    step="0.1"
                    value={userProgress.measurements.hips}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="biceps">Bíceps:</label>
                  <input
                    type="number"
                    id="biceps"
                    name="biceps"
                    min="0"
                    step="0.1"
                    value={userProgress.measurements.biceps}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="thighs">Muslos:</label>
                  <input
                    type="number"
                    id="thighs"
                    name="thighs"
                    min="0"
                    step="0.1"
                    value={userProgress.measurements.thighs}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Notas:</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={userProgress.notes}
                  onChange={handleInputChange}
                  placeholder="Añade notas sobre tu progreso..."
                />
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={submitting}
              >
                {submitting ? 'Guardando...' : 'Guardar Medidas'}
              </button>
            </form>
          </div>
          
          <div className="progress-history-container">
            <h2>Historial de Progreso</h2>
            
            {progressHistory.length === 0 ? (
              <p className="no-data">No hay registros de progreso anteriores.</p>
            ) : (
              <div className="progress-history-list">
                {progressHistory.map((progress, index) => (
                  <div key={progress.id || index} className="progress-history-item">
                    <div className="progress-date">
                      {new Date(progress.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    
                    <div className="progress-details">
                      <p><strong>Peso:</strong> {progress.weight} kg</p>
                      
                      <div className="measurements-details">
                        <p><strong>Medidas:</strong></p>
                        <ul>
                          {progress.measurements.chest > 0 && (
                            <li>Pecho: {progress.measurements.chest} cm</li>
                          )}
                          {progress.measurements.waist > 0 && (
                            <li>Cintura: {progress.measurements.waist} cm</li>
                          )}
                          {progress.measurements.hips > 0 && (
                            <li>Caderas: {progress.measurements.hips} cm</li>
                          )}
                          {progress.measurements.biceps > 0 && (
                            <li>Bíceps: {progress.measurements.biceps} cm</li>
                          )}
                          {progress.measurements.thighs > 0 && (
                            <li>Muslos: {progress.measurements.thighs} cm</li>
                          )}
                        </ul>
                      </div>
                      
                      {progress.notes && (
                        <div className="progress-notes">
                          <p><strong>Notas:</strong> {progress.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserMeasurementsPage; 