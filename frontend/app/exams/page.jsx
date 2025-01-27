"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExamQuestions, submitExamAnswers } from '../../store/examSlice';

export default function ExamPage() {
  const dispatch = useDispatch();
  const { questions: examQuestions, loading, error, submitLoading, submitError, finalScore } = useSelector((state) => state.exam);

  const [answers, setAnswers] = useState({});
  const [confidence, setConfidence] = useState({});
  const [timeLeft, setTimeLeft] = useState(3000);
  const [isTimeOver, setIsTimeOver] = useState(false);

  const questionRefs = useRef([]);

  useEffect(() => {
    // Podrías despachar fetchExamQuestions si quieres
    // dispatch(fetchExamQuestions(examId));
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function handleSelectOption(questionId, option) {
    if (isTimeOver) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === option ? null : option
    }));
  }

  function handleSelectConfidence(questionId, value) {
    if (isTimeOver) return;
    setConfidence((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === value ? null : value
    }));
  }

  function scrollToQuestion(index) {
    if (questionRefs.current[index]) {
      questionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    }
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  function handleSubmit() {
    const examId = 123; // Ejemplo: si lo obtienes por param /exams/[id].
    const payload = { answers, confidence };
    dispatch(submitExamAnswers({ examId, payload }));
  }

  if (loading) return <div>Cargando preguntas...</div>;
  if (error) return <div>Error: {error}</div>;

  const list = examQuestions || []; // Evitar undefined

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <img 
            src="/logo.png"
            alt="Mi Logo"
            style={{ width: 80, height: 80, objectFit: 'contain' }}
          />
        </div>
        <div style={styles.examInfo}>
          <h1 style={styles.title}>Mi Examen</h1>
          <p style={styles.timer}>
            Tiempo restante: {formatTime(timeLeft)}
          </p>
        </div>
      </header>

      <div style={styles.mainContent}>
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Preguntas</h3>
          <div style={styles.sidebarList}>
            {list.map((_, i) => (
              <div
                key={i}
                style={styles.sidebarItem}
                onClick={() => scrollToQuestion(i)}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </aside>

        <div style={styles.questionSection}>
          {list.map((q, index) => (
            <div
              key={q.id || index}
              ref={(el) => (questionRefs.current[index] = el)}
              style={styles.questionBox}
            >
              <h4 style={styles.questionText}>Pregunta {index + 1}:</h4>
              <p style={styles.questionText}>{q.text}</p>

              <div style={styles.optionsContainer}>
                <label style={styles.optionLabel}>
                  <input
                    type="checkbox"
                    disabled={isTimeOver}
                    checked={answers[q.id] === 'A'}
                    onChange={() => handleSelectOption(q.id, 'A')}
                  />
                  {q.option_a}
                </label>
                <label style={styles.optionLabel}>
                  <input
                    type="checkbox"
                    disabled={isTimeOver}
                    checked={answers[q.id] === 'B'}
                    onChange={() => handleSelectOption(q.id, 'B')}
                  />
                  {q.option_b}
                </label>
                <label style={styles.optionLabel}>
                  <input
                    type="checkbox"
                    disabled={isTimeOver}
                    checked={answers[q.id] === 'C'}
                    onChange={() => handleSelectOption(q.id, 'C')}
                  />
                  {q.option_c}
                </label>
              </div>

              {/* Sección 2x2 de "Confianza" */}
              <div style={styles.confidenceContainer}>
                <div
                  style={{
                    ...styles.confidenceItem,
                    border: confidence[q.id] === '100' ? '2px solid #007aff' : '1px solid #ccc'
                  }}
                  onClick={() => handleSelectConfidence(q.id, '100')}
                >
                  <img
                    src="/icons/100.png"
                    alt="100%"
                    style={styles.confidenceIcon}
                  />
                  <span>100%</span>
                </div>
                <div
                  style={{
                    ...styles.confidenceItem,
                    border: confidence[q.id] === '50' ? '2px solid #007aff' : '1px solid #ccc'
                  }}
                  onClick={() => handleSelectConfidence(q.id, '50')}
                >
                  <img
                    src="/icons/50.png"
                    alt="50%"
                    style={styles.confidenceIcon}
                  />
                  <span>50%</span>
                </div>
                <div
                  style={{
                    ...styles.confidenceItem,
                    border: confidence[q.id] === 'intuicion' ? '2px solid #007aff' : '1px solid #ccc'
                  }}
                  onClick={() => handleSelectConfidence(q.id, 'intuicion')}
                >
                  <img
                    src="/icons/intuicion.png"
                    alt="Intuición"
                    style={styles.confidenceIcon}
                  />
                  <span>Intuición</span>
                </div>
                <div
                  style={{
                    ...styles.confidenceItem,
                    border: confidence[q.id] === 'azar' ? '2px solid #007aff' : '1px solid #ccc'
                  }}
                  onClick={() => handleSelectConfidence(q.id, 'azar')}
                >
                  <img
                    src="/icons/azar.png"
                    alt="Azar"
                    style={styles.confidenceIcon}
                  />
                  <span>Azar</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={styles.footer}>
        <button
          style={styles.submitButton}
          onClick={handleSubmit}
          disabled={isTimeOver || submitLoading}
        >
          Enviar Examen
        </button>
        {submitError && <p style={{ color: 'red' }}>Error: {submitError}</p>}
        {finalScore !== null && <p>Nota final: {finalScore}</p>}
      </footer>
    </div>
  );
}

const styles = {
  // Tus estilos
};