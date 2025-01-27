import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/redux/hooks';
import { fetchActiveExams } from '../lib/redux/lobbySlice';

const LobbyComponent = () => {
  const dispatch = useAppDispatch();
  const { exams, loading, error } = useAppSelector((state) => state.lobby);

  useEffect(() => {
    dispatch(fetchActiveExams());
  }, [dispatch]);

  if (loading) return <div>Cargando exámenes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="lobby-container">
      <h2>Exámenes Activos</h2>
      {exams.map((exam) => (
        <div key={exam.id} className="exam-card">
          <h3>{exam.title}</h3>
          <p>Fecha de inicio: {new Date(exam.start_date).toLocaleDateString()}</p>
          <p>Fecha de fin: {new Date(exam.end_date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default LobbyComponent;