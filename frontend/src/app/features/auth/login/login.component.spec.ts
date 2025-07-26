import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        LoginComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark form as valid when filled correctly', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should show validation errors when email is invalid', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    
    expect(emailControl?.hasError('email')).toBeTruthy();
  });

  it('should show validation errors when password is too short', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('12345');
    passwordControl?.markAsTouched();
    fixture.detectChanges();
    
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
  });

  it('should call auth service and navigate on successful login', () => {
    // Arrange
    const mockResponse = { token: 'test-token', user: { id: '1', email: 'test@example.com' } };
    authServiceSpy.login.and.returnValue(of(mockResponse));
    component.returnUrl = '/dashboard';
    
    // Fill the form
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Act
    component.onSubmit();
    
    // Assert
    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('should show error message on login failure', () => {
    // Arrange
    const errorMessage = 'Invalid credentials';
    authServiceSpy.login.and.returnValue(throwError(() => new Error(errorMessage)));
    
    // Fill the form
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'wrong-password'
    });
    
    // Act
    component.onSubmit();
    
    // Assert
    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'wrong-password');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.error).toBe(errorMessage);
  });
}); 