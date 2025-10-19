const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/db');
const router = require('./routes');

const app = express();

// -------------------------
// Helmet security config
// FIXED VULNERABILITIES:
// 1. Content Security Policy (CSP) Header Not Set - OWASP A05:2021 Security Misconfiguration
//    BEFORE: No CSP header, vulnerable to XSS attacks
//    AFTER: Comprehensive CSP policy implemented to control resource loading
// 2. X-Frame-Options Header Not Set - OWASP A05:2021 Security Misconfiguration
//    BEFORE: No X-Frame-Options header, vulnerable to clickjacking
//    AFTER: X-Frame-Options set to 'DENY' to prevent framing
// -------------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], // Note: 'unsafe-inline' kept for compatibility but monitored
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: [
          "'self'",
          'https://accounts.google.com',
          'https://accounts.google.com/gsi/client',
          'https://apis.google.com',
          'https://*.gstatic.com',
        ],
        imgSrc: ["'self'", 'data:', 'blob:', 'http://res.cloudinary.com', 'https://res.cloudinary.com'],
        connectSrc: [
          "'self'",
          'ws://localhost:3001',
          'ws://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3000',
          'https://api.cloudinary.com',
          process.env.AUTH0_DOMAIN,
        ],
        frameSrc: ["'none'"], // Prevents framing for security
        objectSrc: ["'none'"], // Blocks plugins
        mediaSrc: ["'self'"],
        manifestSrc: ["'self'"],
        workerSrc: ["'self'", 'blob:'],
        childSrc: ["'self'", 'blob:'],
      },
    },
    frameguard: {
      action: 'deny', // FIXED: Prevents clickjacking by denying all framing attempts
    },
    // Strict-Transport-Security (HSTS) header - only in production
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

// -------------------------
// CORS setup (with fallback)
// -------------------------
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://127.0.0.1:3000'];

// Allow common local-network dev origins like http://192.168.x.x:3000
const devNetworkOriginRegex = /^http:\/\/192\.168\.\d+\.\d+:3000$/;

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);

    const isWhitelisted =
      allowedOrigins.includes(origin) ||
      devNetworkOriginRegex.test(origin) ||
      // allow any :3000 origin in non-production (useful for dev tools/proxies)
      (process.env.NODE_ENV !== 'production' && /^http:\/\/[^\s:]+:3000$/.test(origin)) ||
      // Allow localhost variations
      origin === 'http://localhost:3000' ||
      origin === 'http://127.0.0.1:3000' ||
      // In development, be more permissive with localhost origins
      (process.env.NODE_ENV !== 'production' && origin && origin.startsWith('http://localhost:'));

    if (isWhitelisted) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  // Do not fix allowedHeaders; let cors mirror Access-Control-Request-Headers
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// -------------------------
// Routes
// -------------------------
app.use('/api', router);

// -------------------------
// Start server
// -------------------------
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('Connected to DB');
    console.log('Server is running on port ' + PORT);
  });
});
