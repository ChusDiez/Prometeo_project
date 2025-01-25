// src/pages/LobbyPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentExam } from '../store/lobbySlice'; // tu thunk
import { useNavigate } from 'react-router-dom';

function LobbyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // De Redux: exam, loading, error
  const { exam, loading, error } = useSelector((state) => state.lobby);

  // ====== Estados para la cuenta atrás general ======
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isStarted, setIsStarted] = useState(false);

  // ====== Estados para la “ventana” de 15 min ======
  const [inWindow, setInWindow] = useState(false);       // indica si estamos en la ventana
  const [windowTimeLeft, setWindowTimeLeft] = useState(900); // 15 min = 900 seg

  // 1. Al montar, cargamos el examen (fecha de inicio)
  useEffect(() => {
    dispatch(fetchCurrentExam());
  }, [dispatch]);

  // 2. Función para calcular la diferencia entre "ahora" y start_date
  function calculateTimeLeft(futureDate) {
    const now = new Date().getTime();
    const distance = futureDate.getTime() - now;

    if (distance <= 0) {
      // Ya pasó
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(
      (distance % (1000 * 60)) / 1000
    );

    return { days, hours, minutes, seconds };
  }

  // 3. Efecto para manejar el interval (cuenta atrás general)
  useEffect(() => {
    if (!exam || !exam.start_date) return;

    const startDate = new Date(exam.start_date);

    const timer = setInterval(() => {
      const t = calculateTimeLeft(startDate);
      setTimeLeft(t);

      // si llegó a 0 => isStarted = true, paramos este timer
      if (
        t.days === 0 && t.hours === 0 &&
        t.minutes === 0 && t.seconds === 0
      ) {
        setIsStarted(true);
        clearInterval(timer);

        // Aquí arrancamos la ventana de 15 min
        startWindowTimer();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exam]);

  // Función para arrancar el temporizador de 15 min
  function startWindowTimer() {
    setInWindow(true);
    setWindowTimeLeft(900); // 15 min

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

  // 4. Manejar click en "Entrar al examen"
  function handleEnterExam() {
    if (!exam) return;
    // Redirigir a la página del examen, p.ej. /exams/:id
    navigate(`/exams/${exam.id}`);
  }

  if (loading) {
    return <div>Cargando información del examen...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!exam) {
    // Si exam = null y no hay error => no hay examen actual
    return <div>No hay examen programado en este momento.</div>;
  }

  // Función para formatear el t.days/hours/etc.
  function formatCountdown({ days, hours, minutes, seconds }) {
    return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
  }

  // Formatear el windowTimeLeft (en seg => min:seg)
  function formatWindowTime(sec) {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(min).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Lobby - {exam.title}</h2>
      <p>Inicio programado: {new Date(exam.start_date).toLocaleString()}</p>

      {/* Cuenta atrás general */}
      <p>
        Tiempo restante: 
        <strong> {formatCountdown(timeLeft)} </strong>
      </p>

      {/* Si ya llegó a 0 => isStarted = true => arranca ventana */}
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
        <button disabled>
          El examen aún no ha comenzado
        </button>
      )}
    </div>
  );
}

export default LobbyPage;
