const request = require('supertest');
const expect = require('expect');

const { APP } = require('../server');
const { API_FULL_SIGN_IN, API_FULL_CREATE_FAMILY } = require('../constants/routes');

const { mockedUsersData } = require('../constants/testsFixtures');

// before(done => seedFamilies(done));

describe('family api routes', () => {
  let AUTHENTICATED_TOKEN = '';

  it('Should log in user without family', done => {
    const { email, password } = mockedUsersData[3];

    request(APP)
      .post(API_FULL_SIGN_IN)
      .send({ email, password })
      .expect(200)
      .expect(res => {
        AUTHENTICATED_TOKEN = res.body.token;
      })
      .end(err => {
        if (err) return done(err);
        done();
      });
  });

  describe(`POST ${API_FULL_CREATE_FAMILY}`, () => {
    it('Should create a family and return `200` and updated user', done => {
      request(APP)
        .post(API_FULL_CREATE_FAMILY)
        .set('Authorization', AUTHENTICATED_TOKEN)
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
  });
});
