import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Workout } from '../models/workout.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private apiUrl = environment.apiUrl || 'http://localhost:5000';
  
  constructor(private http: HttpClient) {
  }

  // MÉTODOS DE WORKOUTS

  // Obtener todos los entrenamientos
  getWorkouts(): Observable<Workout[]> {
    return this.http.get<Workout[]>(`${this.apiUrl}/api/workouts`)
      .pipe(
        map(response => {   
          return response;
        }),
        catchError(this.handleError<Workout[]>('getWorkouts', []))
      );
  }

  // Obtener un entrenamiento por ID
  getWorkout(id: string): Observable<Workout> {
    console.log(`Calling API: GET ${this.apiUrl}/api/workouts/${id}`);
    return this.http.get<{workout: Workout}>(`${this.apiUrl}/api/workouts/${id}`)
      .pipe(
        map(response => {
          console.log('API response for getWorkout:', response);
          return response.workout;
        }),
        catchError(this.handleError<Workout>(`getWorkout id=${id}`))
      );
  }

  // Crear un nuevo entrenamiento
  createWorkout(workout: Omit<Workout, 'id'>): Observable<Workout> {
    return this.http.post<{workout: Workout}>(`${this.apiUrl}/api/workouts`, workout)
      .pipe(
        map(response => response.workout),
        catchError(this.handleError<Workout>('createWorkout'))
      );
  }

  // Actualizar un entrenamiento existente
  updateWorkout(id: string, workout: Omit<Workout, 'id'>): Observable<Workout> {
    return this.http.put<{workout: Workout}>(`${this.apiUrl}/api/workouts/${id}`, workout)
      .pipe(
        map(response => response.workout),
        catchError(this.handleError<Workout>(`updateWorkout id=${id}`))
      );
  }

  // Eliminar un entrenamiento
  deleteWorkout(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/workouts/${id}`)
      .pipe(
        map(() => undefined),
        catchError(this.handleError<void>(`deleteWorkout id=${id}`))
      );
  }

  /**
   * Manejador de errores HTTP
   * @param operation - nombre de la operación que falló
   * @param result - valor opcional a devolver como observable
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // Si es un error de autenticación (401), no necesitamos manejarlo aquí
      // ya que el interceptor se encargará de redirigir al login
      
      // Para otros errores, podemos devolver un mensaje personalizado
      let errorMessage = `Error en ${operation}`;
      
      if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Datos inválidos';
      } else if (error.status === 500) {
        errorMessage = 'Error en el servidor';
      }
      
      // Devolver un resultado vacío para seguir la cadena de observables
      return throwError(() => new Error(errorMessage));
    };
  }
}
