const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Add security headers middleware
  app.use((req, res, next) => {
    // Content Security Policy
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "img-src 'self' data: blob: http://res.cloudinary.com https://res.cloudinary.com; " +
      "connect-src 'self' ws://localhost:3001 ws://localhost:3000 http://localhost:8080 https://api.cloudinary.com; " +
      "frame-src 'none'; " +
      "object-src 'none'; " +
      "media-src 'self'; " +
      "manifest-src 'self'; " +
      "worker-src 'self' blob:; " +
      "child-src 'self' blob:;"
    );
    
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
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};
