import { jest } from '@jest/globals';
import request from 'supertest';

const mockQuery = jest.fn();
const mockEnd = jest.fn();

jest.unstable_mockModule('../config/db.js', () => ({
  default: {
    query: mockQuery,
    end: mockEnd,
  },
}));

const { default: app } = await import('../app.js');
const { default: pool } = await import('../config/db.js');

describe('Buyers API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /buyers/:id', () => {
    it('should return a buyer by ID', async () => {
      const mockBuyer = { buyerId: 1, name: 'John Doe', email: 'john@example.com' };
      
      mockQuery.mockImplementation((text, params, callback) => {
        callback(null, { rows: [mockBuyer] });
      });

      const res = await request(app).get('/buyers/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockBuyer);
    });

    it('should return 204 if buyer not found', async () => {
      mockQuery.mockImplementation((text, params, callback) => {
        callback(null, { rows: [] });
      });

      const res = await request(app).get('/buyers/999');
      expect(res.statusCode).toEqual(204);
    });
  });
});
