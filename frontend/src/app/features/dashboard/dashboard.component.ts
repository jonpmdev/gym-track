import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { WorkoutService } from '../../core/services/workout.service';
import { Workout } from '../../core/models/workout.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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
    console.log('DashboardComponent constructor called');
  }

  ngOnInit(): void {
    console.log('DashboardComponent ngOnInit called');
    this.fetchWorkouts();
    
    // Obtener nombre de usuario si está disponible
    if (this.authService.currentUser) {
      this.userName = this.authService.currentUser.name || 'Usuario';
    }
    
    // Registrar que el componente se ha inicializado
    console.log('Dashboard component initialized');
  }

  fetchWorkouts(): void {
    console.log('Fetching workouts from dashboard component...');
    this.loading = true;
    
    this.workoutService.getWorkouts().subscribe({
      next: (workouts) => {
        console.log('Workouts received:', workouts);
        this.workouts = workouts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching workouts:', error);
        this.loading = false;
      }
    });
  }

  handleNewWorkout(): void {
    console.log('Navigating to new workout form');
    this.router.navigate(['/workouts'], { queryParams: { new: true } });
  }

  handleViewWorkouts(): void {
    console.log('Navigating to workouts list');
    this.router.navigate(['/workouts']);
  }
} 