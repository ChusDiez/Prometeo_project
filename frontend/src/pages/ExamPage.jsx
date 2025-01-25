import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExamQuestions, submitExamAnswers } from '../store/examSlice';

function ExamPage({ questions = [], onSubmit }) {
  const dispatch = useDispatch();

  // De Redux (ejemplo): state.exam
  const { questions: examQuestions, loading, error, submitLoading, submitError, finalScore } = useSelector((state) => state.exam);

  // Estado para las respuestas ABC: { [questionId]: 'A'/'B'/'C'/null }
  const [answers, setAnswers] = useState({});
  
  // **Nuevo**: Estado para las “casillas de confianza”
  // Podríamos tener { [questionId]: '100'/'50'/'intuicion'/'azar'/null }
  const [confidence, setConfidence] = useState({});

  // Temporizador en segundos (50 min = 3000s)
  const [timeLeft, setTimeLeft] = useState(3000);
  const [isTimeOver, setIsTimeOver] = useState(false);

  const questionRefs = useRef([]);

  // Temporizador
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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

  // Manejar selección de opciones ABC
  function handleSelectOption(questionId, option) {
    if (isTimeOver) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === option ? null : option
    }));
  }

  // **Nuevo**: Manejar selección de “casillas” (100%, 50%, intuición, azar)
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

  // Formato mm:ss
  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  // Botón "Enviar"
  function handleSubmit() {
    if (!examId) return; 
    const payload = {
      answers,
      confidence
    };
    dispatch(submitExamAnswers({ examId, payload }));
  }

  // Render condicional
  if (loading) return <div>Cargando preguntas...</div>;
  if (error) return <div>Error: {error}</div>;

  // Suponemos que "examQuestions" proviene de Redux, 
  // aunque también puedes usar directamente "questions" si ya está en props
  const list = examQuestions.length ? examQuestions : questions;

  return (
    <div style={styles.container}>
      {/* HEADER */}
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

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Preguntas</h3>
          <div style={styles.sidebarList}>
            {Array.from({ length: list.length }, (_, i) => i + 1).map((num) => (
              <div 
                key={num}
                style={styles.sidebarItem}
                onClick={() => scrollToQuestion(num - 1)}
              >
                {num}
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

              {/* OPCIONES A-B-C */}
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

              {/* NUEVA SECCIÓN 2x2: “Confianza” o “método de respuesta” */}
              <div style={styles.confidenceContainer}>
                {/* Cada celda: un mini-bloque con un logo arriba y un texto abajo 
                    Cambia "100.png" "50.png" etc. a tus iconos reales 
                */}
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

      {/* FOOTER */}
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

/** ESTILOS **/
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9f9f9', 
    color: '#333',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#003366', // Azul oscuro
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
  },
  logoArea: {
    marginRight: '20px',
  },
  examInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
  },
  timer: {
    margin: 0,
    fontSize: '1rem',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    width: '80px',
    backgroundColor: '#cccccc', 
    padding: '10px',
    overflowY: 'auto',
  },
  sidebarTitle: {
    margin: '0 0 10px 0',
    fontSize: '1.1rem',
    borderBottom: '1px solid #999',
    paddingBottom: '5px',
  },
  sidebarList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sidebarItem: {
    cursor: 'pointer',
    backgroundColor: '#fff',
    textAlign: 'center',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #999',
  },
  questionSection: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
  questionBox: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '16px',
    marginBottom: '20px',
  },
  questionText: {
    margin: 0,
    marginBottom: '8px',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '10px',
  },

  // NUEVO: Contenedor 2x2 para la sección de "confianza"
  confidenceContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridGap: '8px',
    marginTop: '10px',
    marginBottom: '20px',
  },
  confidenceItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    backgroundColor: '#fff',
  },
  confidenceIcon: {
    width: '32px',
    height: '32px',
    objectFit: 'contain',
    marginBottom: '4px',
  },

  footer: {
    backgroundColor: '#f1f1f1',
    padding: '10px 20px',
    textAlign: 'right',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#003366',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ExamPage;
