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
    console.log('WorkoutFormComponent initialized with initialData:', this.initialData);
    
    if (this.initialData) {
      this.title = this.initialData.title;
      this.notes = this.initialData.notes || '';
      
      // Si hay un ID de entrenamiento, cargar ejercicios desde el servicio
      if (this.initialData.id) {
        console.log('Loading exercises for workout ID:', this.initialData.id);
        this.loadExercises(this.initialData.id);
      } else if (this.initialData.exercises && this.initialData.exercises.length > 0) {
        // Si no hay ID pero sí hay ejercicios en initialData, usarlos directamente
        console.log('Using exercises from initialData:', this.initialData.exercises);
        this.exercises = [...this.initialData.exercises];
        
        // Encontrar el primer día que tenga ejercicios
        if (this.exercises.length > 0) {
          // Obtener todos los días que tienen ejercicios
          const daysWithExercises = this.DAYS_OF_WEEK.filter(day => 
            this.exercises.some(exercise => exercise.day === day)
          );
          
          // Seleccionar el primer día que tenga ejercicios
          if (daysWithExercises.length > 0) {
            this.activeDay = daysWithExercises[0];
          } else {
            // Si no hay días con ejercicios, usar el día del primer ejercicio como fallback
            this.activeDay = this.exercises[0].day;
          }
          
          // Actualizar el día del ejercicio actual
          this.currentExercise = {
            ...this.currentExercise,
            day: this.activeDay
          };
        }
      }
    }
  }

  // Cargar ejercicios desde el servicio
  loadExercises(workoutId: string): void {
    console.log('Calling exerciseService.getExercisesByWorkout with ID:', workoutId);
    this.exerciseService.getExercisesByWorkout(workoutId).subscribe({
      next: (exercises) => {
        console.log('Exercises loaded successfully:', exercises);
        // Transformar los ejercicios para asegurar compatibilidad con el formulario
        this.exercises = exercises.map(exercise => {
          // Asegurar que muscleGroups esté disponible para el formulario
          return {
            ...exercise,
            muscleGroups: exercise.muscle_groups || []
          };
        });
        
        // Encontrar el primer día que tenga ejercicios
        if (exercises.length > 0) {
          // Obtener todos los días que tienen ejercicios
          const daysWithExercises = this.DAYS_OF_WEEK.filter(day => 
            exercises.some(exercise => exercise.day === day)
          );
          
          // Seleccionar el primer día que tenga ejercicios
          if (daysWithExercises.length > 0) {
            this.activeDay = daysWithExercises[0];
          } else {
            // Si no hay días con ejercicios, usar el día del primer ejercicio como fallback
            this.activeDay = exercises[0].day;
          }
          
          // Actualizar el día del ejercicio actual
          this.currentExercise = {
            ...this.currentExercise,
            day: this.activeDay
          };
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

    // Asegurarse de que usamos muscle_groups en lugar de muscleGroups
    const exerciseToSave: any = {
      ...this.currentExercise,
      muscle_groups: this.currentExercise.muscleGroups || []
    };
    delete exerciseToSave.muscleGroups;

    if (this.editMode && this.editIndex !== null) {
      // Actualizar ejercicio existente
      const exercise = this.exercises[this.editIndex];
      
      // Preservar el ID del ejercicio original
      if (exercise.id) {
        exerciseToSave.id = exercise.id;
      }
      
      // Primero actualizamos localmente para evitar la desaparición
      const updatedExercises = [...this.exercises];
      updatedExercises[this.editIndex] = { 
        ...exerciseToSave,
        id: exercise.id,
        muscleGroups: exerciseToSave.muscle_groups // Asegurar que muscleGroups esté disponible
      } as Exercise;
      this.exercises = updatedExercises;
      
      if (exercise.id && this.initialData?.id) {
        // Si el ejercicio tiene ID, actualizar a través del servicio
        console.log('Actualizando ejercicio con ID:', exercise.id, exerciseToSave);
        
        this.exerciseService.updateExercise(exercise.id, {
          ...exerciseToSave,
          workout_id: this.initialData.id
        }).subscribe({
          next: (updatedExercise) => {
            console.log('Ejercicio actualizado correctamente:', updatedExercise);

            this.toastr.success('Ejercicio actualizado correctamente');
            this.editMode = false;
            this.editIndex = null;
            this.resetExerciseForm();
          },
          error: (error) => {
            console.error('Error al actualizar ejercicio:', error);
            this.toastr.error('Error al actualizar el ejercicio');
            // No reseteamos el modo de edición en caso de error para permitir reintentar
          }
        });
      } else {
        // Solo actualización local
        this.toastr.success('Ejercicio actualizado correctamente');
        this.editMode = false;
        this.editIndex = null;
        this.resetExerciseForm();
      }
    } else {
      if (this.initialData?.id) {
        // Si hay un ID de entrenamiento, crear a través del servicio
        this.exerciseService.createExercise({
          ...exerciseToSave,
          workout_id: this.initialData.id
        }).subscribe({
          next: (newExercise) => {
            if (newExercise) {
              this.exercises = [...this.exercises, {
                ...newExercise,
                muscleGroups: newExercise.muscle_groups || []
              }];
            }
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
        this.exercises = [...this.exercises, { 
          ...exerciseToSave,
          muscleGroups: exerciseToSave.muscle_groups
        } as Exercise];
        this.resetExerciseForm();
        this.toastr.success('Ejercicio añadido correctamente');
      }
    }
  }

  // Método para editar un ejercicio existente
  editExercise(index: number): void {
    const exercise = this.exercises[index];
    // Usar muscle_groups si muscleGroups no está disponible
    const muscleGroups = exercise.muscleGroups || exercise.muscle_groups || [];
    
    this.currentExercise = {
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight || 0,
      rest: exercise.rest || '60',
      muscleGroups: muscleGroups,
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
    const validatedExercises = this.exercises.map(exercise => {
      // Usar muscle_groups y eliminar muscleGroups para evitar duplicación
      const muscleGroups = exercise.muscleGroups || exercise.muscle_groups || [];
      
      // Mantener el ID del ejercicio si existe (importante para actualizaciones)
      return {
        id: exercise.id,
        name: String(exercise.name),
        sets: Number(exercise.sets),
        reps: String(exercise.reps),
        weight: exercise.weight !== undefined ? Number(exercise.weight) : 0,
        rest: exercise.rest !== undefined ? String(exercise.rest) : '60',
        muscle_groups: muscleGroups.map(String),
        focus: exercise.focus !== undefined ? String(exercise.focus) : '',
        day: String(exercise.day)
      };
    });
    
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
