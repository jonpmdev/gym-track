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
    console.log(`Calling API: GET ${this.apiUrl}/api/exercises/workout/${workoutId}`);
    return this.http.get<{success: boolean, data: Exercise[]}>(`${this.apiUrl}/api/exercises/workout/${workoutId}`)
      .pipe(
        map(response => {
          console.log('API response for getExercisesByWorkout:', response);
          return response.data;
        }),
        catchError(this.handleError<Exercise[]>(`getExercisesByWorkout workoutId=${workoutId}`, []))
      );
  }

  // Obtener un ejercicio por ID
  getExerciseById(id: string): Observable<Exercise | null> {
    return this.http.get<{success: boolean, data: Exercise}>(`${this.apiUrl}/api/exercises/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError<Exercise | null>(`getExerciseById id=${id}`, null))
      );
  }

  // Crear un nuevo ejercicio
  createExercise(exercise: Omit<Exercise, 'id'>): Observable<Exercise> {
    // Asegurarse de que solo se envía muscle_groups y no muscleGroups
    const exerciseData = { ...exercise };
    if (exerciseData.muscleGroups) {
      exerciseData.muscle_groups = exerciseData.muscleGroups;
      delete exerciseData.muscleGroups;
    }
    
    return this.http.post<{success: boolean, data: Exercise}>(`${this.apiUrl}/api/exercises`, exerciseData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError<Exercise>('createExercise'))
      );
  }

  // Actualizar un ejercicio existente
  updateExercise(id: string, exercise: Partial<Exercise>): Observable<Exercise | null> {
    // Asegurarse de que solo se envía muscle_groups y no muscleGroups
    const exerciseData = { ...exercise };
    if (exerciseData.muscleGroups) {
      exerciseData.muscle_groups = exerciseData.muscleGroups;
      delete exerciseData.muscleGroups;
    }
    
    return this.http.put<{success: boolean, data: Exercise}>(`${this.apiUrl}/api/exercises/${id}`, exerciseData)
      .pipe(
        map(response => response.data),
        catchError(this.handleError<Exercise | null>(`updateExercise id=${id}`, null))
      );
  }

  // Eliminar un ejercicio
  deleteExercise(id: string): Observable<void> {
    return this.http.delete<{success: boolean, message: string}>(`${this.apiUrl}/api/exercises/${id}`)
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