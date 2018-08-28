const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'config/secrets/secrets.js');

const fileContent = `const SENDGRID_API_KEY = 'sendgrid api key here goes';
const DB_USER = 'db user name goes here';
const DB_PASS = 'db password goes here';

module.exports = {
  SENDGRID_API_KEY,
  DB_USER,
  DB_PASS,
};
`;

fs.writeFile(filePath, fileContent, err => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log('The secrets template was succesfully saved!');
});
