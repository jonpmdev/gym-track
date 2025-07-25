import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Workout } from '../../../core/models/workout.model';
import { Exercise } from '../../../core/models/exercise.model';
import { WorkoutService } from '../../../core/services/workout.service';
import { ExerciseService } from '../../../core/services/exercise.service';

interface ExerciseForm extends Omit<Exercise, 'id'> {
  muscleGroups?: string[];
  focus?: string;
}

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.scss'
})
export class WorkoutFormComponent implements OnInit {
  @Input() initialData?: Workout;
  @Output() onSubmit = new EventEmitter<Omit<Workout, 'id'>>();
  @Output() onCancel = new EventEmitter<void>();

  // Propiedades del formulario
  title: string = '';
  notes: string = '';
  exercises: Exercise[] = [];
  activeDay: string = 'Lunes';
  
  // Estado para el ejercicio actual
  currentExercise: ExerciseForm = {
    name: '',
    sets: 3,
    reps: '10',
    weight: 0,
    rest: '60',
    muscleGroups: [],
    focus: '',
    day: 'Lunes',
  };
  
  // Estado para el modo de edición
  editMode: boolean = false;
  editIndex: number | null = null;

  // Constantes
  DAYS_OF_WEEK = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  MUSCLE_GROUPS = [
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

  FOCUS_TYPES = [
    'Fuerza',
    'Hipertrofia',
    'Resistencia',
    'Potencia',
    'Flexibilidad',
    'Otro',
  ];

  constructor(
    private toastr: ToastrService,
    private workoutService: WorkoutService,
    private exerciseService: ExerciseService
  ) {}

  ngOnInit(): void {
    if (this.initialData) {
      this.title = this.initialData.title;
      this.notes = this.initialData.notes || '';
      
      // Si hay un ID de entrenamiento, cargar ejercicios desde el servicio
      if (this.initialData.id) {
        this.loadExercises(this.initialData.id);
      } else {
        this.exercises = [...this.initialData.exercises];
      }
      
      // Si hay ejercicios, establecer el día activo al primer ejercicio
      if (this.exercises.length > 0) {
        this.activeDay = this.exercises[0].day;
      }
    }
  }

  // Cargar ejercicios desde el servicio
  loadExercises(workoutId: string): void {
    this.exerciseService.getExercisesByWorkout(workoutId).subscribe({
      next: (exercises) => {
        this.exercises = exercises;
        if (exercises.length > 0) {
          this.activeDay = exercises[0].day;
        }
      },
      error: (error) => {
        console.error('Error al cargar ejercicios:', error);
        this.toastr.error('Error al cargar los ejercicios');
      }
    });
  }

  // Método para obtener ejercicios por día
  getExercisesByDay(day: string): Exercise[] {
    return this.exercises.filter(exercise => exercise.day === day);
  }

  // Método para cambiar el día activo
  setActiveDay(day: string): void {
    this.activeDay = day;
    this.currentExercise = {
      ...this.currentExercise,
      day: day
    };
  }

  // Método para manejar cambios en los campos del ejercicio actual
  handleExerciseChange(field: keyof ExerciseForm, value: any): void {
    this.currentExercise = { 
      ...this.currentExercise, 
      [field]: value 
    };
  }

  // Método para manejar la selección de grupos musculares
  handleMuscleGroupToggle(group: string): void {
    const currentGroups = this.currentExercise.muscleGroups || [];
    if (currentGroups.includes(group)) {
      this.currentExercise = { 
        ...this.currentExercise, 
        muscleGroups: currentGroups.filter((g: string) => g !== group) 
      };
    } else {
      this.currentExercise = { 
        ...this.currentExercise, 
        muscleGroups: [...currentGroups, group] 
      };
    }
  }

  // Método para añadir un nuevo ejercicio
  addExercise(): void {
    if (!this.currentExercise['name']) {
      this.toastr.error('El nombre del ejercicio es obligatorio');
      return;
    }

    if (this.editMode && this.editIndex !== null) {
      // Actualizar ejercicio existente
      const exercise = this.exercises[this.editIndex];
      
      if (exercise.id && this.initialData?.id) {
        // Si el ejercicio tiene ID, actualizar a través del servicio
        this.exerciseService.updateExercise(exercise.id, {
          ...this.currentExercise,
          workout_id: this.initialData.id
        }).subscribe({
          next: (updatedExercise) => {
            if (updatedExercise) {
              const updatedExercises = [...this.exercises];
              updatedExercises[this.editIndex!] = updatedExercise;
              this.exercises = updatedExercises;
              this.toastr.success('Ejercicio actualizado correctamente');
            }
            this.editMode = false;
            this.editIndex = null;
            this.resetExerciseForm();
          },
          error: (error) => {
            console.error('Error al actualizar ejercicio:', error);
            this.toastr.error('Error al actualizar el ejercicio');
          }
        });
      } else {
        // Actualizar localmente
        const updatedExercises = [...this.exercises];
        updatedExercises[this.editIndex] = { ...this.currentExercise } as Exercise;
        this.exercises = updatedExercises;
        this.editMode = false;
        this.editIndex = null;
        this.resetExerciseForm();
        this.toastr.success('Ejercicio actualizado correctamente');
      }
    } else {
      if (this.initialData?.id) {
        // Si hay un ID de entrenamiento, crear a través del servicio
        this.exerciseService.createExercise({
          ...this.currentExercise,
          workout_id: this.initialData.id
        }).subscribe({
          next: (newExercise) => {
            this.exercises = [...this.exercises, newExercise];
            this.resetExerciseForm();
            this.toastr.success('Ejercicio añadido correctamente');
          },
          error: (error) => {
            console.error('Error al crear ejercicio:', error);
            this.toastr.error('Error al añadir el ejercicio');
          }
        });
      } else {
        // Añadir localmente
        this.exercises = [...this.exercises, { ...this.currentExercise } as Exercise];
        this.resetExerciseForm();
        this.toastr.success('Ejercicio añadido correctamente');
      }
    }
  }

  // Método para editar un ejercicio existente
  editExercise(index: number): void {
    const exercise = this.exercises[index];
    this.currentExercise = {
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight || 0,
      rest: exercise.rest || '60',
      muscleGroups: exercise.muscleGroups || exercise.muscle_groups || [],
      focus: exercise.focus || '',
      day: exercise.day,
    };
    this.editMode = true;
    this.editIndex = index;
    this.activeDay = exercise.day;
  }

  // Método para eliminar un ejercicio
  removeExercise(index: number): void {
    const exercise = this.exercises[index];
    
    if (exercise.id) {
      // Si el ejercicio tiene ID, eliminar a través del servicio
      this.exerciseService.deleteExercise(exercise.id).subscribe({
        next: () => {
          this.exercises = this.exercises.filter((_, i) => i !== index);
          this.toastr.info('Ejercicio eliminado');
        },
        error: (error) => {
          console.error('Error al eliminar ejercicio:', error);
          this.toastr.error('Error al eliminar el ejercicio');
        }
      });
    } else {
      // Eliminar localmente
      this.exercises = this.exercises.filter((_, i) => i !== index);
      this.toastr.info('Ejercicio eliminado');
    }
  }

  // Método para cancelar la edición
  cancelEdit(): void {
    this.resetExerciseForm();
    this.editMode = false;
    this.editIndex = null;
  }

  // Método para resetear el formulario de ejercicio
  resetExerciseForm(): void {
    this.currentExercise = {
      name: '',
      sets: 3,
      reps: '10',
      weight: 0,
      rest: '60',
      muscleGroups: [],
      focus: '',
      day: this.activeDay,
    };
  }

  // Método para manejar el envío del formulario
  handleSubmit(): void {
    if (!this.title) {
      this.toastr.error('El título del entrenamiento es obligatorio');
      return;
    }
    
    if (this.exercises.length === 0) {
      this.toastr.error('Debes añadir al menos un ejercicio');
      return;
    }
    
    // Verificar que cada ejercicio tenga los campos requeridos
    const invalidExercises = this.exercises.filter(exercise => !exercise.name || !exercise.sets || !exercise.reps);
    if (invalidExercises.length > 0) {
      this.toastr.error('Hay ejercicios con información incompleta');
      return;
    }
    
    // Asegurarse de que todos los tipos de datos sean correctos
    const validatedExercises = this.exercises.map(exercise => ({
      id: exercise.id,
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
    this.onSubmit.emit({
      title: String(this.title),
      exercises: validatedExercises,
      notes: this.notes ? String(this.notes) : '',
    });
  }

  // Método para cancelar el formulario
  handleCancel(): void {
    this.onCancel.emit();
  }
}
