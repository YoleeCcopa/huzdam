import { getAuthHeaders } from './auth';

// Utility function to handle API requests
const apiRequest = async (url, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      return { status: 'error', message: errorData?.message || 'API request failed', errors: errorData?.errors };
    }

    const json = await response.json();

    // Unwrap here:
    if (json.success) {
      return { status: 'success', data: json.data, message: json.message };
    } else {
      // Backend may send success: false with error info
      return { status: 'error', message: json.message, errors: json.errors };
    }
  } catch (error) {
    console.error('API Error:', error);
    return { status: 'error', message: error.message || 'Something went wrong' };
  }
};

// GET request
const get = async (url) => {
  return apiRequest(url, 'GET');
};

// POST request
const post = async (url, data) => {
  return apiRequest(url, 'POST', data);
};

// PATCH request
const patch = async (url, data) => {
  return apiRequest(url, 'PATCH', data);
};

// DELETE request
const del = async (url) => {
  return apiRequest(url, 'DELETE');
};

export { get, post, patch, del };
