const express = require('express');

const router = express.Router();

const userSignUpController = require('../controller/user/userSignUp');
const userSignInController = require('../controller/user/userSignIn');
const userDetailsController = require('../controller/user/userDetails');
const auth0Jwt = require('../middleware/authToken');
const checkAuthToken = require('../middleware/checkAuthToken');
const attachUserId = require('../middleware/attachUserId');
const userLogout = require('../controller/user/userLogout');
const allUsers = require('../controller/user/allUsers');
const updateUser = require('../controller/user/updateUser');
const UploadProductController = require('../controller/product/uploadProduct');
const getProductController = require('../controller/product/getProduct');
const updateProductController = require('../controller/product/updateProduct');
const getCategoryProduct = require('../controller/product/getCategoryProductOne');
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct');
const getProductDetails = require('../controller/product/getProductDetails');
const addToCartController = require('../controller/user/addToCartController');
const countAddToCartProduct = require('../controller/user/countAddToCartProduct');
const addToCartViewProduct = require('../controller/user/addToCartViewProduct');
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct');
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct');
const searchProduct = require('../controller/product/searchProduct');
const filterProductController = require('../controller/product/filterProduct');

const authRoutes = require('./authRoutes');

// Test endpoint for security headers
router.get('/test', (req, res) => {
  res.json({ message: 'Security headers test endpoint', status: 'success' });
});

// Public endpoints
router.post('/signup', userSignUpController);
router.post('/signin', userSignInController);
router.get('/userLogout', userLogout);

// Secure endpoints (require Auth token in cookie/session/header, then Auth0 JWT + attachUserId)
router.get('/user-details', checkAuthToken, auth0Jwt, attachUserId, userDetailsController);

//admin panel
router.get('/all-user', checkAuthToken, auth0Jwt, attachUserId, allUsers);
router.post('/update-user', checkAuthToken, auth0Jwt, attachUserId, updateUser);

//product
router.post('/upload-product', checkAuthToken, auth0Jwt, attachUserId, UploadProductController);
router.get('/get-product', getProductController);
router.post('/update-product', checkAuthToken, auth0Jwt, attachUserId, updateProductController);
router.get('/get-categoryProduct', getCategoryProduct);
router.post('/category-product', getCategoryWiseProduct);
router.post('/product-details', getProductDetails);
router.get('/search', searchProduct);
router.post('/filter-product', filterProductController);

//user add to cart
router.post('/addtocart', checkAuthToken, auth0Jwt, attachUserId, addToCartController);
router.get('/countAddToCartProduct', checkAuthToken, auth0Jwt, attachUserId, countAddToCartProduct);
router.get('/view-card-product', checkAuthToken, auth0Jwt, attachUserId, addToCartViewProduct);
router.post('/update-cart-product', checkAuthToken, auth0Jwt, attachUserId, updateAddToCartProduct);
router.post('/delete-cart-product', checkAuthToken, auth0Jwt, attachUserId, deleteAddToCartProduct);

router.use('/auth0', authRoutes);

module.exports = router;
