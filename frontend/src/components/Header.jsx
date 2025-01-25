// src/components/Header.jsx (ejemplo)
import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutThunk, logoutSuccess } from '../store/authSlice';

function Header() {
  const dispatch = useDispatch();

  function handleLogout() {
    // 1) Eliminar token en localStorage
    localStorage.removeItem('token');

    // 2) Llamar al thunk (opcional) para invalidar en back
    dispatch(logoutThunk());

    // 3) O, si no tienes endpoint en back, despacha logoutSuccess 
    // dispatch(logoutSuccess());

    // 4) Redirige a /login (o a la Home)
    window.location.href = '/login';
  }

  return (
    <header style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}

export default Header;
