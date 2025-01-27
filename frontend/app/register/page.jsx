"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
        || 'https://prometeoproject-production.up.railway.app';

      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar');
      }

      const data = await response.json();
      console.log('Registro exitoso:', data);

      if (data.session?.access_token) {
        localStorage.setItem('token', data.session.access_token);
      }

      router.push('/login');
    } catch (err) {
      console.error('Error de registro:', err);
      setError(err.message);
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
              filter: 'invert(20%)'
            }}
          />
          <h2 style={{
            color: 'var(--color-text)',
            marginBottom: '10px',
            fontSize: '1.8rem'
          }}>Crear Cuenta</h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Regístrate para acceder al sistema</p>
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
            }}>Nombre completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            Registrarse
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          ¿Ya tienes cuenta?{' '}
          <a 
            href="/login"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: '500',
              ':hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}