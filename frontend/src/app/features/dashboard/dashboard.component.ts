import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { WorkoutService } from '../../core/services/workout.service';
import { Workout } from '../../core/models/workout.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  workouts: Workout[] = [];
  loading = true;
  userName = 'Usuario';

  constructor(
    private router: Router,
    private authService: AuthService,
    private workoutService: WorkoutService
  ) {
  }

  ngOnInit(): void {
    this.fetchWorkouts();
    
    // Obtener nombre de usuario si está disponible
    if (this.authService.currentUser) {
      this.userName = this.authService.currentUser.name || 'Usuario';
    }
    
    // Registrar que el componente se ha inicializado
  }

  fetchWorkouts(): void {
    this.loading = true;
    
    this.workoutService.getWorkouts().subscribe({
      next: (workouts) => {
        this.workouts = workouts || [];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  handleNewWorkout(): void {
    this.router.navigate(['/workouts'], { queryParams: { new: true } });
  }

  handleViewWorkouts(): void {
    this.router.navigate(['/workouts']);
  }
} 