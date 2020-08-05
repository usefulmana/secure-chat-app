const { app } = require('../server');
const supertest = require('supertest');
const { userSeedData } = require('./seed/seedData');
const slugify = require('slugify');
const { User } = require('../models/User');
const { after } = require('lodash');

beforeAll(() => {
    jest.setTimeout(30000);
});

// Delete all users after test
afterAll(() => {
    User.deleteMany({}).exec();
})

describe('POST /auth', () => {
    let request = supertest(app);

    it('should register a user and return a token', async () => {
        const response = await request.post('/api/v1/auth/register').send({
            email: 'newUser@gmail.com',
            username: 'testing1',
            password: 'newUserTest'
        });

        expect(response.status).toEqual(200);
        expect(response.body.user.session_id).not.toBeNull();
        expect(response.body.token).not.toBeNull();
        expect(response.body.auth).not.toBeNull();
    });

    it('shouldnt register with invalid details', async () => {
        const response = await request.post('/api/v1/auth/register').send({
            email: 'test100@hotmail.com',
            username: 'testing1',
            password: 'testing100000000000000000000000'
        });

        expect(response.status).toEqual(400);
        expect(typeof response.body).toBe('object');
        expect(response.body).not.toBeNull();
    });

    it('should login a user and return a token', async () => {
        const response = await request
            .post('/api/v1/auth/login')
            .send({ email: userSeedData[0].email, password: userSeedData[0].password });

        expect(response.status).toEqual(200);
        expect(response.body.token).not.toBeNull();
        expect(response.body.user.session_id).not.toBeNull();
        expect(response.body.auth).not.toBeNull();
    });

    it('should return an object given the wrong login details', async () => {
        const response = await request
            .post('/api/v1/auth/login')
            .send({ email: 'testwrongemail@hotmail.com', password: 'testing123' });

        expect(response.status).toEqual(400);
        expect(typeof response.body).toBe('object');
    });
});
