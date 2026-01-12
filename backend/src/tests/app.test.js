import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';

describe('API Health Check', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toEqual(404);
  });
});
