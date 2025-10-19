// helpers/permission.js
const userModel = require('../models/userModel');

/**
 * Generic role checker
 * @param {String} auth0Id - The Auth0 user ID (from JWT `sub`)
 * @param {Array} allowedRoles - Roles that can access this action
 */
const hasPermission = async (auth0Id, allowedRoles = []) => {
  const user = await userModel.findOne({ auth0Id });

  if (!user) return false;

  return allowedRoles.includes(user.role);
};

/**
 * Example: only ADMIN can upload products
 */
const uploadProductPermission = async (auth0Id) => {
  return hasPermission(auth0Id, ['ADMIN']);
};

/**
 * Example: both ADMIN and CUSTOMER can view products
 */
const viewProductPermission = async (auth0Id) => {
  return hasPermission(auth0Id, ['ADMIN', 'CUSTOMER']);
};

module.exports = {
  hasPermission,
  uploadProductPermission,
  viewProductPermission,
};
