import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://action-api.nuvolaris.com';

export interface TokenPayload {
  user_id: number;
  email: string;
  role: string;
  exp: number;
  name?: string;
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const getUserFromToken = (): TokenPayload | null => {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
};

interface ApiError {
  error?: string;
}

export const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({} as ApiError));
    throw new Error(error.error || 'Request failed');
  }
  
  return response.json();
};

export const apiPost = async (endpoint: string, data?: unknown) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const apiGet = async (endpoint: string) => {
  return apiRequest(endpoint, {
    method: 'GET',
  });
};
