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
// -------------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'"],
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

// Ensure Express responds to CORS preflight for all routes
app.options('*', cors(corsOptions));

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
