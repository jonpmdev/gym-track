import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [AuthService]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', () => {
    const mockResponse = {
      token: 'test-token',
      user: { id: '1', email: 'test@example.com', name: 'Test User' }
    };

    service.login('test@example.com', 'password').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.isAuthenticated).toBeTrue();
      expect(service.token).toEqual('test-token');
      expect(service.currentUser).toEqual(mockResponse.user);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should register and store token', () => {
    const mockResponse = {
      token: 'test-token',
      user: { id: '1', email: 'test@example.com', name: 'Test User' }
    };

    service.register('test@example.com', 'password').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.isAuthenticated).toBeTrue();
      expect(service.token).toEqual('test-token');
      expect(service.currentUser).toEqual(mockResponse.user);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and clear token', () => {
    // Arrange
    spyOn(localStorage, 'removeItem');
    spyOn(router, 'navigate');
    
    // Set some initial state
    localStorage.setItem('token', 'test-token');
    service['tokenSubject'].next('test-token');
    service['currentUserSubject'].next({ id: '1', email: 'test@example.com', name: 'Test User' });
    
    // Act
    service.logout();
    
    // Assert
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(service.token).toBeNull();
    expect(service.currentUser).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
}); 