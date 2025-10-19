const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    auth0Id: { type: String, unique: true, sparse: true }, // link to Auth0 user
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: { type: String, required: false },
    profilePic: String,
    role: { type: String, enum: ['ADMIN', 'CUSTOMER'], default: 'CUSTOMER' },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
