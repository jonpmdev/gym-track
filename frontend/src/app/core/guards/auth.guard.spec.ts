import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let userSubject: BehaviorSubject<User | null>;

  beforeEach(() => {
    userSubject = new BehaviorSubject<User | null>(null);
    
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: userSubject.asObservable()
    });
    
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is authenticated', (done) => {
    // Set authenticated user
    const mockUser: User = { id: '1', name: 'Test User', email: 'test@example.com' };
    userSubject.next(mockUser);
    
    // Test the guard
    guard.canActivate(
      {} as any, // ActivatedRouteSnapshot
      { url: '/dashboard' } as any // RouterStateSnapshot
    ).subscribe(result => {
      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should redirect to login when user is not authenticated', (done) => {
    // Set unauthenticated user
    userSubject.next(null);
    
    // Test the guard
    guard.canActivate(
      {} as any, // ActivatedRouteSnapshot
      { url: '/dashboard' } as any // RouterStateSnapshot
    ).subscribe(result => {
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/dashboard' } });
      done();
    });
  });
}); 