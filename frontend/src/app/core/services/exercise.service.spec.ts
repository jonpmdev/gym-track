import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExerciseService } from './exercise.service';
import { Exercise } from '../models/exercise.model';
import { environment } from '../../../environments/environment';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl || 'http://localhost:5000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExerciseService]
    });
    service = TestBed.inject(ExerciseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get exercises by workout ID', () => {
    const workoutId = '123';
    const mockExercises: Exercise[] = [
      {
        id: '1',
        name: 'Sentadillas',
        sets: 3,
        reps: '10',
        weight: 50,
        rest: '60',
        day: 'Lunes',
        workout_id: workoutId
      }
    ];

    service.getExercisesByWorkout(workoutId).subscribe(exercises => {
      expect(exercises).toEqual(mockExercises);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/exercises/workout/${workoutId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockExercises);
  });

  it('should get exercise by ID', () => {
    const exerciseId = '1';
    const mockExercise: Exercise = {
      id: exerciseId,
      name: 'Sentadillas',
      sets: 3,
      reps: '10',
      weight: 50,
      rest: '60',
      day: 'Lunes',
      workout_id: '123'
    };

    service.getExerciseById(exerciseId).subscribe(exercise => {
      expect(exercise).toEqual(mockExercise);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/exercises/${exerciseId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockExercise);
  });

  it('should create a new exercise', () => {
    const newExercise = {
      name: 'Sentadillas',
      sets: 3,
      reps: '10',
      weight: 50,
      rest: '60',
      day: 'Lunes',
      workout_id: '123'
    };

    const mockResponse: Exercise = {
      id: '1',
      ...newExercise
    };

    service.createExercise(newExercise).subscribe(exercise => {
      expect(exercise).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/exercises`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newExercise);
    req.flush(mockResponse);
  });

  it('should update an exercise', () => {
    const exerciseId = '1';
    const exerciseUpdate = {
      name: 'Sentadillas modificadas',
      sets: 4
    };

    const mockResponse: Exercise = {
      id: exerciseId,
      name: 'Sentadillas modificadas',
      sets: 4,
      reps: '10',
      weight: 50,
      rest: '60',
      day: 'Lunes',
      workout_id: '123'
    };

    service.updateExercise(exerciseId, exerciseUpdate).subscribe(exercise => {
      expect(exercise).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/exercises/${exerciseId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(exerciseUpdate);
    req.flush(mockResponse);
  });

  it('should delete an exercise', () => {
    const exerciseId = '1';

    service.deleteExercise(exerciseId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/api/exercises/${exerciseId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
}); 