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

    // Check if response is OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'API request failed');
    }

    // Return the parsed response body
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error; // Throw the error to be caught in the calling function
  }
};

// GET request
const get = async (url) => {
  console.log("entered request")
  let request = apiRequest(url, 'GET');
  console.log(request)
  return request;
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
