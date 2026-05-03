import axios from 'axios';
import logger from '../utils/logger.js';

const CIVIC_API_URL = 'https://www.googleapis.com/civicinfo/v2';
const API_KEY = process.env.GOOGLE_CIVIC_API_KEY;

/**
 * Calls the Google Civic Information API voterinfo endpoint.
 * @param {string} address - Full street address.
 * @param {string} [electionId] - The election ID, if known.
 * @returns {Promise<Object>} - The voter info data.
 */
export const lookupVoterInfo = async (address, electionId = '') => {
  try {
    const response = await axios.get(`${CIVIC_API_URL}/voterinfo`, {
      params: {
        key: API_KEY,
        address,
        electionId
      }
    });
    return response.data;
  } catch (error) {
    logger.error(`Error fetching voter info for ${address}:`, error.message);
    throw new Error('Failed to fetch voter information from Civic API.');
  }
};

/**
 * Calls the Google Civic Information API representatives endpoint.
 * @param {string} address - Full street address.
 * @param {string[]} [roles] - List of roles to include.
 * @returns {Promise<Object>} - The representatives data.
 */
export const lookupRepresentatives = async (address, roles = []) => {
  try {
    const params = {
      key: API_KEY,
      address
    };
    if (roles.length > 0) {
      params.roles = roles.join(',');
    }
    const response = await axios.get(`${CIVIC_API_URL}/representatives`, { params });
    return response.data;
  } catch (error) {
    logger.error(`Error fetching representatives for ${address}:`, error.message);
    throw new Error('Failed to fetch representative information from Civic API.');
  }
};
