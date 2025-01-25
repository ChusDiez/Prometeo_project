// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  // Estados locales para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Estado para manejar errores o feedback
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      // Llamada a la ruta de tu backend: /api/auth/register
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar');
      }

      const data = await response.json();
      console.log('Registro exitoso:', data);

      // Si data.session contiene el token, guárdalo en localStorage (o en context)
      if (data.session?.access_token) {
        localStorage.setItem('token', data.session.access_token);
      }

      // Redirigir tras registro (p. ej. a /login o directamente al examen)
      navigate('/login');
    } catch (err) {
      console.error('Error de registro:', err);
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Correo electrónico:</label>
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

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default RegisterPage;
