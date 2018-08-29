const mockedUsersData = [
  {
    email: 'john@doe.com',
    password: 'Password123',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    email: 'jane@doe.com',
    password: 'Password123',
    firstName: 'Jane',
    lastName: 'Doe',
  },
  {
    email: 'stan@doe.com',
    password: 'Password123',
    firstName: 'Stan',
    lastName: 'Doe',
  },
  {
    email: 'kate@doe.com',
    password: 'Password123',
    firstName: 'Kate',
    lastName: 'Doe',
  },
  {
    email: 'george@doe.com',
    password: 'Password123',
    firstName: 'George',
    lastName: 'Doe',
    hasFamily: true,
  },
];

const mockedWrongToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViODU1YWNmZDZmNDZhZGU1MGMxOWMzYiIsImVtYWlsIjoic2VtaWsubHVrYXN6QGdtYWlsLmNvbSIsImlhdCI6MTUzNTQ2NjUwMSwiZXhwIjoxNTM2Njc2MTAxfQ.gouwZ2zU50SzloQEHyRjAvP6No1_E2NJHlZXMZrRpIs';

module.exports = {
  mockedUsersData,
  mockedWrongToken,
};
