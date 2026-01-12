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

describe('Bundles API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /bundles', () => {
    it('should return all available bundles', async () => {
      const mockBundles = [
        { bundleId: 1, content: 'Bundle 1', reservedTime: null },
        { bundleId: 2, content: 'Bundle 2', reservedTime: null }
      ];
      
      mockQuery.mockImplementation((text, callback) => {
        callback(null, { rows: mockBundles });
      });

      const res = await request(app).get('/bundles');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockBundles);
    });

    it('should handle database errors', async () => {
      mockQuery.mockImplementation((text, callback) => {
        callback(new Error('Database error'), null);
      });

      const res = await request(app).get('/bundles');
      expect(res.statusCode).toEqual(502);
    });
  });

  describe('GET /bundles/:id', () => {
    it('should return a bundle by ID', async () => {
      const mockBundle = { bundleId: 1, content: 'Bundle 1' };
      
      mockQuery.mockImplementation((text, params, callback) => {
        callback(null, { rows: [mockBundle] });
      });

      const res = await request(app).get('/bundles/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockBundle);
    });

    it('should return 204 if bundle not found', async () => {
      mockQuery.mockImplementation((text, params, callback) => {
        callback(null, { rows: [] });
      });

      const res = await request(app).get('/bundles/999');
      expect(res.statusCode).toEqual(204);
    });
  });
});
