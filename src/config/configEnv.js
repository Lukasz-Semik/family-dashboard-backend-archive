const { TESTS_ENV, DEV_ENV, TEST_PORT, DEV_PORT } = require('../constants/env');
const env = process.env.NODE_ENV || DEV_ENV;
const shouldRequireSecrets = env === DEV_ENV || env === TESTS_ENV;
const { DB_USER, DB_PASS } = shouldRequireSecrets ? require('./secrets/secrets') : {};

const setUpEnvironment = () => {
  const dbUser = process.env.DB_USER || DB_USER;
  const dbPass = process.env.DB_PASS || DB_PASS;

  if (env === DEV_ENV) {
    process.env.PORT = DEV_PORT;
    process.env.NODE_ENV = DEV_ENV;
    // process.env.MONGODB_URI = `mongodb://${dbUser}:${dbPass}@ds237072.mlab.com:37072/family-dashboard-dev`;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/family-dashboard-dev';
  } else if (env === TESTS_ENV) {
    process.env.PORT = TEST_PORT;
    process.env.MONGODB_URI = `mongodb://localhost:27017/family-dashboard-test`;
  } else {
    process.env.MONGODB_URI = `mongodb://${dbUser}:${dbPass}@ds135817.mlab.com:35817/family-dashboard-prod`;
  }
};

setUpEnvironment();
