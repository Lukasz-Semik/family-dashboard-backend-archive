// User Routes
const API_BASE_USER = '/api/user';
const createFullUserRoute = suffix => `${API_BASE_USER}${suffix}`;

const API_SIGN_UP = '/sign-up';
const API_FULL_SIGN_UP = createFullUserRoute(API_SIGN_UP);

const API_SIGN_IN = '/sign-in';
const API_FULL_SIGN_IN = createFullUserRoute(API_SIGN_IN);

const API_CONFIRM = '/confirm';
const API_FULL_CONFIRM = createFullUserRoute(API_CONFIRM);

const API_IS_SIGNED_IN = '/is-signed-in';
const API_FULL_IS_SIGNED_IN = createFullUserRoute(API_IS_SIGNED_IN);

const API_GET_CURRENT_USER = '/get-current-user';
const API_FULL_GET_CURRENT_USER = createFullUserRoute(API_GET_CURRENT_USER);

// Family Routes
const API_BASE_FAMILY = '/api/family';
const createFullFamilyRoute = suffix => `${API_BASE_FAMILY}${suffix}`;

const API_CREATE_FAMILY = '/create';
const API_FULL_CREATE_FAMILY = createFullFamilyRoute(API_CREATE_FAMILY);

module.exports = {
  createFullUserRoute,
  API_BASE_USER,
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
  API_CREATE_FAMILY,
  API_BASE_FAMILY,
  API_FULL_CREATE_FAMILY,
};
