"use client";
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/redux/hooks';
import { fetchCurrentExam } from '../../lib/redux/lobbySlice';
import { useRouter } from 'next/navigation';
import { RootState } from '../../lib/redux/store';

const LobbyPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { currentExam: exam, loading, error } = useAppSelector((state: RootState) => state.lobby);
  
  const [timeLeft, setTimeLeft] = useState({ 
    days: 0, 
    hours: 0, 
    minutes: 0, 
    seconds: 0 
  });
  const [isStarted, setIsStarted] = useState(false);
  const [inWindow, setInWindow] = useState(false);
  const [windowTimeLeft, setWindowTimeLeft] = useState(900);

  useEffect(() => {
    dispatch(fetchCurrentExam());
  }, [dispatch]);

  const calculateTimeLeft = (futureDate: Date) => {
    const now = new Date().getTime();
    const distance = futureDate.getTime() - now;
    
    return distance > 0 ? {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    } : { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    if (!exam?.start_date) return;

    const timer = setInterval(() => {
      const t = calculateTimeLeft(new Date(exam.start_date));
      setTimeLeft(t);

      if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        setIsStarted(true);
        clearInterval(timer);
        startWindowTimer();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exam]);

  const startWindowTimer = () => {
    setInWindow(true);
    setWindowTimeLeft(900);

    const wTimer = setInterval(() => {
      setWindowTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      if (windowTimeLeft <= 0) {
        clearInterval(wTimer);
        setInWindow(false);
      }
    }, 1000);
  };

  const handleEnterExam = () => exam?.id && router.push(`/exams/${exam.id}`);

  const formatCountdown = ({ days, hours, minutes, seconds }: typeof timeLeft) => 
    `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;

  const formatWindowTime = (sec: number) => 
    `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  if (loading) return <div>Cargando información del examen...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!exam) return <div>No hay examen programado en este momento.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Lobby - {exam.title}</h1>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>Inicio programado:</strong>{' '}
          {new Date(exam.start_date).toLocaleString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>

        <p style={{ fontSize: '1.25rem' }}>
          <strong>Tiempo restante:</strong>{' '}
          <span style={{ color: '#2563eb' }}>{formatCountdown(timeLeft)}</span>
        </p>
      </div>

      {isStarted ? (
        <div style={{ 
          border: inWindow ? '2px solid #16a34a' : '2px solid #dc2626',
          borderRadius: '8px',
          padding: '1.5rem'
        }}>
          {inWindow ? (
            <>
              <p style={{ marginBottom: '1rem' }}>
                Ventana de acceso activa:{' '}
                <strong style={{ color: '#16a34a' }}>{formatWindowTime(windowTimeLeft)}</strong>
              </p>
              <button
                onClick={handleEnterExam}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                Entrar al examen
              </button>
            </>
          ) : (
            <p style={{ color: '#dc2626' }}>
              La ventana de acceso ha expirado. Contacta con un administrador.
            </p>
          )}
        </div>
      ) : (
        <button
          disabled
          style={{
            backgroundColor: '#e2e8f0',
            color: '#64748b',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'not-allowed'
          }}
        >
          El examen comenzará próximamente
        </button>
      )}
    </div>
  );
};

export default LobbyPage;