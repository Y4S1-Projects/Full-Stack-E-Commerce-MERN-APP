const userModel = require('../../models/userModel');
const axios = require('axios');
const { getManagementToken, AUTH0_DOMAIN } = require('../../config/auth0');

async function userDetailsController(req, res) {
  try {
    // Auth0 middleware puts claims in req.auth
    const auth0Id = req.auth?.payload?.sub;
    if (!auth0Id) throw new Error('No Auth0 user ID in token');

    // 1. Try to find user in MongoDB
    let user = await userModel.findOne({ auth0Id });
    if (!user) {
      // 2. If not found, fetch from Auth0
      const mgmtToken = await getManagementToken();
      const response = await axios.get(`https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0Id)}`, {
        headers: { Authorization: `Bearer ${mgmtToken}` },
      });
      const auth0User = response.data;
      // 3. Create user in MongoDB
      user = await userModel.create({
        auth0Id: auth0User.user_id,
        email: auth0User.email,
        name: auth0User.name || auth0User.email,
        profilePic: auth0User.picture,
        role: 'CUSTOMER',
      });
    }
    res.status(200).json({
      data: user,
      error: false,
      success: true,
      message: 'User details',
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = userDetailsController;
