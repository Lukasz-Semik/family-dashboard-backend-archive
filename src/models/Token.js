const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { EXPIRE_12_H } = require('../constants/expirations');

const TokenSchema = new Schema({
  _userTempId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'UserTemp',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: EXPIRE_12_H,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
});

const Token = mongoose.model('Token', TokenSchema);
module.exports = Token;
