const expect = require('expect');

const {
  isBlank,
  checkProperLength,
  checkEmail,
  checkPassword,
  validateSignInData,
  validateSingUpData,
} = require('./validators');
const {
  EMAIL_REQUIRED,
  EMAIL_WRONG_FORMAT,
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRED,
  PASS_REQUIRED,
  PASS_LENGTH,
  PASS_NOT_EQUAL,
} = require('../constants/errorsMessages');

describe('validators', () => {
  describe('isBlank()', () => {
    it('Should return false if there is at least one proper character', () => {
      expect(isBlank('a')).toBe(false);
    });

    it('Should return true message for empty string', () => {
      expect(isBlank('')).toBe(true);
    });

    it('Should return true value for string fullfiled with spaces', () => {
      expect(isBlank('  ')).toBe(true);
    });
  });

  describe('checkProperLength()', () => {
    it('Should return null if string is proper', () => {
      expect(checkProperLength('Test', 3, 10, 'error message')).toBe(null);
    });

    it('Should return null if string is proper', () => {
      expect(checkProperLength('Test', 6, 10, 'error message')).toBe('error message');
    });
  });

  describe('checkEmail()', () => {
    it('Should return null if e-mail is correct', () => {
      expect(checkEmail('email@gmail.com')).toBe(null);
    });

    it('Should return proper message for empty email', () => {
      expect(checkEmail('')).toBe(EMAIL_REQUIRED);
    });

    it('Should return proper value for email fullfiled with spaces', () => {
      expect(checkEmail('  ')).toBe(EMAIL_REQUIRED);
    });

    it('Should return proper message for not properly formatted email', () => {
      expect(checkEmail('aaa@')).toBe(EMAIL_WRONG_FORMAT);
    });
  });

  describe('checkPassword()', () => {
    it('Should return null if password is correct', () => {
      expect(checkPassword('Password123')).toBe(null);
    });

    it('Should return proper message for empty password', () => {
      expect(checkPassword('')).toBe(PASS_REQUIRED);
    });

    it('Should return proper value for password fullfiled with spaces', () => {
      expect(checkPassword('  ')).toBe(PASS_REQUIRED);
    });

    it('Should return proper message for too password with ', () => {
      expect(checkPassword('aaaaa')).toBe(PASS_LENGTH);
      expect(checkPassword('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).toBe(
        PASS_LENGTH
      );
    });
  });

  describe('validateSignInData()', () => {
    it('Should have isValid property set to true if data are proper', () => {
      const validation = validateSignInData({ email: 'email@email.com', password: 'Password123' });

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual({});
    });

    it('Should contanin errors messages and isValid set to false for not proper data', () => {
      const validation = validateSignInData({ email: 'emai', password: '' });

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toEqual({
        email: EMAIL_WRONG_FORMAT,
        password: PASS_REQUIRED,
      });
    });
  });

  describe('validateSingUpData()', () => {
    it('Should have isValid property set to true if data are proper', () => {
      const validation = validateSingUpData({
        email: 'email@email.com',
        password: 'Password123',
        passwordConfirm: 'Password123',
        firstName: 'first-name',
        lastName: 'last-name',
      });

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual({});
    });

    it('Should contanin errors messages and isValid set to false for not proper data', () => {
      const validation = validateSingUpData({
        email: 'emai',
        password: 'Pass',
        passwordConfirm: ' ',
      });

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toEqual({
        email: EMAIL_WRONG_FORMAT,
        password: PASS_LENGTH,
        passwordConfirm: PASS_REQUIRED,
        equalPasswords: PASS_NOT_EQUAL,
        firstName: FIRST_NAME_REQUIRED,
        lastName: LAST_NAME_REQUIRED,
      });
    });
  });
});
