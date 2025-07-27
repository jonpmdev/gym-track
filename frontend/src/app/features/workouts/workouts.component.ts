import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Workout } from '../../core/models/workout.model';
import { AuthService } from '../../core/services/auth.service';
import { WorkoutService } from '../../core/services/workout.service';
import { WorkoutFormComponent } from './workout-form/workout-form.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [CommonModule, WorkoutFormComponent],
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.scss']
})
export class WorkoutsComponent implements OnInit {
  workouts: Workout[] = [];
  loading = true;
  showForm = false;
  editWorkout: Workout | null = null;

  constructor(
    public router: Router, // Cambiado a público para acceder desde la plantilla
    private route: ActivatedRoute,
    private authService: AuthService,
    private workoutService: WorkoutService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchWorkouts();
    
    // Manejar parámetros de URL
    this.route.queryParams.subscribe(params => {
      const newParam = params['new'];
      const idParam = params['id'];
      
      if (newParam === 'true') {
        this.showForm = true;
        this.editWorkout = null;
      } else if (idParam) {
        this.fetchSingleWorkout(idParam);
      }
    });
  }

  fetchWorkouts(): void {
    this.loading = true;
    this.workoutService.getWorkouts().subscribe({
      next: (workouts) => {
        this.workouts = workouts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar entrenamientos:', error);
        this.toastr.error('Error al cargar los entrenamientos');
        this.loading = false;
      }
    });
  }

  fetchSingleWorkout(id: string): void {
    this.loading = true;
    console.log('Fetching workout with ID:', id);
    this.workoutService.getWorkout(id).subscribe({
      next: (workout) => {
        console.log('Workout fetched successfully:', workout);
        this.editWorkout = workout;
        this.showForm = true;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar entrenamiento:', error);
        this.toastr.error('Error al cargar el entrenamiento');
        this.loading = false;
      }
    });
  }

  handleCreateWorkout(workoutData: any): void {
    this.workoutService.createWorkout(workoutData).subscribe({
      next: (workout) => {
        this.toastr.success('Entrenamiento creado correctamente');
        this.showForm = false;
        this.fetchWorkouts();
      },
      error: (error) => {
        console.error('Error al crear entrenamiento:', error);
        this.toastr.error('Error al crear el entrenamiento');
      }
    });
  }

  handleUpdateWorkout(workoutData: any): void {
    if (!this.editWorkout?.id) return;
    
    this.workoutService.updateWorkout(this.editWorkout.id, workoutData).subscribe({
      next: (workout) => {
        this.toastr.success('Entrenamiento actualizado correctamente');
        this.showForm = false;
        this.editWorkout = null;
        this.fetchWorkouts();
      },
      error: (error) => {
        console.error('Error al actualizar entrenamiento:', error);
        this.toastr.error('Error al actualizar el entrenamiento');
      }
    });
  }

  handleDeleteWorkout(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.workoutService.deleteWorkout(id).subscribe({
          next: () => {
            this.toastr.success('Entrenamiento eliminado correctamente');
            this.fetchWorkouts();
          },
          error: (error) => {
            console.error('Error al eliminar entrenamiento:', error);
            this.toastr.error('Error al eliminar el entrenamiento');
          }
        });
      }
    });
  }

  handleViewWorkout(workout: Workout): void {
    // Cargar el entrenamiento para edición
    this.fetchSingleWorkout(workout.id);
  }

  handleNewWorkout(): void {
    this.router.navigate(['/workouts'], { queryParams: { new: true } });
  }

  handleFormCancel(): void {
    this.showForm = false;
    this.editWorkout = null;
    // Asegurar que se limpie la URL y se recarguen los datos
    this.router.navigate(['/workouts']).then(() => {
      this.fetchWorkouts();
    });
  }

  handleFormSubmit(workoutData: any): void {
    if (this.editWorkout) {
      this.handleUpdateWorkout(workoutData);
    } else {
      this.handleCreateWorkout(workoutData);
    }
  }

  // Agrupar ejercicios por día
  getExercisesByDay(workout: Workout): string[] {
    const days = new Set(workout.exercises.map(exercise => exercise.day));
    const daysArray = Array.from(days);
    
    // Orden de los días de la semana
    const dayOrder: Record<string, number> = {
      'Lunes': 1,
      'Martes': 2,
      'Miércoles': 3,
      'Jueves': 4,
      'Viernes': 5,
      'Sábado': 6,
      'Domingo': 7
    };
    
    // Ordenar los días según el orden de la semana
    return daysArray.sort((a, b) => {
      // Usar valores predeterminados si el día no está en dayOrder
      const orderA = dayOrder[a] || 999;
      const orderB = dayOrder[b] || 999;
      return orderA - orderB;
    });
  }
} 