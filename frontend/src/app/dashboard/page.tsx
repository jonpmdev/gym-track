'use client';

import DashboardLayout from '@/components/DashboardLayout';
import './dashboard.css';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="dashboard-section">
        <h1 className="dashboard-title">
          Bienvenido a Gym Track
        </h1>
        <p className="dashboard-subtitle">Tu panel de control personalizado</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          <div className="dashboard-card bg-blue-50">
            <h2 className="font-medium text-blue-800">Entrenamientos</h2>
            <p className="text-blue-600">
              Registra y da seguimiento a tus entrenamientos diarios.
            </p>
            <button className="primary-button dashboard-button bg-blue-500 hover:bg-blue-600">
              Nuevo Entrenamiento
            </button>
          </div>
          <div className="dashboard-card bg-green-50">
            <h2 className="font-medium text-green-800">Progreso</h2>
            <p className="text-green-600">
              Visualiza tu progreso y medidas corporales.
            </p>
            <button className="primary-button dashboard-button bg-green-500 hover:bg-green-600">
              Registrar Medidas
            </button>
          </div>
          <div className="dashboard-card bg-purple-50">
            <h2 className="font-medium text-purple-800">Estadísticas</h2>
            <p className="text-purple-600">
              Revisa tus estadísticas y logros.
            </p>
            <button className="primary-button dashboard-button bg-purple-500 hover:bg-purple-600">
              Ver Estadísticas
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 