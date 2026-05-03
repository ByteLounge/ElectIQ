import axios from 'axios';
import logger from '../utils/logger.js';

const SEARCH_API_URL = 'https://www.googleapis.com/customsearch/v1';
const API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
const CX = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

/**
 * Searches for recent, factual election news using Google Custom Search API.
 * Restricts search to authoritative domains.
 * @param {string} query - The search query.
 * @param {string} [country=''] - Optional country to restrict news.
 * @param {string} [dateRestrict='d7'] - Date restriction (e.g., 'd7' for last 7 days).
 * @returns {Promise<Object[]>} - List of search results.
 */
export const searchElectionNews = async (query, country = '', dateRestrict = 'd7') => {
  try {
    const siteSearch = country === 'IN' ? 'eci.gov.in' : 
                       country === 'CA' ? 'elections.ca' :
                       country === 'GB' ? 'electoral-reform.org.uk' :
                       '.gov';
                       
    const response = await axios.get(SEARCH_API_URL, {
      params: {
        key: API_KEY,
        cx: CX,
        q: query,
        dateRestrict,
        siteSearch,
        num: 5
      }
    });

    return (response.data.items || []).map(item => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link
    }));
  } catch (error) {
    logger.error(`Error searching election news for ${query}:`, error.message);
    return [];
  }
};
