const sgMail = require('@sendgrid/mail');
const { DEV_ENV, TESTS_ENV } = require('../constants/env');

const env = process.env.NODE_ENV;
const shouldRequireSecrets = env === DEV_ENV || env === TESTS_ENV;
const { SENDGRID_API_KEY } = shouldRequireSecrets ? require('../config/secrets/secrets') : {};

const sendgridApiKey = process.env.SENDGRID_API_KEY || SENDGRID_API_KEY;
sgMail.setApiKey(sendgridApiKey);

const sendAccountConfirmationRequest = (email, userName, token) => {
  const baseUrl =
    env === DEV_ENV ? 'http://localhost:8080' : 'https://family-dashboard-be.herokuapp.com';

  const msg = {
    to: email,
    from: 'family-dashboard@support.com',
    subject: 'Family Dashboard - account confirmation',
    html: `
      <h3>Hello ${userName}</h3>
      <p>
        Please confirm your account by visiting
        <a href='${baseUrl}/confirm?token=${token}&userName=${userName}' target="_blank">
          this page
        </a>
      </p>
    `,
  };

  sgMail.send(msg);
};

module.exports = {
  sendAccountConfirmationRequest,
};
