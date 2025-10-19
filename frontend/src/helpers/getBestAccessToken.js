// Returns the best available access token (Google, Auth0, JWT)

// Always return backend-issued JWT for API calls (works for both manual and Google login)
export function getBestAccessToken(auth0AccessToken, jwtToken) {
  if (jwtToken) return jwtToken;
  if (auth0AccessToken) return auth0AccessToken;
  return null;
}
