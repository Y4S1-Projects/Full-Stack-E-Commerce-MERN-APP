const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Add security headers middleware
  app.use((req, res, next) => {
    // Content Security Policy - Development mode considerations
    const isDevelopment = process.env.NODE_ENV !== 'production';

    let cspPolicy =
      "default-src 'self'; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: blob: http://res.cloudinary.com https://res.cloudinary.com; " +
      "connect-src 'self' ws://localhost:3001 ws://localhost:3000 http://localhost:8080 https://api.cloudinary.com; " +
      "frame-src 'none'; " +
      "object-src 'none'; " +
      "media-src 'self'; " +
      "manifest-src 'self'; " +
      "worker-src 'self' blob:; " +
      "child-src 'self' blob:;";

    // Handle styles and scripts based on environment
    if (isDevelopment) {
      // Development: Allow Google scripts and unsafe-eval for webpack
      cspPolicy += "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ";
      cspPolicy +=
        "script-src 'self' 'unsafe-eval' https://accounts.google.com https://accounts.google.com/gsi/client https://apis.google.com https://*.gstatic.com;";
    } else {
      // Production: Allow Google scripts, no unsafe-eval
      cspPolicy += "style-src 'self' https://fonts.googleapis.com; ";
      cspPolicy +=
        "script-src 'self' https://accounts.google.com https://accounts.google.com/gsi/client https://apis.google.com https://*.gstatic.com;";
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
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};
