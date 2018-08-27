const { TESTS_ENV, DEV_ENV, TEST_PORT, DEV_PORT } = require('../constants/env');
const { DB_USER, DB_PASS } = require('./secrets/secrets');

const setUpEnvironment = () => {
  const env = process.env.NODE_ENV || DEV_ENV;

  if (env === DEV_ENV) {
    process.env.PORT = DEV_PORT;
    process.env.NODE_ENV = DEV_ENV;
    process.env.MONGODB_URI = `mongodb://${DB_USER}:${DB_PASS}@ds247191.mlab.com:47191/family-dashboard-dev`;
  } else if (env === TESTS_ENV) {
    process.env.PORT = TEST_PORT;
    process.env.MONGODB_URI = `mongodb://${DB_USER}:${DB_PASS}@ds125402.mlab.com:25402/family-dashboard-test`;
  } else {
    process.env.MONGODB_URI = `mongodb://${DB_USER}:${DB_PASS}@ds135817.mlab.com:35817/family-dashboard-prod`;
  }
};

setUpEnvironment();
