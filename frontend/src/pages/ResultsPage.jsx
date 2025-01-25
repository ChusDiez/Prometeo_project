import React from 'react';
import { useSelector } from 'react-redux';

function ResultsPage() {
    const { finalScore, answersWithQuestions } = useSelector((state) => state.exam);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Resultados del Examen</h2>

      <p style={styles.scoreText}>
        Tu nota final es: <strong>{finalScore}</strong> sobre 10
      </p>

      <div style={styles.answersList}>
        {answersWithQuestions.map((answer) => {
          const isCorrect = answer.is_correct; 
          // Estructura: 
          // answer = { id, question_id, selected_option, is_correct, questions: { text, feedback, correct_option, ... } }
          const questionData = answer.questions; // { text, feedback, correct_option, ... }

          // Determinamos el color de fondo
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

              {/* Muestra el feedback si existe */}
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
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '10px',
  },
  scoreText: {
    fontSize: '1.2rem',
    margin: '10px 0 20px',
  },
  answersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  answerBox: {
    borderRadius: '8px',
    padding: '15px',
    border: '1px solid #ccc',
  },
  questionText: {
    margin: '0 0 8px 0',
  },
  feedbackText: {
    margin: '0 0 6px 0',
  },
};

export default ResultsPage;
