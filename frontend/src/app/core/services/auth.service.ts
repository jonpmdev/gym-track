import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private tokenValidatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public tokenValidated$ = this.tokenValidatedSubject.asObservable();

  private apiUrl = environment.apiUrl || 'http://localhost:5000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuth();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.tokenSubject.value && this.tokenValidatedSubject.value;
  }

  private checkAuth(): void {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        this.loadingSubject.next(false);
        this.tokenValidatedSubject.next(false);
        return;
      }

      this.tokenSubject.next(storedToken);
      
      // Usar el token del localStorage directamente para evitar dependencia circular
      this.fetchCurrentUser(storedToken).subscribe({
        next: (user) => {
          this.tokenValidatedSubject.next(true);
        },
        error: (error) => {
          localStorage.removeItem('token');
          this.tokenSubject.next(null);
          this.tokenValidatedSubject.next(false);
        },
        complete: () => this.loadingSubject.next(false)
      });
    } catch (error) {
      localStorage.removeItem('token');
      this.tokenSubject.next(null);
      this.tokenValidatedSubject.next(false);
      this.loadingSubject.next(false);
    }
  }

  // Método separado para obtener el usuario actual
  fetchCurrentUser(token: string): Observable<User> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      tap(response => {
        this.currentUserSubject.next(response.user);
      }),
      map(response => response.user),
      catchError(error => {
        console.error('Error al obtener el usuario actual:', error);
        localStorage.removeItem('token');
        this.tokenSubject.next(null);
        return throwError(() => error);
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.tokenSubject.next(response.token);
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          let errorMessage = 'Error al iniciar sesión';
          
          if (error.status === 401) {
            errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
          } else if (error.status === 500) {
            errorMessage = 'Error en el servidor. Inténtalo más tarde.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  register(email: string, password: string): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.tokenSubject.next(response.token);
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          let errorMessage = 'Error al registrar usuario';
          
          if (error.status === 400) {
            errorMessage = error.error?.message || 'El correo electrónico ya está registrado';
          } else if (error.status === 500) {
            errorMessage = 'Error en el servidor. Inténtalo más tarde.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
} 