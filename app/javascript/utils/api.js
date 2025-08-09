import { getAuthHeaders } from './auth';

// Utility function to handle API requests
const apiRequest = async (url, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(), // Add any additional headers (like auth tokens)
  };

  const options = {
    method,
    headers,
  };

  // Add the body if it's a POST or PUT request
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    // Check if response is OK (status code 2xx)
    if (!response.ok) {
      const errorData = await response.json();
      return { status: 'error', data: errorData?.message || 'API request failed' };
    }

    // If successful, return the parsed response body
    const data = await response.json();
    return { status: 'success', data };
  } catch (error) {
    console.error('API Error:', error);
    return { status: 'error', data: error.message || 'Something went wrong' };
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
