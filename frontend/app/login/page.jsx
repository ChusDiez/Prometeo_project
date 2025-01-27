"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      if (email === 'root@admin.com' && password === 'root123') {
        router.push('/admin');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      console.error(err);
      setError('Error al iniciar sesión');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(45deg, var(--color-background) 0%, #f0f4ff 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--color-background)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img
            src="https://iz.academy/wp-content/uploads/2022/06/Logo_ST_Black.png"
            alt="Logo"
            style={{
              width: '120px',
              height: 'auto',
              marginBottom: '30px',
              filter: 'invert(20%)' // Ajusta según tu tema
            }}
          />
          <h2 style={{
            color: 'var(--color-text)',
            marginBottom: '10px',
            fontSize: '1.8rem'
          }}>Bienvenido a Prometeo</h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              textAlign: 'left',
              color: 'var(--color-text)',
              marginBottom: '8px',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                background: 'var(--color-input-background)'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              textAlign: 'left',
              color: 'var(--color-text)',
              marginBottom: '8px',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                background: 'var(--color-input-background)'
              }}
              required
            />
          </div>

          {error && (
            <div style={{
              color: '#dc3545',
              backgroundColor: '#ffeef0',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              ':hover': {
                opacity: '0.9',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}