'use client';

import { useState } from 'react';
import { Exercise } from '@/types';

interface WorkoutFormProps {
  onSubmit: (data: {
    name: string;
    exercises: Exercise[];
    date: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
}

export default function WorkoutForm({ onSubmit, onCancel }: WorkoutFormProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: [{ reps: 0, weight: 0, completed: false }],
  });

  const addSet = () => {
    setCurrentExercise({
      ...currentExercise,
      sets: [...currentExercise.sets, { reps: 0, weight: 0, completed: false }],
    });
  };

  const removeSet = (index: number) => {
    setCurrentExercise({
      ...currentExercise,
      sets: currentExercise.sets.filter((_, i) => i !== index),
    });
  };

  const updateSet = (index: number, field: 'reps' | 'weight', value: number) => {
    const newSets = [...currentExercise.sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setCurrentExercise({ ...currentExercise, sets: newSets });
  };

  const addExercise = () => {
    if (currentExercise.name && currentExercise.sets.length > 0) {
      setExercises([...exercises, { ...currentExercise }]);
      setCurrentExercise({
        name: '',
        sets: [{ reps: 0, weight: 0, completed: false }],
      });
    }
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      exercises,
      date,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre del entrenamiento
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Fecha
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="border rounded-md p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ejercicios</h3>
        
        {exercises.map((exercise, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium">{exercise.name}</h4>
              <button
                type="button"
                onClick={() => removeExercise(index)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">{exercise.sets.length} series</p>
            </div>
          </div>
        ))}

        <div className="mt-4 border-t pt-4">
          <div>
            <label htmlFor="exerciseName" className="block text-sm font-medium text-gray-700">
              Nombre del ejercicio
            </label>
            <input
              type="text"
              id="exerciseName"
              value={currentExercise.name}
              onChange={(e) =>
                setCurrentExercise({ ...currentExercise, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Series</h4>
            {currentExercise.sets.map((set, index) => (
              <div key={index} className="flex space-x-4 mb-2">
                <input
                  type="number"
                  placeholder="Repeticiones"
                  value={set.reps || ''}
                  onChange={(e) =>
                    updateSet(index, 'reps', parseInt(e.target.value) || 0)
                  }
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Peso (kg)"
                  value={set.weight || ''}
                  onChange={(e) =>
                    updateSet(index, 'weight', parseInt(e.target.value) || 0)
                  }
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeSet(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSet}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Añadir serie
            </button>
          </div>

          <button
            type="button"
            onClick={addExercise}
            className="mt-4 w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
          >
            Añadir ejercicio
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notas
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Guardar entrenamiento
        </button>
      </div>
    </form>
  );
} 