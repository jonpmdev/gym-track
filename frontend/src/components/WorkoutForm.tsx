'use client';

import { useState, useEffect } from 'react';
import { Exercise, Workout } from '@/types';
import './WorkoutForm.css';

interface WorkoutFormProps {
  onSubmit: (workout: Omit<Workout, 'id' | 'completed'>) => void;
  onCancel: () => void;
  initialData?: Workout;
}

// Lista de días de la semana
const DAYS_OF_WEEK = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

// Lista de grupos musculares
const MUSCLE_GROUPS = [
  'Pecho',
  'Espalda',
  'Hombros',
  'Bíceps',
  'Tríceps',
  'Piernas',
  'Glúteos',
  'Abdominales',
  'Core',
  'Cardio',
  'Otro',
];

// Lista de enfoques de entrenamiento
const FOCUS_TYPES = [
  'Fuerza',
  'Hipertrofia',
  'Resistencia',
  'Potencia',
  'Flexibilidad',
  'Otro',
];

export default function WorkoutForm({ onSubmit, onCancel, initialData }: WorkoutFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [exercises, setExercises] = useState<Exercise[]>(initialData?.exercises || []);
  const [activeDay, setActiveDay] = useState(DAYS_OF_WEEK[0]);
  
  // Estado para el ejercicio actual que se está creando/editando
  const [currentExercise, setCurrentExercise] = useState<Omit<Exercise, 'completed'>>({
    name: '',
    sets: 3,
    reps: '10',
    weight: 0,
    rest: '60',
    muscleGroups: [],
    focus: '',
    day: activeDay,
  });
  
  // Estado para el modo de edición
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Efecto para actualizar el día del ejercicio actual cuando cambia el día activo
  useEffect(() => {
    setCurrentExercise(prev => ({ ...prev, day: activeDay }));
  }, [activeDay]);

  // Función para agrupar ejercicios por día
  const getExercisesByDay = (day: string) => {
    return exercises.filter(exercise => exercise.day === day);
  };

  // Función para manejar cambios en los campos del ejercicio actual
  const handleExerciseChange = (field: keyof Omit<Exercise, 'completed'>, value: any) => {
    setCurrentExercise(prev => ({ ...prev, [field]: value }));
  };

  // Función para manejar la selección de grupos musculares
  const handleMuscleGroupToggle = (group: string) => {
    setCurrentExercise(prev => {
      const currentGroups = prev.muscleGroups || [];
      if (currentGroups.includes(group)) {
        return { ...prev, muscleGroups: currentGroups.filter(g => g !== group) };
      } else {
        return { ...prev, muscleGroups: [...currentGroups, group] };
      }
    });
  };

  // Función para añadir un nuevo ejercicio
  const addExercise = () => {
    if (!currentExercise.name) {
      alert('El nombre del ejercicio es obligatorio');
      return;
    }

    if (editMode && editIndex !== null) {
      // Actualizar ejercicio existente
      const updatedExercises = [...exercises];
      updatedExercises[editIndex] = { ...currentExercise, completed: false };
      setExercises(updatedExercises);
      setEditMode(false);
      setEditIndex(null);
    } else {
      // Añadir nuevo ejercicio
      setExercises([...exercises, { ...currentExercise, completed: false }]);
    }

    // Resetear el formulario de ejercicio
    setCurrentExercise({
      name: '',
      sets: 3,
      reps: '10',
      weight: 0,
      rest: '60',
      muscleGroups: [],
      focus: '',
      day: activeDay,
    });
  };

  // Función para editar un ejercicio existente
  const editExercise = (index: number) => {
    const exercise = exercises[index];
    setCurrentExercise({
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight || 0,
      rest: exercise.rest || '60',
      muscleGroups: exercise.muscleGroups || [],
      focus: exercise.focus || '',
      day: exercise.day,
    });
    setEditMode(true);
    setEditIndex(index);
    setActiveDay(exercise.day);
  };

  // Función para eliminar un ejercicio
  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  // Función para cancelar la edición
  const cancelEdit = () => {
    setCurrentExercise({
      name: '',
      sets: 3,
      reps: '10',
      weight: 0,
      rest: '60',
      muscleGroups: [],
      focus: '',
      day: activeDay,
    });
    setEditMode(false);
    setEditIndex(null);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      alert('El título del entrenamiento es obligatorio');
      return;
    }
    
    if (exercises.length === 0) {
      alert('Debes añadir al menos un ejercicio');
      return;
    }
    
    onSubmit({
      title,
      exercises,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="workout-form">
      <h2 className="workout-form-title">
        {initialData ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento'}
      </h2>
      
      {/* Sección de información general */}
      <div className="workout-form-section">
        <h3 className="workout-form-section-title">Información General</h3>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Título del entrenamiento *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
            placeholder="Ej: Entrenamiento de fuerza semana 1"
          />
        </div>
      </div>
      
      {/* Sección de ejercicios */}
      <div className="workout-form-section">
        <h3 className="workout-form-section-title">Ejercicios</h3>
        
        {/* Pestañas para los días de la semana */}
        <div className="days-tabs-container">
          <div className="flex overflow-x-auto mb-4 days-tabs">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className={`day-tab ${activeDay === day ? 'active' : ''}`}
                onClick={() => setActiveDay(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
        
        {/* Contenido del día activo */}
        <div className="day-content">
          <h4 className="text-lg font-medium mb-4">Ejercicios para {activeDay}</h4>
          
          {/* Lista de ejercicios del día actual */}
          {getExercisesByDay(activeDay).length > 0 ? (
            <div className="mb-6">
              {getExercisesByDay(activeDay).map((exercise, index) => {
                const exerciseIndex = exercises.findIndex(
                  (e) => e === exercise
                );
                return (
                  <div key={index} className="exercise-card">
                    <div className="exercise-content">
                      <div className="exercise-details">
                        <h5 className="font-medium">{exercise.name}</h5>
                        <p className="text-sm text-gray-600">
                          {exercise.sets} series x {exercise.reps} repeticiones
                          {exercise.weight ? ` x ${exercise.weight} kg` : ''}
                          {exercise.rest ? ` | Descanso: ${exercise.rest}s` : ''}
                        </p>
                        {(exercise.muscleGroups?.length || exercise.focus) && (
                          <p className="text-sm text-gray-500 mt-1">
                            {exercise.muscleGroups && exercise.muscleGroups.length > 0 && `Grupos: ${exercise.muscleGroups.join(', ')}`}
                            {exercise.muscleGroups && exercise.muscleGroups.length > 0 && exercise.focus && ' | '}
                            {exercise.focus && `Enfoque: ${exercise.focus}`}
                          </p>
                        )}
                      </div>
                      <div className="exercise-actions">
                        <button
                          type="button"
                          onClick={() => editExercise(exerciseIndex)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => removeExercise(exerciseIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4 mb-6">
              No hay ejercicios para {activeDay}. ¡Añade uno nuevo!
            </p>
          )}
          
          {/* Formulario para añadir/editar ejercicio */}
          <div className="bg-white p-4 rounded-lg border">
            <h5 className="font-medium mb-3">
              {editMode ? 'Editar ejercicio' : 'Añadir nuevo ejercicio'}
            </h5>
            
            <div className="form-group">
              <label htmlFor="exerciseName" className="form-label">
                Nombre del ejercicio *
              </label>
              <input
                type="text"
                id="exerciseName"
                value={currentExercise.name}
                onChange={(e) => handleExerciseChange('name', e.target.value)}
                required
                className="form-input"
                placeholder="Ej: Press de banca"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group w-1/3">
                <label htmlFor="sets" className="form-label">
                  Series *
                </label>
                <input
                  type="number"
                  id="sets"
                  min="1"
                  value={currentExercise.sets}
                  onChange={(e) => handleExerciseChange('sets', parseInt(e.target.value) || 1)}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group w-1/3">
                <label htmlFor="reps" className="form-label">
                  Repeticiones *
                </label>
                <input
                  type="text"
                  id="reps"
                  value={currentExercise.reps}
                  onChange={(e) => handleExerciseChange('reps', e.target.value)}
                  required
                  className="form-input"
                  placeholder="Ej: 10 o 5-8"
                />
              </div>
              
              <div className="form-group w-1/3">
                <label htmlFor="weight" className="form-label">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  min="0"
                  step="0.5"
                  value={currentExercise.weight}
                  onChange={(e) => handleExerciseChange('weight', parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="rest" className="form-label">
                Descanso (segundos)
              </label>
              <input
                type="text"
                id="rest"
                value={currentExercise.rest}
                onChange={(e) => handleExerciseChange('rest', e.target.value)}
                className="form-input"
                placeholder="Ej: 60 o 90-120"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Grupos musculares
              </label>
              <div className="checkbox-group">
                {MUSCLE_GROUPS.map((group) => (
                  <div 
                    key={group} 
                    className={`checkbox-item ${currentExercise.muscleGroups?.includes(group) ? 'selected' : ''}`}
                    onClick={() => handleMuscleGroupToggle(group)}
                  >
                    {group}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="focus" className="form-label">
                Enfoque
              </label>
              <select
                id="focus"
                value={currentExercise.focus}
                onChange={(e) => handleExerciseChange('focus', e.target.value)}
                className="form-select"
              >
                <option value="">Seleccionar</option>
                {FOCUS_TYPES.map((focus) => (
                  <option key={focus} value={focus}>
                    {focus}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              {editMode && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="form-button secondary-button"
                >
                  Cancelar
                </button>
              )}
              <button
                type="button"
                onClick={addExercise}
                className="add-exercise-button"
              >
                {editMode ? 'Actualizar ejercicio' : 'Añadir ejercicio'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de notas */}
      <div className="workout-form-section">
        <h3 className="workout-form-section-title">Notas adicionales</h3>
        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            Notas
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="form-input"
            placeholder="Añade notas o comentarios sobre este entrenamiento"
          />
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="form-button cancel-button"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="form-button primary-button"
        >
          {initialData ? 'Actualizar entrenamiento' : 'Guardar entrenamiento'}
        </button>
      </div>
    </form>
  );
} 