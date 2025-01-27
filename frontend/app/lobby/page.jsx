"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentExam } from '../../store/lobbySlice';
import { useRouter } from 'next/navigation';

export default function LobbyPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { exam, loading, error } = useSelector((state) => state.lobby);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isStarted, setIsStarted] = useState(false);

  const [inWindow, setInWindow] = useState(false);
  const [windowTimeLeft, setWindowTimeLeft] = useState(900);

  useEffect(() => {
    dispatch(fetchCurrentExam());
  }, [dispatch]);

  function calculateTimeLeft(futureDate) {
    const now = new Date().getTime();
    const distance = futureDate.getTime() - now;
    if (distance <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    if (!exam || !exam.start_date) return;

    const startDate = new Date(exam.start_date);

    const timer = setInterval(() => {
      const t = calculateTimeLeft(startDate);
      setTimeLeft(t);

      if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        setIsStarted(true);
        clearInterval(timer);
        startWindowTimer();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exam]);

  function startWindowTimer() {
    setInWindow(true);
    setWindowTimeLeft(900);

    const wTimer = setInterval(() => {
      setWindowTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(wTimer);
          setInWindow(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleEnterExam() {
    if (!exam) return;
    router.push(`/exams/${exam.id}`);
  }

  if (loading) {
    return <div>Cargando información del examen...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!exam) {
    return <div>No hay examen programado en este momento.</div>;
  }

  function formatCountdown({ days, hours, minutes, seconds }) {
    return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
  }

  function formatWindowTime(sec) {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(min).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Lobby - {exam.title}</h2>
      <p>Inicio programado: {new Date(exam.start_date).toLocaleString()}</p>

      <p>
        Tiempo restante: 
        <strong> {formatCountdown(timeLeft)} </strong>
      </p>

      {isStarted ? (
        <div>
          <p>¡Examen iniciado!</p>
          {inWindow ? (
            <div>
              <p>
                Ventana de acceso (15 min). Quedan: 
                <strong> {formatWindowTime(windowTimeLeft)}</strong>
              </p>
              <button onClick={handleEnterExam}>
                Entrar al examen
              </button>
            </div>
          ) : (
            <p style={{ color: 'red' }}>
              Se ha cerrado la ventana de 15 min. No puedes entrar al examen.
            </p>
          )}
        </div>
      ) : (
        <button disabled>El examen aún no ha comenzado</button>
      )}
    </div>
  );
}