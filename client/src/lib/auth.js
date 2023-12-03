// Disclaimer: This example keeps the access token in LocalStorage just because
// it's simpler, but in a real application you may want to use cookies instead
// for better security. Also, it doesn't handle token expiration.
import jwtDecode from 'jwt-decode';

/**
 * Default BE endpoint
 */
const API_URL = 'http://localhost:9000';

/**
 * Default token`s key for local storage
 */
const ACCESS_TOKEN_KEY = 'accessToken';

/**
 * Retrieves token from local storage
 */
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Retrieves token from API, saves token to local storage
 * @returns instance of User
 */
export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    return null;
  }
  const { token } = await response.json();
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  return getUserFromToken(token);
}

/**
 * Retrieves user based on saved token in local storage
 */
export function getUser() {
  const token = getAccessToken();
  if (!token) {
    return null;
  }
  return getUserFromToken(token);
}

/**
 * Clears token in local storage
 */
export function logout() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * Gets user from provided token
 */
function getUserFromToken(token) {
  const claims = jwtDecode(token);
  return {
    id: claims.sub,
    email: claims.email,
  };
}
