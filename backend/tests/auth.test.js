const { app } = require('../server');
const supertest = require('supertest');
const { userSeedData } = require('./seed/seedData');
const slugify = require('slugify');
const { User } = require('../models/User');

beforeAll(() => {
    jest.setTimeout(30000);
});

describe('POST /auth', () => {
    let request = supertest(app);

    beforeEach( async() => {
        await User.deleteMany({}).exec();
    });

    it('should register a user and return a token', async () => {
        const response = await request.post('/api/v1/auth/register').send({
            email: 'newUser@gmail.com',
            username: 'newUser100',
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
            username: 'test',
            password: 'testing100'
        });

        expect(response.status).toEqual(200);
        expect(typeof response.body).toBe('object');
        expect(response.body).not.toBeNull();
    });
});
