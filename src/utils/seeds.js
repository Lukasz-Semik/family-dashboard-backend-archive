const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const UserTemp = require('../models/UserTemp');
const Token = require('../models/Token');
const { mockedUsersData } = require('../constants/testsFixtures');

const createUserConfirmedUser = mockedUserData => {
  const { firstName, lastName, password, email } = mockedUserData;

  return new UserProfile({
    firstName,
    lastName,
  })
    .save()
    .then(userProfile => {
      const newUser = new User({
        userProfile,
        password,
        email,
      });

      return bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          return newUser.save();
        })
      );
    });
};

const seedDb = done => {
  mongoose.connection
    .dropDatabase()
    .then(() => createUserConfirmedUser(mockedUsersData[1]))
    .then(() => {
      const { firstName, lastName, password, email } = mockedUsersData[2];

      return new UserTemp({
        firstName,
        lastName,
        email,
        password,
      }).save();
    })
    .then(userTemp => {
      return new Token({
        _userTempId: userTemp._id,
        email: userTemp.email,
      }).save();
    })
    .then(() => createUserConfirmedUser(mockedUsersData[3]))
    .then(() => createUserConfirmedUser(mockedUsersData[4]))
    .then(() => done());
};

module.exports = {
  seedDb,
};
