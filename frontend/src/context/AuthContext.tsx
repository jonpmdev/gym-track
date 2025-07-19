import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setLoading(false);
        return;
      }

      console.log('Verificando autenticación con token:', token.substring(0, 20) + '...');

      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Usuario autenticado:', userData.user);
        setUser(userData.user);
      } else {
        console.error('Error al verificar autenticación:', await response.text());
        Cookies.remove('token');
      }
    } catch (error) {
      console.error('Error en checkAuth:', error);
      Cookies.remove('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      console.log('Login exitoso, token recibido:', data.token.substring(0, 20) + '...');
      Cookies.set('token', data.token, { expires: 7 }); // Expira en 7 días
      setUser(data.user);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      console.log('Registro exitoso, token recibido:', data.token.substring(0, 20) + '...');
      Cookies.set('token', data.token, { expires: 7 }); // Expira en 7 días
      setUser(data.user);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
} 