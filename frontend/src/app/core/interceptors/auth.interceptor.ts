import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// Interceptor funcional para Angular moderno
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Obtener el token directamente del localStorage
  const token = localStorage.getItem('token');
  
  // No procesar peticiones a /api/auth/me para evitar redirecciones cíclicas
  const isAuthCheckRequest = req.url.includes('/api/auth/me');
  
  if (token) {
    req = addToken(req, token);
  } else {
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Solo redirigir al login si no es una petición de verificación de autenticación
      if (error.status === 401 && !isAuthCheckRequest) {
        // En lugar de usar authService.logout(), hacemos la limpieza directamente
        localStorage.removeItem('token');
        router.navigate(['/login'], { 
          queryParams: { 
            returnUrl: router.url,
            error: 'sesion_expirada'
          } 
        });
      }
      return throwError(() => error);
    })
  );
};

// Función auxiliar para añadir el token
function addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

// Mantener la clase para compatibilidad con versiones anteriores si es necesario
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token directamente del localStorage
    const token = localStorage.getItem('token');
    
    // No procesar peticiones a /api/auth/me para evitar redirecciones cíclicas
    const isAuthCheckRequest = request.url.includes('/api/auth/me');
    
    if (token) {
      request = addToken(request, token);
    } else {
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        
        // Solo redirigir al login si no es una petición de verificación de autenticación
        if (error.status === 401 && !isAuthCheckRequest) {
          // En lugar de usar authService.logout(), hacemos la limpieza directamente
          localStorage.removeItem('token');
          this.router.navigate(['/login'], { 
            queryParams: { 
              returnUrl: this.router.url,
              error: 'sesion_expirada'
            } 
          });
        }
        return throwError(() => error);
      })
    );
  }
} 