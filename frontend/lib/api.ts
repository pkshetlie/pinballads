import config from '../config';
import { useAuth } from './auth-context';


export async function loginUser(email: string, password: string) {
  const url = new URL('login_check', config.API_BASE_URL).href; // Gère les slashes correctement

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  // Parse the response
  return response.json(); // This will contain the token and refresh token
}

export async function refreshToken(refreshToken: string) {
  const url = new URL('token/refresh', config.API_BASE_URL).href; // Gère les slashes correctement

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json(); // This will contain the new token
}

export function useApi() {
  const { token, logout } = useAuth();

  const request = async (
      method: 'GET' | 'POST',
      endpoint: string,
      body?: Record<string, any>
  ) => {
    if (!token) {
      throw new Error('No token available');
    }

    const url = new URL(endpoint, config.API_BASE_URL).href;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: method === 'POST' ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token invalide -> déconnexion
        logout();
      }
      const errorText = await response.text();
      throw new Error(`Request failed: ${response.status} ${errorText}`);
    }

    return response.json();
  };

  const get = (endpoint: string) => request('GET', endpoint);
  const post = (endpoint: string, body: Record<string, any>) =>
      request('POST', endpoint, body);

  return { get, post };
}
