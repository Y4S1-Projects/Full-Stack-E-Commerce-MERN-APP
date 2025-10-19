const userModel = require('../models/userModel');

const findByEmail = async (email) => userModel.findOne({ email });
const findByAuth0Id = async (auth0Id) => userModel.findOne({ auth0Id });
const saveUser = async (userData) => {
  const user = new userModel(userData);
  return user.save();
};

module.exports = {
  findByEmail,
  findByAuth0Id,
  saveUser,
};
