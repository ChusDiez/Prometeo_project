// components/auth/LoginForm.tsx
"use client";
import { useAppDispatch } from '@/lib/hooks';
import { signIn } from '@/lib/redux/authSlice';
import { useState } from 'react';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signIn({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />
      <button type="submit">Ingresar</button>
    </form>
  );
};