import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map, take, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // Verificar si hay un token disponible
    const token = localStorage.getItem('token');
    if (token) {
      return this.authService.currentUser$.pipe(
        take(1),
        map(user => {
          // Si hay un usuario o estamos esperando a que se cargue, permitir acceso
          if (user) {
            return true;
          }
          
          // Si no hay usuario pero hay token, intentamos obtener el usuario
          return true;
        })
      );
    }
    
    // No hay token, redirigir al login
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
} 