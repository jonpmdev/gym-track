import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface Measurements {
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
}

interface UserProgress {
  weight: number;
  measurements: Measurements;
  notes?: string;
}

@Component({
  selector: 'app-measurements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.scss']
})
export class MeasurementsComponent implements OnInit {
  measurementsForm: FormGroup;
  loading = true;
  submitting = false;
  error: string | null = null;
  successMessage: string | null = null;
  progressHistory: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.measurementsForm = this.formBuilder.group({
      weight: [0, [Validators.required, Validators.min(0)]],
      chest: [0, [Validators.min(0)]],
      waist: [0, [Validators.min(0)]],
      hips: [0, [Validators.min(0)]],
      biceps: [0, [Validators.min(0)]],
      thighs: [0, [Validators.min(0)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    // Aquí implementaremos el servicio para cargar los datos del usuario
    // Por ahora simulamos la carga
    setTimeout(() => {
      // Datos de ejemplo
      this.measurementsForm.patchValue({
        weight: 70,
        chest: 90,
        waist: 80,
        hips: 95,
        biceps: 35,
        thighs: 55
      });
      
      this.progressHistory = [
        {
          id: '1',
          date: new Date(),
          weight: 70,
          measurements: {
            chest: 90,
            waist: 80,
            hips: 95,
            biceps: 35,
            thighs: 55
          },
          notes: 'Progreso inicial'
        }
      ];
      
      this.loading = false;
    }, 1000);
  }

  onSubmit(): void {
    if (this.measurementsForm.invalid || this.submitting) {
      return;
    }

    this.submitting = true;
    this.error = null;

    const formValues = this.measurementsForm.value;
    
    const progressData: UserProgress = {
      weight: formValues.weight,
      measurements: {
        chest: formValues.chest,
        waist: formValues.waist,
        hips: formValues.hips,
        biceps: formValues.biceps,
        thighs: formValues.thighs
      },
      notes: formValues.notes
    };

    // Aquí implementaremos el servicio para guardar los datos
    // Por ahora simulamos el guardado
    setTimeout(() => {
      // Simulamos éxito
      this.successMessage = 'Medidas registradas correctamente';
      
      // Añadir al historial
      this.progressHistory = [
        {
          id: Date.now().toString(),
          date: new Date(),
          ...progressData
        },
        ...this.progressHistory
      ];
      
      // Limpiar notas
      this.measurementsForm.patchValue({ notes: '' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
      
      this.submitting = false;
    }, 1000);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
} 