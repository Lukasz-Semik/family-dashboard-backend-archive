const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY } = require('../config/secrets/secrets');
const { DEV_ENV } = require('../constants/env');

sgMail.setApiKey(SENDGRID_API_KEY);

const sendAccountConfirmationRequest = (email, userName, token) => {
  const env = process.env.NODE_ENV;

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
