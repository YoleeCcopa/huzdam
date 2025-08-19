import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';

export default function useAuthGuard(redirectTo = '/auth') {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await AuthService.validateToken();
      if (!valid) {
        navigate(redirectTo);
      }
    };

    checkAuth();
  }, [redirectTo, navigate]);
}
