require('./config/configEnv');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const DB = require('./config/mongodb/key-mongo-db').mongoURI;
const { API_BASE } = require('./constants/routes');
const userRouter = require('./api/user');
const mailerRouter = require('./routes/mailers');

const PORT = process.env.PORT;
const APP = express();

APP.set('view engine', 'hbs');
APP.use(bodyParser.urlencoded({ extended: false }));
APP.use(bodyParser.json());
APP.use(API_BASE, userRouter);
APP.use('/', mailerRouter);
APP.use(express.static(path.join(__dirname, '../public')));

/* eslint-disable no-console */
mongoose
  .connect(
    DB,
    { useNewUrlParser: true }
  )
  .then(() => console.log('mongo db connected'))
  .catch(err => console.log(err));

APP.listen(PORT, () => console.log(`Server running on port ${PORT}`));
/* eslint-enable */

module.exports = { APP };
