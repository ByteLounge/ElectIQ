import express from 'express';
import { chat } from '../services/geminiService.js';
import { chatRateLimit } from '../middleware/rateLimit.js';
import { sanitizeInput } from '../utils/sanitize.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @api {post} /api/chat Handle user chat messages
 */
router.post('/', chatRateLimit, async (req, res, next) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message are required.' });
    }

    const sanitizedMessage = sanitizeInput(message);
    if (!sanitizedMessage) {
      return res.status(400).json({ error: 'Message is empty or invalid after sanitization.' });
    }

    const response = await chat(sessionId, sanitizedMessage);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
