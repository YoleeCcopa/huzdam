import { useEffect } from 'react';
import { getAuthHeaders, validateToken } from '../utils/auth';

export default function useAuthGuard(redirectTo = '/login') {
  useEffect(() => {
    const checkAuth = async () => {
      const valid = await validateToken();
      if (!valid) {
        window.location.href = redirectTo;
      }
    };

    checkAuth();
  }, [redirectTo]);
}