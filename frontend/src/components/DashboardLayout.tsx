'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import './DashboardLayout.css';
import { useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { logout, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="nav-header">
        <div className="max-w-7xl mx-auto nav-container">
          <div className="w-full flex flex-col">
            <div className="header-top">
              <Link href="/dashboard" className="nav-logo">
                Gym Track
              </Link>
              <button 
                onClick={handleLogout} 
                className="logout-icon-button"
                title="Cerrar Sesión"
              >
                <ArrowRightStartOnRectangleIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="nav-links-container">
              <div className="flex items-center space-x-6">
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link href="/workouts" className="nav-link">
                  Entrenamientos
                </Link>
                <Link href="/progress" className="nav-link">
                  Progreso
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 