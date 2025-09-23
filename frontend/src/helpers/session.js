const SESSION_MAX_AGE = 86400000; // 24h in ms, should match backend

export function setSessionExpiry() {
  const now = Date.now();
  localStorage.setItem('sessionExpiry', now + SESSION_MAX_AGE);
}

export function isSessionExpired() {
  const now = Date.now();
  const sessionExpiry = localStorage.getItem('sessionExpiry');
  return sessionExpiry && now > parseInt(sessionExpiry, 10);
}

export function clearSession() {
  localStorage.removeItem('sessionExpiry');
}
