'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import './register.css';

const validatePassword = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  return {
    ...checks,
    score: Object.values(checks).filter(Boolean).length,
  };
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const { register } = useAuth();

  useEffect(() => {
    setPasswordStrength(validatePassword(formData.password));
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar email
    if (!validateEmail(formData.email)) {
      setError('Por favor, introduce un email válido');
      return;
    }

    // Validar contraseña
    if (passwordStrength.score < 3) {
      setError('La contraseña debe cumplir al menos 3 criterios de seguridad');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.email, formData.password);
    } catch (err: any) {
      if (err.message.includes('Ya existe una cuenta')) {
        setError('Ya existe una cuenta con este email');
      } else {
        setError(err.message || 'Error al registrar usuario');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score < 2) return 'bg-red-500';
    if (passwordStrength.score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h1 className="page-title">GYM TRACK</h1>
        <p className="page-subtitle">Únete a la comunidad</p>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="••••••••"
            />
            <div className="password-strength">
              <div className="strength-bars">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className={`strength-bar ${
                      index <= passwordStrength.score ? getPasswordStrengthColor() : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <ul className="password-requirements">
                <li className={passwordStrength.length ? 'met' : ''}>
                  ✓ Mínimo 8 caracteres
                </li>
                <li className={passwordStrength.uppercase ? 'met' : ''}>
                  ✓ Al menos una mayúscula
                </li>
                <li className={passwordStrength.lowercase ? 'met' : ''}>
                  ✓ Al menos una minúscula
                </li>
                <li className={passwordStrength.number ? 'met' : ''}>
                  ✓ Al menos un número
                </li>
                <li className={passwordStrength.special ? 'met' : ''}>
                  ✓ Al menos un carácter especial
                </li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner">⭮</span>
                <span>Registrando...</span>
              </>
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        <div className="auth-link">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 