const request = require('supertest');
const expect = require('expect');

const { APP } = require('../server');
const { API_FULL_SIGN_IN, API_FULL_CREATE_FAMILY } = require('../constants/routes');

const { mockedUsersData } = require('../constants/testsFixtures');

describe('family api routes', () => {
  describe(`POST ${API_FULL_CREATE_FAMILY}`, () => {
    let AUTHENTICATED_TOKEN_WITH_FAMILY = '';
    let AUTHENTICATED_TOKEN_WITHOUT_FAMILY = '';

    it('Should log in user without family', done => {
      const { email, password } = mockedUsersData[3];

      request(APP)
        .post(API_FULL_SIGN_IN)
        .send({ email, password })
        .expect(200)
        .expect(res => {
          AUTHENTICATED_TOKEN_WITHOUT_FAMILY = res.body.token;
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    // TODO: resolve this skipped tests
    it.skip('Should log in user with family', done => {
      const { email, password } = mockedUsersData[4];

      request(APP)
        .post(API_FULL_SIGN_IN)
        .send({ email, password })
        .expect(200)
        .expect(res => {
          AUTHENTICATED_TOKEN_WITH_FAMILY = res.body.token;
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should create a family and return `200` and updated user', done => {
      request(APP)
        .post(API_FULL_CREATE_FAMILY)
        .set('Authorization', AUTHENTICATED_TOKEN_WITHOUT_FAMILY)
        .send()
        .expect(200)
        .expect(res => {
          expect(res.body).toMatchObject({
            hasFamily: true,
            email: mockedUsersData[3].email,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    // TODO: resolve this skipped tests
    it.skip('Should return `400` and proper message', done => {
      request(APP)
        .post(API_FULL_CREATE_FAMILY)
        .set('Authorization', AUTHENTICATED_TOKEN_WITH_FAMILY)
        .send()
        .expect(400)
        .expect(res => {
          console.log(res.body);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });
});
