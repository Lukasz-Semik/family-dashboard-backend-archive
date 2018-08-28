const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const { APP } = require('../server');
const {
  API_FULL_SIGN_UP,
  API_FULL_SIGN_IN,
  API_FULL_CONFIRM,
  API_FULL_IS_SIGNED_IN,
  API_FULL_GET_CURRENT_USER,
} = require('../constants/routes');
const Token = require('../models/Token');

const { seedUsers } = require('../utils/seeds');
const { mockedUsersData, mockedWrongToken } = require('../constants/testsFixtures');

const {
  EMAIL_REQUIRED,
  EMAIL_WRONG_FORMAT,
  EMAIL_EXISTS,
  PASS_REQUIRED,
  PASS_NOT_EQUAL,
  PASS_INCORRECT,
  TOKEN_NOT_SEND,
  TOKEN_NOT_FOUND,
  USER_NOT_FOUND,
  USER_NOT_VERIFIED,
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRED,
} = require('../constants/errorsMessages');

const { password: defaultPassword } = mockedUsersData[0];

before(done => {
  seedUsers(done);
});

describe('user api routes', () => {
  let AUTHENTICATED_TOKEN = '';

  describe(`POST ${API_FULL_SIGN_UP}`, () => {
    it('Should create new temporary user', done => {
      const email = 'example@email.com';
      const password = defaultPassword;
      const passwordConfirm = defaultPassword;
      const { firstName, lastName } = mockedUsersData[0];

      request(APP)
        .post(API_FULL_SIGN_UP)
        .send({ email, password, firstName, lastName, passwordConfirm })
        .expect(200)
        .expect(res => {
          const savedPassword = res.body.password;

          expect(savedPassword).not.toBe(password);
          expect(savedPassword).toEqual(expect.any(String));
          expect(res.body.email).toBe(email);
          expect(res.body.firstName).toBe(firstName);
          expect(res.body.lastName).toBe(lastName);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should respond with `400` and errors if signup data are not provided', done => {
      request(APP)
        .post(API_FULL_SIGN_UP)
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.body.errors).toEqual({
            email: EMAIL_REQUIRED,
            password: PASS_REQUIRED,
            passwordConfirm: PASS_REQUIRED,
            firstName: FIRST_NAME_REQUIRED,
            lastName: LAST_NAME_REQUIRED,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should respond with `400` and errors if signup data are not proper', done => {
      const email = 'examp';
      const password = defaultPassword;
      const passwordConfirm = 'Password1';
      const firstName = '';
      const lastName = '  ';

      request(APP)
        .post(API_FULL_SIGN_UP)
        .send({ email, password, firstName, lastName, passwordConfirm })
        .expect(400)
        .expect(res => {
          expect(res.body.errors).toEqual({
            email: EMAIL_WRONG_FORMAT,
            equalPasswords: PASS_NOT_EQUAL,
            firstName: FIRST_NAME_REQUIRED,
            lastName: LAST_NAME_REQUIRED,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should respond with `400` and errors for existing email', done => {
      const email = 'john@doe.com';
      const password = defaultPassword;
      const passwordConfirm = defaultPassword;
      const firstName = 'John';
      const lastName = 'Doe';

      request(APP)
        .post(API_FULL_SIGN_UP)
        .send({ email, password, firstName, lastName, passwordConfirm })
        .expect(400)
        .expect(res => {
          expect(res.body.errors).toEqual({
            email: EMAIL_EXISTS,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`POST ${API_FULL_CONFIRM}`, () => {
    it('Should respond with 400 and error for not provided token', done => {
      request(APP)
        .post(API_FULL_CONFIRM)
        .send()
        .expect(400)
        .expect(res => {
          expect(res.body.errors).toEqual({
            token: TOKEN_NOT_SEND,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should respond with 404 and error for not provided token', done => {
      request(APP)
        .post(API_FULL_CONFIRM)
        .send({ token: ObjectID() })
        .expect(404)
        .expect(res => {
          expect(res.body.errors).toEqual({
            token: TOKEN_NOT_FOUND,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should respond with 200 and return user object', done => {
      Token.findOne({ email: mockedUsersData[2].email }).then(token => {
        request(APP)
          .post(API_FULL_CONFIRM)
          .send({ token: token._id })
          .expect(res => {
            expect(res.body).toMatchObject({
              hasFamily: false,
              email: 'stan@doe.com',
              password: 'Password123',
              userProfile: {
                isFamilyHead: false,
                firstName: 'Stan',
                lastName: 'Doe',
              },
            });
          })
          .end(err => {
            if (err) return done(err);
            done();
          });
      });
    });
  });

  describe(`POST ${API_FULL_SIGN_IN}`, () => {
    it('Should return proper data for succesfull signin', done => {
      const { email, password } = mockedUsersData[0];

      request(APP)
        .post(API_FULL_SIGN_IN)
        .send({ email, password })
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          const { token } = res.body;
          AUTHENTICATED_TOKEN = token;

          expect(token.slice(0, 6)).toBe('Bearer');
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should respond with `400` and errors if signin data are not proper', done => {
      const email = 'emai';
      const password = '  ';

      request(APP)
        .post(API_FULL_SIGN_IN)
        .send({ email, password })
        .expect(400)
        .expect(res => {
          expect(res.body.errors).toEqual({
            email: EMAIL_WRONG_FORMAT,
            password: PASS_REQUIRED,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should respond with `404` and error for not existing user', done => {
      const email = 'not-existing-email@gmail.com';
      const password = defaultPassword;

      request(APP)
        .post(API_FULL_SIGN_IN)
        .send({ email, password })
        .expect(404)
        .expect(res => {
          expect(res.body.errors).toEqual({
            user: USER_NOT_FOUND,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should respond with `400` and error for not valid password', done => {
      const { email } = mockedUsersData[0];
      const password = 'Password12345';

      request(APP)
        .post(API_FULL_SIGN_IN)
        .send({ email, password })
        .expect(400)
        .expect(res => {
          expect(res.body.errors).toEqual({
            password: PASS_INCORRECT,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should respond with `400` and error for not verified user', done => {
      const { email } = mockedUsersData[1];
      const password = defaultPassword;
      request(APP)
        .post(API_FULL_SIGN_IN)
        .send({ email, password })
        .expect(400)
        .expect(res => {
          expect(res.body.errors).toEqual({
            user: USER_NOT_VERIFIED,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`GET ${API_FULL_IS_SIGNED_IN}`, () => {
    it('Should respond with `200` and isLoggedIn message for authenticated user', done => {
      request(APP)
        .get(API_FULL_IS_SIGNED_IN)
        .set('Authorization', AUTHENTICATED_TOKEN)
        .expect(200)
        .expect(res => {
          expect(res.body).toEqual({
            isLoggedIn: true,
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should respond with `401` and Unathorized message for wrong token', done => {
      request(APP)
        .get(API_FULL_IS_SIGNED_IN)
        .set('Authorization', mockedWrongToken)
        .expect(401)
        .expect(res => {
          expect(res.text).toBe('Unauthorized');
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should respond with `401` and isLoggedIn message set to false for empty token', done => {
      request(APP)
        .get(API_FULL_IS_SIGNED_IN)
        .set('Authorization', '')
        .expect(401)
        .expect(res => {
          expect(res.text).toBe('Unauthorized');
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(`GET ${API_FULL_GET_CURRENT_USER}`, () => {
    it("Should respond with `200` and return user object and it's profile", done => {
      request(APP)
        .get(API_FULL_GET_CURRENT_USER)
        .set('Authorization', AUTHENTICATED_TOKEN)
        .expect(200)
        .expect(res => {
          expect(res.body.user.userProfile.createdAt).toEqual(expect.any(String));
          expect(res.body).toMatchObject({
            user: {
              email: 'john@doe.com',
              hasFamily: false,
              userProfile: {
                firstName: 'John',
                isFamilyHead: false,
                lastName: 'Doe',
              },
            },
          });
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should respond with `401` and Unathorized message for wrong token', done => {
      request(APP)
        .get(API_FULL_GET_CURRENT_USER)
        .set('Authorization', mockedWrongToken)
        .expect(401)
        .expect(res => {
          expect(res.text).toBe('Unauthorized');
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it('Should respond with `401` and isLoggedIn message set to false for empty token', done => {
      request(APP)
        .get(API_FULL_GET_CURRENT_USER)
        .set('Authorization', '')
        .expect(401)
        .expect(res => {
          expect(res.text).toBe('Unauthorized');
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });
});
