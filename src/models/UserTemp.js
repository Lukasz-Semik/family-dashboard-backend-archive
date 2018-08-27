const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { EXPIRE_1_WEEK } = require('../constants/expirations');

const UserTempSchema = new Schema({
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
    expires: EXPIRE_1_WEEK,
  },
});

const UserTemp = mongoose.model('UserTemp', UserTempSchema);
module.exports = UserTemp;
