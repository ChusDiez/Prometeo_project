import { useAppDispatch } from '../../lib/redux/hooks';
import { signUp } from '../../lib/redux/authSlice';

const RegisterForm = () => {
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signUp({ 
      email: 'usuario@example.com', 
      password: 'contraseña123', 
      name: 'Juan Pérez' 
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... campos del formulario ... */}
    </form>
  );
};