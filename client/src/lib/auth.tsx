import { JWRClaims, LoginResponse, User } from '../types/auth.interface';
import { API_URL } from './api';

// Disclaimer: This example keeps the access token in LocalStorage just because
// it's simpler, but in a real application you may want to use cookies instead
// for better security. Also, it doesn't handle token expiration.
import jwtDecode from 'jwt-decode';

/**
 * Default token`s key for local storage
 */
const ACCESS_TOKEN_KEY = 'accessToken';

/**
 * Retrieves token from local storage
 */
export function getAccessToken(): string {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Retrieves token from API, saves token to local storage
 * @returns instance of User
 */
export async function login(email: string, password: string): Promise<User | null> {
  
  const response: Response = await fetch(`${API_URL}login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    return null;
  }
  const { token }: LoginResponse = await response.json();
  localStorage.setItem(ACCESS_TOKEN_KEY, token);

  return getUserFromToken(token);
}

/**
 * Retrieves user based on saved token in local storage
 */
export function getUser(): User | null {
  const token: string = getAccessToken();
  if (!token) {
    return null;
  }
  return getUserFromToken(token);
}

/**
 * Clears token in local storage
 */
export function logout(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * Gets user from provided token
 */
function getUserFromToken(token: string): User {
  const claims: JWRClaims = jwtDecode(token);
  
  return {
    id: claims.sub,
    email: claims.email,
  };
}
