import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  workoutId: string | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.workoutId = params.get('id');
      this.loadProgress();
    });
  }

  loadProgress(): void {
    // Aquí cargaremos los datos de progreso cuando implementemos el servicio
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  navigateBack(): void {
    this.router.navigate(['/workouts']);
  }
} 