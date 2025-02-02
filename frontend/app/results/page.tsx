"use client";
import React from 'react';
import { useSelector } from 'react-redux';

export default function ResultsPage() {
  const { finalScore, answersWithQuestions } = useSelector((state: { exam: { finalScore: number; answersWithQuestions: any[] } }) => state.exam);

  if (!answersWithQuestions) {
    return <div style={{ color: '#333' }}>No hay resultados aún.</div>; // Color fijo
  }

  const styles = {
    container: {
      padding: '2rem',
      color: '#333', // Color de texto fijo
      transition: 'all 0.3s ease'
    },
    title: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      textAlign: 'center' as const,
      color: '#333' // Color fijo
    },
    scoreText: {
      fontSize: '1.2rem',
      marginBottom: '2rem',
      textAlign: 'center' as const
    },
    answersList: {
      display: 'grid',
      gap: '1.5rem',
      maxWidth: '800px',
      margin: '0 auto'
    },
    answerBox: {
      padding: '1.5rem',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    questionText: {
      fontSize: '1.1rem',
      marginBottom: '1rem',
      color: '#333' // Color fijo
    },
    feedbackText: {
      margin: '0.5rem 0',
      color: '#444' // Color más claro pero visible
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Resultados del Examen</h2>

      <p style={styles.scoreText}>
        Tu nota final es: <strong>{finalScore}</strong> sobre 10
      </p>

      <div style={styles.answersList}>
        {answersWithQuestions.map((answer) => {
          const isCorrect = answer.is_correct;
          const questionData = answer.questions;
          const backgroundColor = isCorrect ? '#d4ffd4' : '#ffd4d4';

          return (
            <div
              key={answer.id || answer.question_id}
              style={{
                ...styles.answerBox,
                backgroundColor
              }}
            >
              <h4 style={styles.questionText}>
                {questionData?.text || 'Pregunta'}
              </h4>
              <p style={styles.feedbackText}>
                <strong>Tu respuesta:</strong> {answer.selected_option}
              </p>
              <p style={styles.feedbackText}>
                <strong>Respuesta correcta:</strong> {questionData?.correct_option}
              </p>

              {questionData?.feedback && (
                <p style={styles.feedbackText}>
                  <strong>Feedback:</strong> {questionData.feedback}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  // Tus estilos
};