const bcrypt = require('bcryptjs');

const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const UserTemp = require('../models/UserTemp');
const Token = require('../models/Token');
const { mockedUsersData } = require('../constants/testsFixtures');

const seedUsers = done => {
  UserProfile.remove({})
    .then(() => User.remove({}))
    .then(() => UserProfile.remove({}))
    .then(() => UserTemp.remove({}))
    .then(() => Token.remove({}))
    .then(() => {
      const { firstName, lastName, password, email } = mockedUsersData[0];

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
    })
    .then(() => {
      const { firstName, lastName, password, email } = mockedUsersData[1];

      return new UserTemp({
        firstName,
        lastName,
        email,
        password,
      }).save();
    })
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
    .then(() => done());
};

module.exports = {
  seedUsers,
};
