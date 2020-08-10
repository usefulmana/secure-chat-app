const { app } = require('../server');
const supertest = require('supertest');

let token;
let request = supertest(app);

beforeAll(async () => {

    jest.setTimeout(30000);

    const response = await request
        .post('/api/v1/auth/register')
        .send({ username: "usefulmana", email: "haha@gmail.com", password: "password" });

    token = response.body.token;
});


describe('POST /change-pw', () => {
    it('should change password based on user input', async() => {
        const response = await request
        .post('/api/v1/user/change-pw')
        .set('Authorization', token)
        .send({ password: 'password'});
        
        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
        
    }),
    it('should send a password recovery email', async() => {
        const response = await request
        .post('/api/v1/user/forgot-pw')
        .send({email: 'haha@gmail.com'})

        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
    })
})