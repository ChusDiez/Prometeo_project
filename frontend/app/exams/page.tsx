"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../lib/redux/store';
import { fetchExamQuestions, submitExamAnswers } from '../../lib/redux/examSlice';

interface Question {
  id: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
}

interface Styles {
  [key: string]: React.CSSProperties;
}

export default function ExamPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { questions: examQuestions, loading, error, submitLoading, submitError, finalScore } = useSelector(
    (state: RootState) => state.exam
  );

  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | null>>({});
  const [confidence, setConfidence] = useState<Record<string, string | null>>({});
  const [timeLeft, setTimeLeft] = useState<number>(3000);
  const [isTimeOver, setIsTimeOver] = useState<boolean>(false);

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
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

  const handleSelectOption = (questionId: string, option: "A" | "B" | "C" | null) => {
    if (isTimeOver) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: prev[questionId] === option ? null : option
    }));
  };

  const handleSelectConfidence = (questionId: string, value: string) => {
    if (isTimeOver) return;
    setConfidence(prev => ({
      ...prev,
      [questionId]: prev[questionId] === value ? null : value
    }));
  };

  const scrollToQuestion = (index: number) => {
    const ref = questionRefs.current[index];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    const examId = "123"; // Usar string según el error del slice
    const answersPayload: { question_id: string; selected_option: "A" | "B" | "C"; confidence: string | null }[] = Object.keys(answers).map(questionId => {
      const selectedOption = answers[questionId];
      if (selectedOption === null) {
        throw new Error(`Question ${questionId} has no selected option`);
      }
      return {
        question_id: questionId,
        selected_option: selectedOption,
        confidence: confidence[questionId]
      };
    });
    dispatch(submitExamAnswers({ examId, answers: answersPayload }));
    dispatch(submitExamAnswers({ examId, answers: answersPayload }));
  };

  if (loading) return <div>Cargando preguntas...</div>;
  if (error) return <div>Error: {error}</div>;

  const list = examQuestions || [];

  return (
    <div style={styles.container}>
      {/* Resto del JSX... (mantener igual pero con tipos en las funciones) */}
    </div>
  );
}

const SidebarItem = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  logoArea: {
    marginRight: '20px',
  },
  examInfo: {
    flexGrow: 1,
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
  },
  timer: {
    margin: 0,
    color: '#666',
  },
  mainContent: {
    display: 'flex',
    flexGrow: 1,
    padding: '20px',
  },
  sidebar: {
    gap: '5px',
  },
  sidebarList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '5px',
  },
  sidebarItem: styled.div`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    &:hover {
      background-color: #f0f0f0;
    }
  `,
  questionSection: {
    flexGrow: 1,
  },
  questionBox: {
    marginBottom: '20px',
    padding: '20px',
    border: '1px solid #eee',
    borderRadius: '8px',
  },
  questionText: {
    margin: '0 0 15px 0',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  confidenceContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginTop: '20px',
  },
  confidenceItem: {
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  confidenceIcon: {
    width: '24px',
    height: '24px',
  },
  footer: {
    padding: '20px',
    borderTop: '1px solid #eee',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#007aff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};