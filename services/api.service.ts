// services/apiConfig.ts
const DEV = 'https://jfzj8yx48i.execute-api.us-east-2.amazonaws.com/Dev';
const dev_profile = 'https://euh4k782bh.execute-api.us-east-2.amazonaws.com/dev-profile/';

export const authRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${DEV}${endpoint}`;
  
  // Aquí puedes centralizar la protección (Headers de Auth)
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${userToken}`, // Cuando implementes JWT completo
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Error en la petición');
  }

  return response.json();
};

export const profileRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${dev_profile}${endpoint}`;
  
  // Aquí puedes centralizar la protección (Headers de Auth)
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${userToken}`, // Cuando implementes JWT completo
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Error en la petición');
  }

  return response.json();
};