"use client";
import React, { useState, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

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
        border: '1px solid var(--color-border)',
        minHeight: '500px', // Altura mínima aumentada
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between' // Distribuye el espacio
      }}>
        <div style={{ textAlign: 'center' }}>
          <img
            src="/Logo_ST_Black.png"
            alt="Logo"
            style={{
              margin: '0 auto', 
              width: '120px',
              height: 'auto',
              marginBottom: '30px',
              filter: 'invert(20%)'
            }}
          />
          <h2 style={{
            color: 'var(--color-text)',
            marginBottom: '10px',
            fontSize: '1.8rem',
            lineHeight: '2.2rem'
          }}>Bienvenido a Prometeo</h2>
          <p style={{ 
            color: '#666',
            fontSize: '0.9rem',
            marginBottom: '40px' // Espacio adicional
          }}>Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} style={{ 
          width: '100%',
          margin: 'auto', // Centrado vertical
          maxWidth: '320px' // Ancho máximo para contenido
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              textAlign: 'left',
              color: '#333', // Color fijo para mejor contraste
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
                background: 'var(--color-input-background)',
                color: '#333' // Color de texto fijo
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              textAlign: 'left',
              color: '#333', // Color fijo para mejor contraste
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
                background: 'var(--color-input-background)',
                color: '#333' // Color de texto fijo
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
          
          <div style={{ 
            textAlign: 'center',
            marginTop: '30px' // Espacio adicional
          }}>
            <button
              type="submit"
              style={{
                padding: '12px 40px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#4a90e2',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%' // Ancho completo
              }}
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}