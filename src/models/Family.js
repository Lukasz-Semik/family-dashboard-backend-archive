const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
});

const Family = mongoose.model('Family', FamilySchema);
module.exports = Family;
