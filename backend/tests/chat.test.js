import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';
import * as geminiService from '../src/services/geminiService.js';

vi.mock('../src/services/geminiService.js');

describe('Chat API', () => {
  const apiKey = 'test-api-key';
  process.env.CLIENT_API_KEY = apiKey;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/chat - returns 200 and chat response', async () => {
    const mockResponse = { text: 'Hello citizen!', toolsUsed: [] };
    geminiService.chat.mockResolvedValue(mockResponse);

    const res = await request(app)
      .post('/api/chat')
      .set('x-api-key', apiKey)
      .send({ sessionId: '123', message: 'Hi' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResponse);
  });

  it('POST /api/chat - returns 400 for empty message', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('x-api-key', apiKey)
      .send({ sessionId: '123', message: '' });

    expect(res.status).toBe(400);
  });

  it('POST /api/chat - returns 401 for invalid API key', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('x-api-key', 'wrong-key')
      .send({ sessionId: '123', message: 'Hi' });

    expect(res.status).toBe(401);
  });
});
