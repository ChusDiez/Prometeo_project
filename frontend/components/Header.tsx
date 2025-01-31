// components/Header.tsx
'use client';
import logo from '../public/Logo_ST_Black.png';
import { useAppSelector, useAppDispatch } from '../lib/redux/hooks';
import { toggleTheme } from '../lib/redux/themeSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

const Header = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  // Sincronizar el tema con el atributo HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const headerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px 40px',
    zIndex: 9999,
    backgroundColor: 'var(--color-background)',
    borderBottom: '1px solid var(--color-border)',
    backdropFilter: 'blur(5px)',
  };

  return (
    <header style={headerStyle}>
      <button
        onClick={() => router.push('/')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <Image
          src={logo}
          alt="Logo"
          style={{ 
            width: '100px', 
            height: 'auto',
            filter: isDarkMode ? 'invert(1)' : 'none' // Cambia a blanco en modo oscuro
          }}
          loader={({ src }) => src}
        />
      </button>

      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-text)'
          }}
        >
          {/* Ícono de casa */}
        </button>

        <div style={{ 
          fontSize: '1.4rem', 
          fontWeight: 600,
          color: 'var(--color-text)',
          letterSpacing: '0.5px'
        }}>
          Proyecto Prometeo
        </div>

        <button 
          onClick={() => {
            dispatch(toggleTheme());
            localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            padding: '0 5px',
            color: 'var(--color-text)'
          }}
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </div>
    </header>
  );
}
export default Header;