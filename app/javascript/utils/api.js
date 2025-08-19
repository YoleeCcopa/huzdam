import { AuthService } from '../services/authService';

// Utility function to handle API requests
const apiRequest = async (url, method = 'GET', body = null, auth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(auth ? AuthService.getTokenHeaders() : {}),
  };

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const json = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: json?.message || 'API request failed',
        errors: json?.errors,
      };
    }

    return { status: 'success', data: json.data, message: json.message };
  } catch (error) {
    console.error('API Error:', error);
    return { status: 'error', message: error.message || 'Something went wrong' };
  }
};

// GET request
const get = async (url, auth = true) => {
  return apiRequest(url, 'GET', null, auth);
};

// POST request
const post = async (url, data, auth = true) => {
  return apiRequest(url, 'POST', data, auth);
};

// PATCH request
const patch = async (url, data, auth = true) => {
  return apiRequest(url, 'PATCH', data, auth);
};

// DELETE request
const del = async (url, auth = true) => {
  return apiRequest(url, 'DELETE', null, auth);
};

export { get, post, patch, del };
