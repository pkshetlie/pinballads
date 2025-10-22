import config from '../config';
import { useAuth } from './auth-context';
import {useLanguage} from "@/lib/language-context";

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
  const {language} = useLanguage();

  const request = async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: Record<string, any> | FormData // Permet maintenant de supporter FormData
) => {
    // Check if the endpoint starts with /api/public
    const isPublicEndpoint = endpoint.startsWith('/api/public');

    if (!token && !isPublicEndpoint) {
      throw new Error('No token available');
    }

    const url = new URL(endpoint+'?XDEBUG_TRIGGER=1', config.API_BASE_URL).href;

    // Configuration initiale
    const options: RequestInit = {
      method,
      headers: {
        ...(isPublicEndpoint ? {} : {Authorization: `Bearer ${token}`}),
        'Accept-Language': language,
      },
      body: undefined, // Par défaut, aucun corps
    };

  // Gestion du corps de la requête selon son type
  if (body) {
    if (body instanceof FormData) {
      // Cas où le body est FormData: pas de sérialisation et header existant
      options.body = body;
    } else {
      // Cas classique: sérialisation JSON
      options.body = JSON.stringify(body);
      options.headers['Content-Type'] = 'application/json';
    }
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    if (response.status === 401) {
      // Déconnexion si le token est invalide
      logout();
    }
    const errorText = await response.json();
    throw new Error(`${errorText.error || 'Unknown error'}`);
  }

  return response.json();
};

  const apiGet = (endpoint: string) => request('GET', endpoint);
  const apiPost = (endpoint: string, body: Record<string, any>) => request('POST', endpoint, body);
  const apiPut = (endpoint: string, body: Record<string, any>) => request('PUT', endpoint, body);
  const apiDelete = (endpoint: string) => request('DELETE', endpoint);

  return { apiGet, apiPost, apiPut, apiDelete };
}
