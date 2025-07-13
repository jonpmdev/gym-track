'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="nav-header">
        <div className="max-w-7xl mx-auto nav-container">
          <div className="w-full flex flex-col">
            <div className="w-full flex items-center justify-between mb-4">
              <Link href="/dashboard" className="nav-logo">
                Gym Track
              </Link>
            </div>
            <div className="flex items-center justify-between">
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
                 <button 
                onClick={handleLogout} 
                className="logout-icon-button"
                title="Cerrar Sesión"
              >
                <ArrowRightStartOnRectangleIcon className="h-6 w-6 text-white" />
              </button>
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