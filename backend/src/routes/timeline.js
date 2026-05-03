import express from 'express';
import { get_election_timeline } from '../tools/getElectionTimeline.js';
import { apiRateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

/**
 * @api {get} /api/timeline Get election timeline
 */
router.get('/', apiRateLimit, async (req, res, next) => {
  try {
    const { country, type, year } = req.query;

    if (!country || !type) {
      return res.status(400).json({ error: 'Country and type are required parameters.' });
    }

    const timeline = await get_election_timeline({ 
      country: country.toUpperCase(), 
      electionType: type, 
      year: parseInt(year) || new Date().getFullYear() 
    });
    res.json(timeline);
  } catch (error) {
    next(error);
  }
});

export default router;
