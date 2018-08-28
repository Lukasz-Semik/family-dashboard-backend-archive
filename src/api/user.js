const bcrypt = require('bcryptjs');
const ROUTER = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/User');
const UserTemp = require('../models/UserTemp');
const UserProfile = require('../models/UserProfile');
const Token = require('../models/Token');
const { API_SIGN_UP, API_SIGN_IN, API_CONFIRM, API_TEST } = require('../constants/routes');
const {
  EMAIL_EXISTS,
  EMAIL_NOT_VERIFIED_EXISTS,
  PASS_INCORRECT,
  USER_NOT_FOUND,
  USER_NOT_VERIFIED,
  TOKEN_NOT_SEND,
  TOKEN_NOT_FOUND,
} = require('../constants/errorsMessages');
const { EXPIRE_SIGN_IN_SESSION } = require('../constants/expirations');
const { validateSingUpData, validateSignInData } = require('../helpers/validators');
const secret = require('../config/mongodb/key-mongo-db').secret;
const { sendAccountConfirmationRequest } = require('../services/mailers');
const { TESTS_ENV } = require('../constants/env');

// @route GET api/user/test
// @desc Route only for set up checking
// @access public
ROUTER.get(API_TEST, (req, res) => res.json({ msg: 'User Route Test works!' }));

// @route   POST api/user/sign-up
// @desc    Create User and UserProfile
// @access  Public
ROUTER.post(API_SIGN_UP, (req, res) => {
  const { errors, isValid } = validateSingUpData(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const { email, password, firstName, lastName } = req.body;

  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        errors.email = EMAIL_EXISTS;

        return res.status(400).json({ errors });
      }

      UserTemp.findOne({ email }).then(existingTempUser => {
        if (existingTempUser) {
          errors.email = EMAIL_NOT_VERIFIED_EXISTS;

          return res.status(400).json({ errors });
        }

        const newUserTemp = new UserTemp({
          email,
          password,
          firstName,
          lastName,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUserTemp.password, salt, (err, hash) => {
            if (err) throw err;

            newUserTemp.password = hash;
            newUserTemp.save().then(userTemp => {
              return new Token({
                _userTempId: userTemp._id,
                email: userTemp.email,
              })
                .save()
                .then(token => {
                  const isTest = process.env.NODE_ENV === TESTS_ENV;

                  if (!isTest) {
                    sendAccountConfirmationRequest(email, firstName, token._id);
                  }

                  return res.json(userTemp);
                })
                .catch(err => res.json(err));
            });
          });
        });
      });
    })
    .catch(err => res.status(400).json(err));
});

// @route POST api/user/confirm
// @desc Confirm user
// @access Public
ROUTER.post(API_CONFIRM, (req, res) => {
  const errors = {};
  const { token } = req.body;

  if (!token) {
    errors.token = TOKEN_NOT_SEND;
    return res.status(400).json({ errors });
  }

  Token.findById(token)
    .then(foundToken => {
      if (!foundToken) {
        errors.token = TOKEN_NOT_FOUND;
        return res.status(404).json({ errors });
      }

      UserTemp.findOne({ email: foundToken.email }).then(userTemp => {
        if (!userTemp) {
          errors.user = USER_NOT_FOUND;
          return res.status(404).json({ errors });
        }

        const { email, password, firstName, lastName } = userTemp;

        UserProfile.findOne({ email }).then(existingUserProfile => {
          if (existingUserProfile) {
            errors.email = EMAIL_EXISTS;

            return res.status(400).json({ errors });
          }

          new UserProfile({
            firstName,
            lastName,
          })
            .save()
            .then(newUserProfile =>
              new User({
                email,
                password,
                userProfile: newUserProfile,
              }).save()
            )
            .then(user =>
              Token.findOne({ _id: token })
                .remove()
                .then(() => UserTemp.findOne({ email }).remove())
                .then(() => res.status(200).json(user))
            )
            .catch(err => res.status(400).json(err));
        });
      });
    })
    .catch(err => res.status(400).json(err));
});

// @route   POST api/user/sign-in
// @desc    Login User / Return JWT Token
// @access  Public
ROUTER.post(API_SIGN_IN, (req, res) => {
  const { errors, isValid } = validateSignInData(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const { email, password } = req.body;
  UserTemp.findOne({ email })
    .then(userTemp => {
      if (userTemp) {
        errors.user = USER_NOT_VERIFIED;
        return res.status(400).json({ errors });
      }

      User.findOne({ email }).then(user => {
        if (!user) {
          errors.user = USER_NOT_FOUND;
          return res.status(404).json({ errors });
        }

        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            const payload = { id: user.id, email: user.email };

            return jwt.sign(
              payload,
              secret,
              {
                expiresIn: EXPIRE_SIGN_IN_SESSION,
              },
              (err, token) =>
                res.json({
                  success: true,
                  token: 'Bearer ' + token,
                })
            );
          }

          errors.password = PASS_INCORRECT;
          return res.status(400).json({ errors });
        });
      });
    })
    .catch(err => res.status(400).json(err));
});

ROUTER.get('/is-signed-in', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      if (!user) {
        return res.json({ isLoggedIn: false });
      }

      res.json({ isLoggedIn: true });
    })
    .catch(() => res.json({ isLoggedIn: false }));
});

module.exports = ROUTER;
