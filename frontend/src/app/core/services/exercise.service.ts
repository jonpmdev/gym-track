import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Exercise } from '../models/exercise.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private apiUrl = environment.apiUrl || 'http://localhost:5000';
  
  constructor(private http: HttpClient) {}

  // Obtener ejercicios por ID de entrenamiento
  getExercisesByWorkout(workoutId: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/api/exercises/workout/${workoutId}`)
      .pipe(
        catchError(this.handleError<Exercise[]>(`getExercisesByWorkout workoutId=${workoutId}`, []))
      );
  }

  // Obtener un ejercicio por ID
  getExerciseById(id: string): Observable<Exercise | null> {
    return this.http.get<Exercise>(`${this.apiUrl}/api/exercises/${id}`)
      .pipe(
        catchError(this.handleError<Exercise | null>(`getExerciseById id=${id}`, null))
      );
  }

  // Crear un nuevo ejercicio
  createExercise(exercise: Omit<Exercise, 'id'>): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.apiUrl}/api/exercises`, exercise)
      .pipe(
        catchError(this.handleError<Exercise>('createExercise'))
      );
  }

  // Actualizar un ejercicio existente
  updateExercise(id: string, exercise: Partial<Exercise>): Observable<Exercise | null> {
    return this.http.put<Exercise>(`${this.apiUrl}/api/exercises/${id}`, exercise)
      .pipe(
        catchError(this.handleError<Exercise | null>(`updateExercise id=${id}`, null))
      );
  }

  // Eliminar un ejercicio
  deleteExercise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/exercises/${id}`)
      .pipe(
        map(() => undefined),
        catchError(this.handleError<void>(`deleteExercise id=${id}`))
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