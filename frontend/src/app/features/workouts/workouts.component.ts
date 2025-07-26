import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Workout } from '../../core/models/workout.model';
import { AuthService } from '../../core/services/auth.service';
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
    // Aquí implementaremos el servicio de workouts más adelante
    // Por ahora simulamos la carga
    setTimeout(() => {
      this.workouts = [];
      this.loading = false;
    }, 1000);
  }

  fetchSingleWorkout(id: string): void {
    // Aquí implementaremos el servicio de workouts más adelante
    // Por ahora simulamos la carga
    setTimeout(() => {
      this.editWorkout = null;
      this.showForm = true;
      this.loading = false;
    }, 1000);
  }

  handleCreateWorkout(workoutData: any): void {
    // Implementar más adelante
    console.log('Crear workout:', workoutData);
    this.toastr.success('Entrenamiento creado correctamente');
    this.showForm = false;
  }

  handleUpdateWorkout(workoutData: any): void {
    // Implementar más adelante
    console.log('Actualizar workout:', workoutData);
    this.toastr.success('Entrenamiento actualizado correctamente');
    this.showForm = false;
    this.editWorkout = null;
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
        // Implementar más adelante
        console.log('Eliminar workout:', id);
        this.toastr.success('Entrenamiento eliminado correctamente');
      }
    });
  }

  handleViewWorkout(workout: Workout): void {
    this.router.navigate(['/workouts', workout.id]);
  }

  handleNewWorkout(): void {
    this.router.navigate(['/workouts'], { queryParams: { new: true } });
  }

  handleFormCancel(): void {
    this.showForm = false;
    this.editWorkout = null;
    this.router.navigate(['/workouts']);
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
    return Array.from(days);
  }
} 