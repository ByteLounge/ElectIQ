import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';

describe('Timeline API', () => {
  const apiKey = 'test-api-key';
  process.env.CLIENT_API_KEY = apiKey;

  it('GET /api/timeline - US general election returns phases', async () => {
    const res = await request(app)
      .get('/api/timeline')
      .set('x-api-key', apiKey)
      .query({ country: 'US', type: 'general' });

    expect(res.status).toBe(200);
    expect(res.body.country).toBe('United States');
    expect(res.body.phases.length).toBeGreaterThan(0);
  });

  it('GET /api/timeline - returns 400 for missing params', async () => {
    const res = await request(app)
      .get('/api/timeline')
      .set('x-api-key', apiKey)
      .query({ country: 'US' });

    expect(res.status).toBe(400);
  });
});
