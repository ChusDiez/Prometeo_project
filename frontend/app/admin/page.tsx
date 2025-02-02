"use client";
import React, { useState, useEffect } from 'react';
// REQUIERE: instalar y configurar redux, react-redux en tu proyecto
import { useSelector, useDispatch } from 'react-redux';

// REQUIERE: que en tu carpeta ../../lib/redux/store.ts existan los tipos AppDispatch y RootState
// Ej: export type RootState = ReturnType<typeof store.getState>;
//     export type AppDispatch = typeof store.dispatch;
import type { AppDispatch, RootState } from '../../lib/redux/store';

// REQUIERE: que en tu carpeta ../../lib/redux/adminSlice existan estos thunks y acciones
// Ej: export const updateExamThunk = createAsyncThunk(...);
//     export const fetchUsersScoresThunk = createAsyncThunk(...);
//     export const fetchExamsStatsThunk = createAsyncThunk(...);
//     export const clearAdminMessages = createAction('admin/clearMessages');
import {
  updateExamThunk,
  fetchUsersScoresThunk,
  fetchExamsStatsThunk,
  clearAdminMessages
} from '../../lib/redux/adminSlice';

interface User {
  id: string;
  name: string;
  email: string;
  nota?: number;
}

interface ExamStat {
  exam_id: string;
  p80: number;
  p70: number;
  p60: number;
  media: number;
}

interface Score {
  user_id: string;
  exam_id: string;
  final_score: number;
  users?: { email: string }[];
  exams?: { title: string }[];
}

interface UpdateExamPayload {
  start_date: string;
  end_date: string;
  zoom_url: string;
}

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();

  // Estado global desde el adminSlice. REQUIERE que el slice "admin" tenga
  // updatingExam, updateError, etc. definidos.
  const {
    updatingExam,
    updateError,
    updateMessage,
    usersScores,
    loadingScores,
    scoresError,
    examsStats,
    loadingStats,
    statsError
  } = useSelector((state: RootState) => state.admin);

  // CSV local states
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvUploadError, setCsvUploadError] = useState<string>('');
  const [csvUploadMessage, setCsvUploadMessage] = useState<string>('');

  // exam fields
  const [examId, setExamId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [zoomUrl, setZoomUrl] = useState<string>('');

  // users list
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  // stats filter
  const [filterExamId, setFilterExamId] = useState<string>('');

  const handleCSVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleUploadCSV = async () => {
    setCsvUploadError('');
    setCsvUploadMessage('');

    if (!csvFile) {
      setCsvUploadError('Selecciona un archivo CSV primero');
      return;
    }

    try {
      // REQUIERE: que tu .env contenga NEXT_PUBLIC_API_BASE_URL
      // De lo contrario usa el fallback https://prometeoproject-production.up.railway.app
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
        || 'https://prometeoproject-production.up.railway.app';

      const formData = new FormData();
      formData.append('csvFile', csvFile);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      formData.append('zoom_url', zoomUrl);
      formData.append('examId', examId);

      // REQUIERE: que tu API tenga /api/exams/upload-csv. De lo contrario dará 404 o similar.
      const res = await fetch(`${baseUrl}/api/exams/upload-csv`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al subir CSV');
      }

      const data = await res.json() as { examId?: string };
      setCsvUploadMessage(`CSV subido OK. examId: ${data.examId || ''}`);
    } catch (err) {
      const error = err as Error;
      setCsvUploadError(error.message);
    }
  };

  const handleSaveExam = () => {
    if (!examId) {
      alert('Especifica el ID del examen');
      return;
    }
    const payload: UpdateExamPayload = {
      start_date: startDate,
      end_date: endDate,
      zoom_url: zoomUrl
    };
    // REQUIERE: que updateExamThunk exista. 
    dispatch(updateExamThunk({ examId, payload }));
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers(null);

    try {
      // REQUIERE: que tu API tenga /api/admin/users
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
        || 'https://prometeoproject-production.up.railway.app';

      const response = await fetch(`${baseUrl}/api/admin/users`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener la lista de usuarios');
      }
      const data = await response.json() as { users: User[] };
      setUsers(data.users || []);
    } catch (error) {
      const err = error as Error;
      setErrorUsers(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Llamada inicial a users-scores
  useEffect(() => {
    // REQUIERE: que fetchUsersScoresThunk exista.
    dispatch(fetchUsersScoresThunk());
  }, [dispatch]);

  // Llamada inicial a exam stats
  useEffect(() => {
    // REQUIERE: que fetchExamsStatsThunk exista.
    dispatch(fetchExamsStatsThunk());
  }, [dispatch]);

  // Llamada para traer lista de usuarios
  useEffect(() => {
    fetchUsers();
  }, []);

  // Limpiar mensajes al desmontar
  useEffect(() => {
    return () => {
      // REQUIERE: que clearAdminMessages exista en tu slice.
      dispatch(clearAdminMessages());
    };
  }, [dispatch]);

  const filteredStats: ExamStat[] = examsStats.filter((item: ExamStat) =>
    filterExamId === '' || item.exam_id.includes(filterExamId)
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Admin Dashboard</h1>

      {/* Sección: Subir CSV */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Subir CSV + Examen Data</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Archivo CSV:</label>
          <input type="file" accept=".csv" onChange={handleCSVChange} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Exam ID (opcional):</label>
          <input
            type="text"
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Start Date:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>End Date:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Zoom URL:</label>
          <input
            type="text"
            value={zoomUrl}
            onChange={(e) => setZoomUrl(e.target.value)}
            style={styles.input}
          />
        </div>

        <button style={styles.buttonPrimary} onClick={handleUploadCSV}>
          Subir CSV / Crear-Actualizar
        </button>

        {csvUploadError && <p style={styles.errorText}>{csvUploadError}</p>}
        {csvUploadMessage && <p style={styles.successText}>{csvUploadMessage}</p>}
      </section>

      {/* Sección: Editar Examen */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Editar Examen</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Exam ID:</label>
          <input
            type="text"
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Start Date:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>End Date:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Zoom URL:</label>
          <input
            type="text"
            value={zoomUrl}
            onChange={(e) => setZoomUrl(e.target.value)}
            style={styles.input}
          />
        </div>

        <button
          style={styles.buttonPrimary}
          onClick={handleSaveExam}
          disabled={updatingExam}
        >
          {updatingExam ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        {updateError && <p style={styles.errorText}>{updateError}</p>}
        {updateMessage && <p style={styles.successText}>{updateMessage}</p>}
      </section>

      {/* Sección: Users + Notas */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Usuarios y Notas (userScores)</h2>
        {loadingScores && <p>Cargando users-scores...</p>}
        {scoresError && <p style={styles.errorText}>{scoresError}</p>}
        {!loadingScores && !scoresError && usersScores.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>User ID</th>
                <th style={styles.tableHeader}>Exam ID</th>
                <th style={styles.tableHeader}>Final Score</th>
                <th style={styles.tableHeader}>Usuario / Examen</th>
              </tr>
            </thead>
            <tbody>
              {usersScores.map((row: Score, i: number) => (
                <tr key={i} style={styles.tableRow}>
                  <td style={styles.tableCell}>{row.user_id}</td>
                  <td style={styles.tableCell}>{row.exam_id}</td>
                  <td style={styles.tableCell}>{row.final_score}</td>
                  <td style={styles.tableCell}>
                    {row.users?.map(user => user.email).join(', ')} / 
                    {row.exams?.map(exam => exam.title).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Sección: Lista de usuarios */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Lista de Usuarios (fetch /api/admin/users)</h2>
        {loadingUsers && <p>Cargando usuarios...</p>}
        {errorUsers && <p style={styles.errorText}>{errorUsers}</p>}
        {!loadingUsers && !errorUsers && users.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>ID</th>
                <th style={styles.tableHeader}>Nombre</th>
                <th style={styles.tableHeader}>Email</th>
                <th style={styles.tableHeader}>Nota (ej)</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: User) => (
                <tr key={u.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{u.id}</td>
                  <td style={styles.tableCell}>{u.name}</td>
                  <td style={styles.tableCell}>{u.email}</td>
                  <td style={styles.tableCell}>{u.nota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Sección: Estadísticas de exámenes */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Estadísticas de Exámenes (p80, p70, p60, media)</h2>
        <div style={{ marginBottom: '10px' }}>
          <label style={styles.label}>Filtrar exam_id: </label>
          <input
            type="text"
            value={filterExamId}
            onChange={(e) => setFilterExamId(e.target.value)}
            style={styles.input}
          />
        </div>

        {loadingStats && <p>Cargando estadísticas...</p>}
        {statsError && <p style={styles.errorText}>{statsError}</p>}

        {!loadingStats && !statsError && filteredStats.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Exam ID</th>
                <th style={styles.tableHeader}>p80</th>
                <th style={styles.tableHeader}>p70</th>
                <th style={styles.tableHeader}>p60</th>
                <th style={styles.tableHeader}>Media</th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((item: ExamStat, idx: number) => (
                <tr key={idx} style={styles.tableRow}>
                  <td style={styles.tableCell}>{item.exam_id}</td>
                  <td style={styles.tableCell}>{item.p80}</td>
                  <td style={styles.tableCell}>{item.p70}</td>
                  <td style={styles.tableCell}>{item.p60}</td>
                  <td style={styles.tableCell}>{item.media}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loadingStats && !statsError && filteredStats.length === 0 && (
          <p>No hay datos de estadística para ese examen.</p>
        )}
      </section>
    </div>
  );
}

interface Styles {
  [key: string]: React.CSSProperties;
}

const styles: Styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '2rem',
    color: '#343a40',
  },
  section: {
    marginBottom: '30px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '6px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    marginBottom: '15px',
    fontSize: '1.4rem',
    color: '#17a2b8',
    borderBottom: '2px solid #dee2e6',
    paddingBottom: '5px'
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '2px'
  },
  input: {
    padding: '8px',
    border: '1px solid #ced4da',
    borderRadius: '4px'
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
  },
  tableHeader: {
    border: '1px solid #dee2e6',
    padding: '10px',
    backgroundColor: '#e9ecef',
    textAlign: 'left',
    fontWeight: 'bold'
  },
  tableRow: {
    // Podrías añadir un :hover con CSS, pero aquí en inline es más limitado:
    // e.g. ':hover': { backgroundColor: '#f2f2f2' } // No funciona inline
  },
  tableCell: {
    border: '1px solid #dee2e6',
    padding: '10px'
  },
  errorText: {
    color: 'red',
    marginTop: '10px'
  },
  successText: {
    color: 'green',
    marginTop: '10px'
  }
};
