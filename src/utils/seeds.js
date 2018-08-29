const bcrypt = require('bcryptjs');

const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const UserTemp = require('../models/UserTemp');
const Token = require('../models/Token');
const Family = require('../models/Family');
const { mockedUsersData } = require('../constants/testsFixtures');

const clearTestDataBase = () =>
  UserProfile.remove({})
    .then(() => User.remove({}))
    .then(() => UserProfile.remove({}))
    .then(() => UserTemp.remove({}))
    .then(() => Token.remove({}))
    .then(() => Family.remove({}));

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

const seedUsers = done => {
  clearTestDataBase()
    .then(() => createUserConfirmedUser(mockedUsersData[0]))
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
    .then(() => createUserConfirmedUser(mockedUsersData[3]))
    .then(() => createUserConfirmedUser(mockedUsersData[4]))
    .then(() => done());
};

module.exports = {
  seedUsers,
};
