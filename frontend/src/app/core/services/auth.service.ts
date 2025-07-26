import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  private apiUrl = environment.apiUrl || 'http://localhost:5000';
  
  // Modo de desarrollo - permite navegar sin autenticación
  private devMode = true;

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
    // En modo desarrollo, siempre devuelve true
    if (this.devMode) return true;
    return !!this.tokenSubject.value;
  }

  private checkAuth(): void {
    try {
      // En modo desarrollo, simula un usuario autenticado
      if (this.devMode) {
        const mockUser: User = {
          id: 'dev-user-id',
          email: 'dev@example.com',
          name: 'Usuario Desarrollo'
        };
        this.currentUserSubject.next(mockUser);
        this.loadingSubject.next(false);
        return;
      }
      
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        this.loadingSubject.next(false);
        return;
      }

      this.tokenSubject.next(storedToken);
      console.log('Verificando autenticación con token:', storedToken.substring(0, 20) + '...');
      
      this.http.get<{ user: User }>(`${this.apiUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      }).pipe(
        tap(response => {
          console.log('Usuario autenticado:', response.user);
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          console.error('Error al verificar autenticación:', error);
          localStorage.removeItem('token');
          this.tokenSubject.next(null);
          return throwError(() => error);
        })
      ).subscribe({
        complete: () => this.loadingSubject.next(false)
      });
    } catch (error) {
      console.error('Error en checkAuth:', error);
      localStorage.removeItem('token');
      this.tokenSubject.next(null);
      this.loadingSubject.next(false);
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // En modo desarrollo, simula un login exitoso
    if (this.devMode) {
      const mockResponse: AuthResponse = {
        token: 'dev-token',
        user: {
          id: 'dev-user-id',
          email: email,
          name: 'Usuario Desarrollo'
        }
      };
      
      return of(mockResponse).pipe(
        tap(response => {
          this.currentUserSubject.next(response.user);
          this.tokenSubject.next(response.token);
        })
      );
    }
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, { email, password })
      .pipe(
        tap(response => {
          console.log('Login exitoso, token recibido:', response.token.substring(0, 20) + '...');
          localStorage.setItem('token', response.token);
          this.tokenSubject.next(response.token);
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          console.error('Error en login:', error);
          return throwError(() => new Error(error.error?.message || 'Error al iniciar sesión'));
        })
      );
  }

  register(email: string, password: string): Observable<AuthResponse> {
    // En modo desarrollo, simula un registro exitoso
    if (this.devMode) {
      const mockResponse: AuthResponse = {
        token: 'dev-token',
        user: {
          id: 'dev-user-id',
          email: email,
          name: 'Usuario Desarrollo'
        }
      };
      
      return of(mockResponse).pipe(
        tap(response => {
          this.currentUserSubject.next(response.user);
          this.tokenSubject.next(response.token);
        })
      );
    }
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, { email, password })
      .pipe(
        tap(response => {
          console.log('Registro exitoso, token recibido:', response.token.substring(0, 20) + '...');
          localStorage.setItem('token', response.token);
          this.tokenSubject.next(response.token);
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          console.error('Error en registro:', error);
          return throwError(() => new Error(error.error?.message || 'Error al registrar usuario'));
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