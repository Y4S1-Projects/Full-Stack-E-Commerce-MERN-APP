const express = require('express');
const router = express.Router();

const authController = require('../controller/authController');
const checkJwt = require('../middleware/auth0Token');
const { googleLogin } = require('../controller/authControllerGoogle');

// Public routes
router.post('/signup', authController.register);
router.post('/signin', authController.login);
router.post('/google', googleLogin); // Google login

// Protected routes (require valid Auth0 JWT)
router.get('/profile', checkJwt, authController.profile);
router.get('/logout', checkJwt, authController.logout);

module.exports = router;
