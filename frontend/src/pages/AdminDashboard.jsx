import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateExamThunk,
  fetchUsersScoresThunk,
  fetchExamsStatsThunk,
  clearAdminMessages
} from '../store/adminSlice';

function AdminDashboard() {
  const dispatch = useDispatch();

  // =============== Redux state (adminSlice) =================
  const {
    // Para editar examen
    updatingExam,
    updateError,
    updateMessage,

    // Para user-scores
    usersScores,
    loadingScores,
    scoresError,

    // Para exam stats (p80, p70, p60, media)
    examsStats,
    loadingStats,
    statsError
  } = useSelector((state) => state.admin);


  // =============== LOCAL STATE: Subir CSV ===============
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploadError, setCsvUploadError] = useState('');
  const [csvUploadMessage, setCsvUploadMessage] = useState('');

  // exam fields (para subir CSV y/o editar exam)
  const [examId, setExamId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [zoomUrl, setZoomUrl] = useState('');

  // =============== LOCAL STATE: Lista de usuarios (fetch local) ===============
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  // =============== LOCAL STATE: Filtro exam_id en Stats ===============
  const [filterExamId, setFilterExamId] = useState('');

  // ============== Manejadores de CSV ==============
  function handleCSVChange(e) {
    setCsvFile(e.target.files[0]);
  }

  async function handleUploadCSV() {
    setCsvUploadError('');
    setCsvUploadMessage('');

    if (!csvFile) {
      setCsvUploadError('Selecciona un archivo CSV primero');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('csvFile', csvFile);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      formData.append('zoom_url', zoomUrl);
      formData.append('examId', examId);

      const res = await fetch('/api/exams/upload-csv', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al subir CSV');
      }

      const data = await res.json();
      setCsvUploadMessage(`CSV subido OK. examId: ${data.examId || ''}`);
    } catch (err) {
      console.error(err);
      setCsvUploadError(err.message);
    }
  }

  // ============== Manejadores para Editar Examen (Redux) ==============
  function handleSaveExam() {
    if (!examId) {
      alert('Especifica el ID del examen');
      return;
    }
    const payload = {
      start_date: startDate,
      end_date: endDate,
      zoom_url: zoomUrl,
    };
    dispatch(updateExamThunk({ examId, payload }));
  }

  // ============== Lista users (/api/admin/users) con fetch ==============
  async function fetchUsers() {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Error al obtener la lista de usuarios');
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
      setErrorUsers(error.message);
    } finally {
      setLoadingUsers(false);
    }
  }

  // ============== user-scores (Redux) ==============
  useEffect(() => {
    dispatch(fetchUsersScoresThunk());
  }, [dispatch]);

  // ============== exam-stats (Redux) ==============
  useEffect(() => {
    dispatch(fetchExamsStatsThunk());
  }, [dispatch]);

  // ============== fetchUsers local ==============
  useEffect(() => {
    fetchUsers();
  }, []);

  // Limpieza de mensajes al desmontar
  useEffect(() => {
    return () => {
      dispatch(clearAdminMessages());
    };
  }, [dispatch]);

  // Filtrar examStats
  const filteredStats = examsStats.filter(item =>
    filterExamId === '' || item.exam_id.includes(filterExamId)
  );

  // ============== Render ==============
  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>

      {/* ==================== Subir CSV + exam fields ===================== */}
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
            placeholder="uuid o vacío para crear uno nuevo"
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

        <button onClick={handleUploadCSV}>
          Subir CSV / Crear-Actualizar
        </button>
        {csvUploadError && <p style={{ color: 'red' }}>{csvUploadError}</p>}
        {csvUploadMessage && <p style={{ color: 'green' }}>{csvUploadMessage}</p>}
      </section>


      {/* ==================== Editar Examen (Redux Thunk) ===================== */}
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


      {/* ==================== USERS-SCORES (Redux) ===================== */}
      <section style={styles.section}>
        <h2>Usuarios y Notas (userScores)</h2>
        {loadingScores && <p>Cargando users-scores...</p>}
        {scoresError && <p style={{ color: 'red' }}>{scoresError}</p>}
        {!loadingScores && !scoresError && usersScores.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Exam ID</th>
                <th>Final Score</th>
                <th>Usuario / Examen</th>
              </tr>
            </thead>
            <tbody>
              {usersScores.map((row, i) => (
                <tr key={i}>
                  <td>{row.user_id}</td>
                  <td>{row.exam_id}</td>
                  <td>{row.final_score}</td>
                  <td>{row.users?.email} / {row.exams?.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>


      {/* ==================== USERS (fetch local) ===================== */}
      <section style={styles.section}>
        <h2>Lista de Usuarios (fetch /api/admin/users)</h2>
        {loadingUsers && <p>Cargando usuarios...</p>}
        {errorUsers && <p style={{ color: 'red' }}>{errorUsers}</p>}
        {!loadingUsers && !errorUsers && users.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Nota (ej)</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.nota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>


      {/* ==================== EXAMS STATS (p80, p70, p60, media) ===================== */}
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
                <th>Exam ID</th>
                <th>p80</th>
                <th>p70</th>
                <th>p60</th>
                <th>Media</th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.exam_id}</td>
                  <td>{item.p80}</td>
                  <td>{item.p70}</td>
                  <td>{item.p60}</td>
                  <td>{item.media}</td>
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

// Estilos
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'sans-serif',
  },
  section: {
    marginBottom: '30px',
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '6px',
  },
  formGroup: {
    marginBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
};

export default AdminDashboard;
