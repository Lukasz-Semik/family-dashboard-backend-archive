const API_BASE = '/api/user';
const createFullRoute = prefix => `${API_BASE}${prefix}`;

const API_SIGN_UP = '/sign-up';
const API_FULL_SIGN_UP = createFullRoute(API_SIGN_UP);

const API_SIGN_IN = '/sign-in';
const API_FULL_SIGN_IN = createFullRoute(API_SIGN_IN);

const API_CONFIRM = '/confirm';
const API_FULL_CONFIRM = createFullRoute(API_CONFIRM);

const API_TEST = '/test';
const API_FULL_TEST = createFullRoute(API_TEST);

module.exports = {
  createFullRoute,
  API_BASE,
  API_SIGN_UP,
  API_FULL_SIGN_UP,
  API_SIGN_IN,
  API_FULL_SIGN_IN,
  API_CONFIRM,
  API_FULL_CONFIRM,
  API_TEST,
  API_FULL_TEST,
};
