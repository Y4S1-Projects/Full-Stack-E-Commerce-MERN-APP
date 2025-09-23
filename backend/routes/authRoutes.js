const express = require('express');
const router = express.Router();

const authController = require('../controller/authController');
const checkJwt = require('../middleware/auth0Token');

// Public routes
router.post('/signup', authController.register);
router.post('/signin', authController.login);

// Protected routes (require valid Auth0 JWT)
router.get('/profile', checkJwt, authController.profile);
router.get('/logout', checkJwt, authController.logout);

module.exports = router;
