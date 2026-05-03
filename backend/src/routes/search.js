import express from 'express';
import { searchElectionNews } from '../services/searchService.js';
import { apiRateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

/**
 * @api {get} /api/search Proxy to Google Custom Search
 */
router.get('/', apiRateLimit, async (req, res, next) => {
  try {
    const { q, country, dateRestrict } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query (q) is required.' });
    }

    const results = await searchElectionNews(q, country, dateRestrict);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

export default router;
