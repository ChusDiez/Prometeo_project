"use client";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../lib/redux/store';
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
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
        || 'https://prometeoproject-production.up.railway.app';

      const formData = new FormData();
      formData.append('csvFile', csvFile);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      formData.append('zoom_url', zoomUrl);
      formData.append('examId', examId);

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
    dispatch(updateExamThunk({ examId, payload }));
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers(null);

    try {
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

  useEffect(() => {
    dispatch(fetchUsersScoresThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchExamsStatsThunk());
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearAdminMessages());
    };
  }, [dispatch]);

  const filteredStats: ExamStat[] = examsStats.filter((item: ExamStat) =>
    filterExamId === '' || item.exam_id.includes(filterExamId)
  );

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>

      <section style={styles.section}>
        <h2>Subir CSV + Examen Data</h2>
        <div style={styles.formGroup}>
          <label>Archivo CSV:</label>
          <input type="file" accept=".csv" onChange={handleCSVChange} />
        </div>

        <div style={styles.formGroup}>
          <label>Exam ID (opcional):</label>
          <input
            type="text"
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Start Date:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label>End Date:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Zoom URL:</label>
          <input
            type="text"
            value={zoomUrl}
            onChange={(e) => setZoomUrl(e.target.value)}
          />
        </div>

        <button onClick={handleUploadCSV}>Subir CSV / Crear-Actualizar</button>
        {csvUploadError && <p style={{ color: 'red' }}>{csvUploadError}</p>}
        {csvUploadMessage && <p style={{ color: 'green' }}>{csvUploadMessage}</p>}
      </section>

      <section style={styles.section}>
        <h2>Editar Examen</h2>
        <div style={styles.formGroup}>
          <label>Exam ID:</label>
          <input
            type="text"
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Start Date:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label>End Date:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Zoom URL:</label>
          <input
            type="text"
            value={zoomUrl}
            onChange={(e) => setZoomUrl(e.target.value)}
          />
        </div>
        <button onClick={handleSaveExam} disabled={updatingExam}>
          {updatingExam ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        {updateError && <p style={{ color: 'red' }}>{updateError}</p>}
        {updateMessage && <p style={{ color: 'green' }}>{updateMessage}</p>}
      </section>

      <section style={styles.section}>
        <h2>Usuarios y Notas (userScores)</h2>
        {loadingScores && <p>Cargando users-scores...</p>}
        {scoresError && <p style={{ color: 'red' }}>{scoresError}</p>}
        {!loadingScores && !scoresError && usersScores.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableCell}>User ID</th>
                <th style={styles.tableCell}>Exam ID</th>
                <th style={styles.tableCell}>Final Score</th>
                <th style={styles.tableCell}>Usuario / Examen</th>
              </tr>
            </thead>
            <tbody>
              {usersScores.map((row: Score, i: number) => (
                <tr key={i}>
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

      <section style={styles.section}>
        <h2>Lista de Usuarios (fetch /api/admin/users)</h2>
        {loadingUsers && <p>Cargando usuarios...</p>}
        {errorUsers && <p style={{ color: 'red' }}>{errorUsers}</p>}
        {!loadingUsers && !errorUsers && users.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableCell}>ID</th>
                <th style={styles.tableCell}>Nombre</th>
                <th style={styles.tableCell}>Email</th>
                <th style={styles.tableCell}>Nota (ej)</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: User) => (
                <tr key={u.id}>
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

      <section style={styles.section}>
        <h2>Estadísticas de Exámenes (p80, p70, p60, media)</h2>
        <label>Filtrar exam_id: </label>
        <input
          type="text"
          value={filterExamId}
          onChange={(e) => setFilterExamId(e.target.value)}
          style={{ marginBottom: '10px' }}
        />

        {loadingStats && <p>Cargando estadísticas...</p>}
        {statsError && <p style={{ color: 'red' }}>{statsError}</p>}

        {!loadingStats && !statsError && filteredStats.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableCell}>Exam ID</th>
                <th style={styles.tableCell}>p80</th>
                <th style={styles.tableCell}>p70</th>
                <th style={styles.tableCell}>p60</th>
                <th style={styles.tableCell}>Media</th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((item: ExamStat, idx: number) => (
                <tr key={idx}>
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
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'sans-serif'
  },
  section: {
    marginBottom: '30px',
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '6px'
  },
  formGroup: {
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableCell: {
    padding: '8px',
    border: '1px solid #ddd',
    textAlign: 'left'
  }
};