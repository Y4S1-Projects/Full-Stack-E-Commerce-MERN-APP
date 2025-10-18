// Store JWT in localStorage
const JWT_KEY = 'jwt_token';
const JWT_MAX_AGE = 86400000; // 24h in ms

export function setJwtSession(token) {
  const now = Date.now();
  localStorage.setItem(JWT_KEY, token);
  localStorage.setItem('jwt_expiry', now + JWT_MAX_AGE);
}

export function getJwtSession() {
  return localStorage.getItem(JWT_KEY);
}

export function clearJwtSession() {
  localStorage.removeItem(JWT_KEY);
  localStorage.removeItem('jwt_expiry');
}

export function isJwtSessionExpired() {
  const now = Date.now();
  const expiry = localStorage.getItem('jwt_expiry');
  return expiry && now > parseInt(expiry, 10);
}
