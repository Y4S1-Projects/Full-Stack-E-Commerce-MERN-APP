const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();

// Security Headers for Frontend - Balanced approach for React
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'", 'https://accounts.google.com', 'https://apis.google.com', "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'http://res.cloudinary.com', 'https://res.cloudinary.com'],
        connectSrc: ["'self'", 'http://localhost:8080', 'https://api.cloudinary.com'],
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
