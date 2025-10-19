const express = require('express');

const router = express.Router();

const userSignUpController = require('../controller/user/userSignUp');
const userSignInController = require('../controller/user/userSignIn');
const userDetailsController = require('../controller/user/userDetails');
const auth0Jwt = require('../middleware/authToken');
const checkAuthToken = require('../middleware/checkAuthToken');
const unifiedJwt = require('../middleware/unifiedJwt');
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

// Mount /api/auth for authentication endpoints (including Google login)
router.use('/auth', authRoutes);

// Public endpoints
router.post('/signup', userSignUpController);
router.post('/signin', userSignInController);
router.get('/userLogout', userLogout);

// Secure endpoints (support Auth0 and Google JWT via unified middleware)
router.get('/user-details', unifiedJwt, attachUserId, userDetailsController);

// Admin panel
router.get('/all-user', unifiedJwt, attachUserId, allUsers);
router.post('/update-user', unifiedJwt, attachUserId, updateUser);

// product
router.post('/upload-product', unifiedJwt, attachUserId, UploadProductController);
router.get('/get-product', getProductController);
router.post('/update-product', unifiedJwt, attachUserId, updateProductController);
router.get('/get-categoryProduct', getCategoryProduct);
// Accept both POST (body) and GET (query) for category filtering; both public
router.post('/category-product', getCategoryWiseProduct);
router.get('/category-product', getCategoryWiseProduct);
router.post('/product-details', getProductDetails);
router.get('/search', searchProduct);
router.post('/filter-product', filterProductController);

// user add to cart
router.post('/addtocart', unifiedJwt, attachUserId, addToCartController);
router.get('/countAddToCartProduct', unifiedJwt, attachUserId, countAddToCartProduct);
router.get('/view-card-product', unifiedJwt, attachUserId, addToCartViewProduct);
router.post('/update-cart-product', unifiedJwt, attachUserId, updateAddToCartProduct);
router.post('/delete-cart-product', unifiedJwt, attachUserId, deleteAddToCartProduct);

router.use('/auth0', authRoutes);

module.exports = router;
