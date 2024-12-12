const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary

describe('Server', () => {
    test('should respond with a 200 status code', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});