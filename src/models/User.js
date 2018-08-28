const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  hasFamily: {
    type: Boolean,
    default: false,
  },
  userProfile: {
    type: Schema.Types.ObjectId,
    ref: 'UserProfile',
  },
  family: {
    type: Schema.Types.ObjectId,
    ref: 'Family',
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
