import { lookupRepresentatives } from '../services/civicService.js';

/**
 * Returns elected officials and their roles for a given address.
 * @param {string} address - Full street address.
 * @param {string[]} roles - Optional filter for roles.
 * @returns {Promise<Object>} - The structured representatives info.
 */
export const get_election_officials = async ({ address, roles }) => {
  try {
    const data = await lookupRepresentatives(address, roles);
    return {
      offices: data.offices || [],
      officials: data.officials || []
    };
  } catch (error) {
    return { error: 'Failed to retrieve representative information. Please check the address.' };
  }
};
