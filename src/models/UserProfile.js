const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: create full profile schema
const UserProfileSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isFamilyHead: {
    type: Boolean,
    default: false,
  },
});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile;
