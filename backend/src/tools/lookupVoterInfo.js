import { lookupVoterInfo as civicLookup } from '../services/civicService.js';

/**
 * Tool for looking up voter registration status, polling locations, and ballot information.
 * @param {string} address - Full street address.
 * @param {string} electionDay - Election date in YYYY-MM-DD format.
 * @returns {Promise<Object>} - The structured voter info.
 */
export const lookup_voter_info = async ({ address, electionDay }) => {
  try {
    const data = await civicLookup(address);
    // Process and simplify data for the AI model
    return {
      election: data.election,
      pollingLocations: data.pollingLocations || [],
      contests: data.contests || [],
      state: data.state || [],
      voterRegistrationLink: data.state?.[0]?.electionAdministrationBody?.electionRegistrationUrl || 'N/A'
    };
  } catch (error) {
    return { error: 'Failed to retrieve voter info. Please check the address or try again later.' };
  }
};
