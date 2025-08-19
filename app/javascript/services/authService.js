export const AuthService = {
  // Perform login and save headers
  login: async ({ identifier, password, stayLoggedIn }) => {
    try {
      const res = await fetch('/api/v1/auth/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const json = await res.json();
      const headers = Object.fromEntries(res.headers.entries());

      if (!res.ok) {
        return {
          status: 'error',
          message: json?.message || 'Login failed',
          errors: json?.errors,
        };
      }

      const tokenHeaders = {
        'access-token': headers['access-token'],
        client: headers.client,
        uid: headers.uid,
      };

      // If the login is successful, store the headers
      if (tokenHeaders['access-token'] && tokenHeaders.client && tokenHeaders.uid) {
        AuthService.storeTokenHeaders(tokenHeaders, stayLoggedIn);
        return { status: 'success' };
      } else {
        return { status: 'error', message: 'Missing authentication headers' };
      }
    } catch (error) {
      return { status: 'error', message: error.message || 'Login failed' };
    }
  },

  // Store auth headers in localStorage or sessionStorage
  storeTokenHeaders: (tokenHeaders, stayLoggedIn) => {
    const storage = stayLoggedIn ? localStorage : sessionStorage;
    storage.setItem('authHeaders', JSON.stringify(tokenHeaders));
  },

  // Clear stored auth headers
  clearTokenHeaders: () => {
    localStorage.removeItem('authHeaders');
    sessionStorage.removeItem('authHeaders');
  },

  // Fetch stored auth headers from localStorage or sessionStorage
  getTokenHeaders: () => {
    const storage = localStorage.getItem('authHeaders') ? localStorage : sessionStorage;
    const raw = storage.getItem('authHeaders');
    return raw ? JSON.parse(raw) : null;
  },

  // Validate token by making a request to the backend
  validateToken: async () => {
    const headers = AuthService.getTokenHeaders();
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
  },

  // Perform logout and clear stored headers
  logout: async () => {
    const headers = AuthService.getTokenHeaders();
    if (!headers) return;

    const res = await fetch('/api/v1/auth/sign_out', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    });

    if (res.ok) {
      AuthService.clearTokenHeaders();
      window.location.href = '/auth'; // Redirect to login page after logout
    } else {
      console.error('Logout failed');
    }
  },
};