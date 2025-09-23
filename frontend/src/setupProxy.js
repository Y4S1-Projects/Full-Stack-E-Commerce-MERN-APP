const { createProxyMiddleware } = require('http-proxy-middleware');
const API_URL = process.env.REACT_APP_API_URL;
const WS_URL_1 = process.env.REACT_APP_WS_URL_1;
const WS_URL_2 = process.env.REACT_APP_WS_URL_2;

module.exports = function(app) {
  // Add security headers middleware
  app.use((req, res, next) => {
    // Content Security Policy - Development mode considerations
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    let cspPolicy = 
      "default-src 'self'; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: blob: http://res.cloudinary.com https://res.cloudinary.com; " +
    `connect-src 'self' ${API_URL} ${WS_URL_1} ${WS_URL_2} https://api.cloudinary.com; ` +
      "frame-src 'none'; " +
      "object-src 'none'; " +
      "media-src 'self'; " +
      "manifest-src 'self'; " +
      "worker-src 'self' blob:; " +
      "child-src 'self' blob:;";
    
    // Handle styles and scripts based on environment
    if (isDevelopment) {
      // Development: Allow unsafe-inline for React hot reloading and inline styles
      cspPolicy += "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ";
      cspPolicy += "script-src 'self' 'unsafe-eval';"; // webpack needs unsafe-eval
    } else {
      // Production: Secure CSP
      cspPolicy += "style-src 'self' https://fonts.googleapis.com; ";
      cspPolicy += "script-src 'self';";
    }
    
    res.setHeader('Content-Security-Policy', cspPolicy);
    
    // X-Frame-Options for clickjacking protection
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
  });

  // Proxy API requests to backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL,
      changeOrigin: true,
    })
  );
};
