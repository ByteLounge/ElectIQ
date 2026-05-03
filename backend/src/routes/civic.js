import express from 'express';
import { lookupVoterInfo, lookupRepresentatives } from '../services/civicService.js';
import { apiRateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

/**
 * @api {get} /api/civic/voter-info Get voter info
 */
router.get('/voter-info', apiRateLimit, async (req, res, next) => {
  try {
    const { address, electionId } = req.query;
    if (!address) return res.status(400).json({ error: 'Address is required.' });
    
    const data = await lookupVoterInfo(address, electionId);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {get} /api/civic/representatives Get representatives info
 */
router.get('/representatives', apiRateLimit, async (req, res, next) => {
  try {
    const { address, roles } = req.query;
    if (!address) return res.status(400).json({ error: 'Address is required.' });
    
    const rolesList = roles ? roles.split(',') : [];
    const data = await lookupRepresentatives(address, rolesList);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
