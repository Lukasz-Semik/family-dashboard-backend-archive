# FAMILY DASHBOARD APP

### Backend repo

This is a repo for backend part of Family Dashboard App.
Frontend part you can find [here](https://github.com/Lukasz-Semik/family-dashboard-frontend)

### Technology stack

- node
- express
- mongoose
- sendgrid
- mocha

### Development

1. Clone this repo and prepare your local database `mongodb`.
2. Run `yarn`.
3. Run `yarn runDB`, to start the database. It has to be triggered before server.
4. In separate tab, run `yarn prepareDev`. This command will create a secret file at `src/config/secrets/secretes.js`.
5. Fill in all the secret variables.
6. Run `yarn dev`. Project will run on `port 8080`.

### Deployment

To deploy to production, run `yarn deploy`. This command will firstly checkout to master and pull the origin one. After that, it will push the master to `heroku`.

Production BE url: `https://family-dashboard-be.herokuapp.com/`

### Tests

For tests, run `yarn test`.
