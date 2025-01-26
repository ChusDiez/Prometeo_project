// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      // Ejemplo: si es un login ficticio
      if (email === 'root@admin.com' && password === 'root123') {
        // user root => admin
        navigate('/admindashboard');
      } else {
        // De lo contrario, prueba con tu fetch a /api/auth/login...
        // O para simplificar, lanza error
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      console.error(err);
      setError('Error al iniciar sesión');
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block' }}>
        <div>
          <label>Correo:</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default LoginPage;
