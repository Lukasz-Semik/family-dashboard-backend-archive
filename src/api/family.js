const ROUTER = require('express').Router();

const authenticate = require('../helpers/authenticate');
const { isBlank } = require('../helpers/validators');
const User = require('../models/User');
const Family = require('../models/Family');
const { API_CREATE_FAMILY } = require('../constants/routes');
const {
  USER_NOT_FOUND,
  USER_HAS_FAMILY,
  FAMILY_NAME_REQUIRED,
} = require('../constants/errorsMessages');

// @route   POST /api/family/create
// @desc    Check if user is logged in
// @access  Private
ROUTER.post(API_CREATE_FAMILY, authenticate(), (req, res) => {
  const { id: userId } = req.user;

  User.findById(userId)
    .populate('userProfile', ['lastName'])
    .then(user => {
      const errors = {};

      if (!user) {
        errors.user = USER_NOT_FOUND;
        return res.json({ errors });
      }

      if (user.hasFamily) {
        errors.user = USER_HAS_FAMILY;
        return res.json({ errors });
      }

      const name = (req.body && req.body.familyName) || user.userProfile.lastName;
      const members = [user];

      if (isBlank(name)) {
        errors.family = FAMILY_NAME_REQUIRED;
        return res.json({ errors });
      }

      return new Family({
        name,
        members,
      }).save();
    })
    .then(family => {
      const payload = {
        hasFamily: true,
        family,
      };
      User.findByIdAndUpdate(userId, { $set: payload }, { new: true }).then(user => res.json(user));
    })
    //eslint-disable-next-line no-console
    .catch(err => console.log(err));
});

module.exports = ROUTER;
