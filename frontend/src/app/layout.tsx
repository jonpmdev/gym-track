import React from 'react';

export const metadata = {
  title: 'Gym Track',
  description: 'Aplicación para seguimiento de entrenamiento en el gimnasio',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.ReactNode {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
} 