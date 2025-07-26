import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Workout } from '../models/workout.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private apiUrl = environment.apiUrl || 'http://localhost:5000';
  
  // Datos simulados para desarrollo
  private mockWorkouts: Workout[] = [
    {
      id: '1',
      title: 'Entrenamiento de Fuerza',
      exercises: [
        {
          id: '101',
          name: 'Press de Banca',
          sets: 4,
          reps: '10',
          weight: 80,
          rest: '90',
          day: 'Lunes',
          muscleGroups: ['Pecho', 'Tríceps']
        },
        {
          id: '102',
          name: 'Sentadillas',
          sets: 4,
          reps: '12',
          weight: 100,
          rest: '120',
          day: 'Lunes',
          muscleGroups: ['Piernas', 'Glúteos']
        }
      ],
      notes: 'Enfoque en técnica y progresión de peso',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Entrenamiento de Hipertrofia',
      exercises: [
        {
          id: '201',
          name: 'Curl de Bíceps',
          sets: 3,
          reps: '12-15',
          weight: 15,
          rest: '60',
          day: 'Miércoles',
          muscleGroups: ['Bíceps']
        },
        {
          id: '202',
          name: 'Extensiones de Tríceps',
          sets: 3,
          reps: '12-15',
          weight: 20,
          rest: '60',
          day: 'Miércoles',
          muscleGroups: ['Tríceps']
        }
      ],
      notes: 'Enfoque en contracción muscular y tiempo bajo tensión',
      createdAt: new Date().toISOString()
    }
  ];

  constructor(private http: HttpClient) {
    console.log('WorkoutService initialized');
  }

  // Obtener todos los entrenamientos
  getWorkouts(): Observable<Workout[]> {
    console.log('Fetching workouts from service');
    
    // Modo desarrollo: devolver datos simulados
    return of(this.mockWorkouts).pipe(
      delay(800) // Simular latencia de red
    );
    
    // Implementación real para producción:
    // return this.http.get<Workout[]>(`${this.apiUrl}/api/workouts`);
  }

  // Obtener un entrenamiento por ID
  getWorkout(id: string): Observable<Workout> {
    console.log(`Fetching workout with id ${id}`);
    
    // Modo desarrollo: devolver dato simulado
    const workout = this.mockWorkouts.find(w => w.id === id);
    if (workout) {
      return of(workout).pipe(delay(500));
    }
    
    // Si no se encuentra, devolver un objeto vacío
    return of({
      id: '',
      title: '',
      exercises: [],
      notes: ''
    }).pipe(delay(500));
    
    // Implementación real para producción:
    // return this.http.get<Workout>(`${this.apiUrl}/api/workouts/${id}`);
  }

  // Crear un nuevo entrenamiento
  createWorkout(workout: Omit<Workout, 'id'>): Observable<Workout> {
    console.log('Creating new workout:', workout);
    
    // Modo desarrollo: simular creación
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    // Añadir al array de simulación
    this.mockWorkouts.push(newWorkout);
    
    return of(newWorkout).pipe(delay(800));
    
    // Implementación real para producción:
    // return this.http.post<Workout>(`${this.apiUrl}/api/workouts`, workout);
  }

  // Actualizar un entrenamiento existente
  updateWorkout(id: string, workout: Omit<Workout, 'id'>): Observable<Workout> {
    console.log(`Updating workout with id ${id}:`, workout);
    
    // Modo desarrollo: simular actualización
    const index = this.mockWorkouts.findIndex(w => w.id === id);
    if (index !== -1) {
      const updatedWorkout: Workout = {
        ...workout,
        id,
        updatedAt: new Date().toISOString()
      };
      
      this.mockWorkouts[index] = updatedWorkout;
      return of(updatedWorkout).pipe(delay(800));
    }
    
    return of({
      id: '',
      title: '',
      exercises: [],
      notes: ''
    }).pipe(delay(500));
    
    // Implementación real para producción:
    // return this.http.put<Workout>(`${this.apiUrl}/api/workouts/${id}`, workout);
  }

  // Eliminar un entrenamiento
  deleteWorkout(id: string): Observable<void> {
    console.log(`Deleting workout with id ${id}`);
    
    // Modo desarrollo: simular eliminación
    const index = this.mockWorkouts.findIndex(w => w.id === id);
    if (index !== -1) {
      this.mockWorkouts.splice(index, 1);
    }
    
    return of(undefined).pipe(delay(800));
    
    // Implementación real para producción:
    // return this.http.delete<void>(`${this.apiUrl}/api/workouts/${id}`);
  }
}
