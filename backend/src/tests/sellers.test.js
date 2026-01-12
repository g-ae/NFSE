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

describe('Sellers API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /sellers', () => {
    it('should return all sellers', async () => {
      const mockSellers = [{ sellerId: 1, name: 'Shop A' }];
      
      mockQuery.mockImplementation((text, callback) => {
        callback(null, { rows: mockSellers });
      });

      const res = await request(app).get('/sellers');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockSellers);
    });
  });

  describe('GET /sellers/:id', () => {
    it('should return a seller by ID', async () => {
      const mockSeller = { sellerId: 1, name: 'Shop A' };
      
      mockQuery.mockImplementation((text, params, callback) => {
        callback(null, { rows: [mockSeller] });
      });

      const res = await request(app).get('/sellers/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockSeller);
    });

    it('should return 204 if seller not found', async () => {
      mockQuery.mockImplementation((text, params, callback) => {
        callback(null, { rows: [] });
      });

      const res = await request(app).get('/sellers/999');
      expect(res.statusCode).toEqual(204);
    });
  });
});
