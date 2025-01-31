// app/layout.tsx
'use client';

import { Providers } from '../lib/redux/provider';
import './globals.css';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from '../lib/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import logo from 'frontend/public/Logo_ST_Black.png';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const layoutStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    paddingTop: '120px',
  };

  if (!mounted) {
    return (
      <html lang="es">
        <body style={{ 
          visibility: 'hidden',
          backgroundColor: 'var(--color-background)'  // Fuerza el color de fondo
        }}>
          <div style={{ width: '100vw', height: '100vh' }}></div>
        </body>
      </html>
    );
  }

  return (
    <html lang="es">
      <body style={{
        ...layoutStyle,
        backgroundColor: 'var(--color-background)',  // Asegura visibilidad
        color: 'var(--color-text)'
      }}>
        <Providers>
          <Header />
          {children}
          <footer style={{
            marginTop: 'auto',
            padding: '20px 40px',
            backgroundColor: 'var(--color-background)',
            borderTop: '1px solid var(--color-border)',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'var(--color-subtext)',
          }}>
            <p>© {new Date().getFullYear()} IZETA Academy. Todos los derechos reservados.</p>
            <div style={{ marginTop: '8px' }}>
              <a href="/privacidad" style={{ color: 'var(--color-subtext)', textDecoration: 'none', margin: '0 10px' }}>Privacidad</a>
              <a href="/terminos" style={{ color: 'var(--color-subtext)', textDecoration: 'none', margin: '0 10px' }}>Términos</a>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}