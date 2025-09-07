import config from '../config';


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
