const request = require('supertest');
const app = require('../src/app');

describe('GET /api/games', () => {
    it('debe retornar 403 si no hay token', async () => {
        const res = await request(app).get('/api/games');
        expect(res.statusCode).toEqual(403);
    });
});
