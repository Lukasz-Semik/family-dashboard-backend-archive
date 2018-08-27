const validator = require('validator');
const { isEmpty, isEqual } = require('lodash');

const {
  EMAIL_REQUIRED,
  EMAIL_WRONG_FORMAT,
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRED,
  PASS_REQUIRED,
  PASS_LENGTH,
  PASS_NOT_EQUAL,
} = require('../constants/errorsMessages');

const isBlank = value => (!value ? true : isEmpty(String(value).trim()));

const checkProperLength = (value, min, max, errorMsg) => {
  if (!isBlank(value) && !validator.isLength(String(value), { min, max })) return errorMsg;

  return null;
};

const checkEmail = email => {
  if (isBlank(email)) return EMAIL_REQUIRED;

  if (!isBlank(email) && !validator.isEmail(String(email))) return EMAIL_WRONG_FORMAT;

  return null;
};

const checkPassword = password => {
  if (isBlank(password)) return PASS_REQUIRED;

  return checkProperLength(password, 6, 30, PASS_LENGTH);
};

const validateSignInData = data => {
  const { email, password } = data;
  const errors = {};

  const emailErrors = checkEmail(email);
  if (emailErrors) errors.email = emailErrors;

  const passwordErrors = checkPassword(password);
  if (passwordErrors) errors.password = passwordErrors;

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

const validateSingUpData = data => {
  const { email, password, firstName, lastName, passwordConfirm } = data;
  const errors = {};

  const emailErrors = checkEmail(email);
  if (emailErrors) errors.email = emailErrors;

  const passwordErrors = checkPassword(password);
  if (passwordErrors) errors.password = passwordErrors;

  const passwordConfirmErrors = checkPassword(passwordConfirm);
  if (passwordConfirmErrors) errors.passwordConfirm = passwordConfirmErrors;

  const equalPasswordErrors = isEqual(password, passwordConfirm) ? null : PASS_NOT_EQUAL;
  if (equalPasswordErrors) errors.equalPasswords = equalPasswordErrors;

  if (isBlank(firstName)) errors.firstName = FIRST_NAME_REQUIRED;

  if (isBlank(lastName)) errors.lastName = LAST_NAME_REQUIRED;

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

module.exports = {
  isBlank,
  checkProperLength,
  checkEmail,
  checkPassword,
  validateSignInData,
  validateSingUpData,
};
