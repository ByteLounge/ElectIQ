import { searchElectionNews as googleSearch } from '../services/searchService.js';

/**
 * Tool for searching recent, factual election news.
 * @param {string} query - The search query.
 * @param {string} [country] - Optional country code.
 * @param {string} [dateRestrict] - e.g. 'd7' for last 7 days.
 * @returns {Promise<Object[]>} - List of search results.
 */
export const search_election_news = async ({ query, country, dateRestrict }) => {
  return await googleSearch(query, country, dateRestrict);
};
