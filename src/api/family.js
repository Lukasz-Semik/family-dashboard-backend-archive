const ROUTER = require('express').Router();

const authenticate = require('../helpers/authenticate');
const User = require('../models/User');
const Family = require('../models/Family');
const { API_CREATE_FAMILY } = require('../constants/routes');
const { USER_NOT_FOUND, FAMILY_NAME_REQUIRED } = require('../constants/errorsMessages');
const { isBlank } = require('../helpers/validators');

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

      const name = req.body.familyName || user.userProfile.lastName;
      const members = [user];

      if (isBlank(name)) {
        errors.familyName = FAMILY_NAME_REQUIRED;
        return res.json({ errors });
      }

      // TODO handling existing family situation
      // Family.findOne({ name }).then(family => {
      //   if (family) {

      //   }
      // })

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
