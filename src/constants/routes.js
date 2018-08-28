const API_BASE = '/api/user';
const createFullRoute = suffix => `${API_BASE}${suffix}`;

const API_SIGN_UP = '/sign-up';
const API_FULL_SIGN_UP = createFullRoute(API_SIGN_UP);

const API_SIGN_IN = '/sign-in';
const API_FULL_SIGN_IN = createFullRoute(API_SIGN_IN);

const API_CONFIRM = '/confirm';
const API_FULL_CONFIRM = createFullRoute(API_CONFIRM);

const API_IS_SIGNED_IN = '/is-signed-in';
const API_FULL_IS_SIGNED_IN = createFullRoute(API_IS_SIGNED_IN);

const API_GET_CURRENT_USER = '/get-current-user';
const API_FULL_GET_CURRENT_USER = createFullRoute(API_GET_CURRENT_USER);

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
  API_IS_SIGNED_IN,
  API_FULL_IS_SIGNED_IN,
  API_GET_CURRENT_USER,
  API_FULL_GET_CURRENT_USER,
  API_TEST,
  API_FULL_TEST,
};
