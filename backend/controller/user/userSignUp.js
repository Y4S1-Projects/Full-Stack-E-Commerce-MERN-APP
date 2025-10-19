const userModel = require('../../models/userModel');
const axios = require('axios');
const { getManagementToken, AUTH0_DOMAIN, AUTH0_CONNECTION } = require('../../config/auth0');

async function userSignUpController(req, res) {
  try {
    const { email, password, name, profilePic } = req.body;

    if (!email) {
      throw new Error('Please provide email');
    }
    if (!password) {
      throw new Error('Please provide password');
    }
    if (!name) {
      throw new Error('Please provide name');
    }

    // Check if user already exists in MongoDB
    const user = await userModel.findOne({ email });
    if (user) {
      throw new Error('Already user exists.');
    }

    // 1. Create user in Auth0
    const mgmtToken = await getManagementToken();
    let auth0User;
    try {
      const response = await axios.post(
        `https://${AUTH0_DOMAIN}/api/v2/users`,
        {
          email,
          password,
          connection: AUTH0_CONNECTION,
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${mgmtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      auth0User = response.data;
    } catch (err) {
      return res.status(400).json({
        message: err.response?.data?.message || err.message,
        error: true,
        success: false,
      });
    }

    // 2. Save user in MongoDB with auth0Id
    const payload = {
      email,
      name,
      profilePic,
      role: 'CUSTOMER',
      auth0Id: auth0User.user_id,
    };
    const userData = new userModel(payload);
    const saveUser = await userData.save();

    res.status(201).json({
      data: saveUser,
      success: true,
      error: false,
      message: 'User created Successfully!',
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = userSignUpController;
