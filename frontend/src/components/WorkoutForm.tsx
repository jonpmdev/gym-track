'use client';

import { useState, useEffect } from 'react';
import { Exercise, Workout } from '@/types';
import './WorkoutForm.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface WorkoutFormProps {
  onSubmit: (workout: Omit<Workout, 'id'>) => void;
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
  const [currentExercise, setCurrentExercise] = useState<Omit<Exercise, 'id'>>({
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
  const handleExerciseChange = (field: keyof Omit<Exercise, 'id'>, value: any) => {
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
      toast.error('El nombre del ejercicio es obligatorio', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (editMode && editIndex !== null) {
      // Actualizar ejercicio existente
      const updatedExercises = [...exercises];
      updatedExercises[editIndex] = { ...currentExercise };
      setExercises(updatedExercises);
      setEditMode(false);
      setEditIndex(null);
      toast.success('Ejercicio actualizado correctamente', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      // Añadir nuevo ejercicio
      setExercises([...exercises, { ...currentExercise }]);
      toast.success('Ejercicio añadido correctamente', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
    toast.info('Ejercicio eliminado', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
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
      toast.error('El título del entrenamiento es obligatorio', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    if (exercises.length === 0) {
      toast.error('Debes añadir al menos un ejercicio', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    // Verificar que cada ejercicio tenga los campos requeridos
    const invalidExercises = exercises.filter(exercise => !exercise.name || !exercise.sets || !exercise.reps);
    if (invalidExercises.length > 0) {
      toast.error('Hay ejercicios con información incompleta', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    // Asegurarse de que todos los tipos de datos sean correctos
    const validatedExercises = exercises.map(exercise => ({
      name: String(exercise.name),
      sets: Number(exercise.sets),
      reps: String(exercise.reps),
      weight: exercise.weight !== undefined ? Number(exercise.weight) : 0,
      rest: exercise.rest !== undefined ? String(exercise.rest) : '60',
      muscleGroups: Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.map(String) : [],
      // Añadir campo muscle_groups para compatibilidad con el backend
      muscle_groups: Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.map(String) : [],
      focus: exercise.focus !== undefined ? String(exercise.focus) : '',
      day: String(exercise.day)
    }));
    
    // Enviar los datos del entrenamiento
    onSubmit({
      title: String(title),
      exercises: validatedExercises,
      notes: notes ? String(notes) : '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="workout-form">
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
                {day} {getExercisesByDay(day).length > 0 && <span className="exercise-count">({getExercisesByDay(day).length})</span>}
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
                          className="workout-action-button view"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => removeExercise(exerciseIndex)}
                          className="workout-action-button delete"
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
            
            {/* Uso un div en lugar de form para evitar conflictos con el formulario principal */}
            <div className="exercise-form">
              <div className="form-group">
                <label htmlFor="exerciseName" className="form-label">
                  Nombre del ejercicio *
                </label>
                <input
                  type="text"
                  id="exerciseName"
                  value={currentExercise.name}
                  onChange={(e) => handleExerciseChange('name', e.target.value)}
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