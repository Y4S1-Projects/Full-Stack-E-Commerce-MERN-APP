const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();

const API_URL = process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_URL;

// Security Headers for Frontend - Using environment variables
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'http://res.cloudinary.com', 'https://res.cloudinary.com'],
        connectSrc: ["'self'", API_URL, 'https://api.cloudinary.com'].filter(Boolean),
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        manifestSrc: ["'self'"],
        workerSrc: ["'self'", 'blob:'],
        childSrc: ["'self'", 'blob:'],
      },
    },
    frameguard: {
      action: 'deny',
    },
    hsts:
      process.env.NODE_ENV === 'production'
        ? {
            maxAge: 63072000, 
            includeSubDomains: true,
            preload: true,
          }
        : false,
  })
);

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend server with security headers running on port ${PORT}`);
});
