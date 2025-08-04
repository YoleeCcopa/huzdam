export const getAuthHeaders = () => {
  const storage = localStorage.getItem('authHeaders')
    ? localStorage
    : sessionStorage;

  const raw = storage.getItem('authHeaders');
  return raw ? JSON.parse(raw) : null;
};

export const clearAuthHeaders = () => {
  localStorage.removeItem('authHeaders');
  sessionStorage.removeItem('authHeaders');
};

export const validateToken = async () => {
  const headers = getAuthHeaders();
  if (!headers) return false;

  const res = await fetch('/api/v1/auth/validate_token', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
  });

  return res.ok;
};

export const logout = async () => {
  const headers = getAuthHeaders();
  console.log(headers);
  if (!headers) return;

  const res = await fetch('/api/v1/auth/sign_out', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
  });

  console.log(res);

  if (res.ok) {
    clearAuthHeaders();
    window.location.href = '/login';
  } else {
    console.error('Logout failed');
  }
};