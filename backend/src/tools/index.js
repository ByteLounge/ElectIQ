import { get_election_timeline } from './getElectionTimeline.js';
import { lookup_voter_info } from './lookupVoterInfo.js';
import { search_election_news } from './searchElectionNews.js';
import { get_election_officials } from './getElectionOfficials.js';

export const toolRegistry = {
  get_election_timeline,
  lookup_voter_info,
  search_election_news,
  get_election_officials
};

export const toolDefinitions = [
  {
    name: 'get_election_timeline',
    description: 'Returns the key phases and dates of an election process for a given country and election type',
    parameters: {
      type: 'OBJECT',
      properties: {
        country: { type: 'STRING', description: 'ISO 3166-1 alpha-2 country code, e.g. US, IN, GB' },
        electionType: { type: 'STRING', enum: ['general', 'presidential', 'local', 'state', 'primary'], description: 'Type of election' },
        year: { type: 'NUMBER', description: 'Election year' }
      },
      required: ['country', 'electionType']
    }
  },
  {
    name: 'lookup_voter_info',
    description: 'Looks up voter registration status, polling locations, and ballot information for a US address',
    parameters: {
      type: 'OBJECT',
      properties: {
        address: { type: 'STRING', description: 'Full street address including city and state' },
        electionDay: { type: 'STRING', description: 'Election date in YYYY-MM-DD format' }
      },
      required: ['address']
    }
  },
  {
    name: 'search_election_news',
    description: 'Searches for recent, factual election news and official announcements',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING' },
        country: { type: 'STRING' },
        dateRestrict: { type: 'STRING', description: 'e.g. d7 for last 7 days' }
      },
      required: ['query']
    }
  },
  {
    name: 'get_election_officials',
    description: 'Returns elected officials and their roles for a given address using Google Civic Information API',
    parameters: {
      type: 'OBJECT',
      properties: {
        address: { type: 'STRING' },
        roles: { type: 'ARRAY', items: { type: 'STRING' }, description: "e.g. ['legislatorUpperBody','legislatorLowerBody']" }
      },
      required: ['address']
    }
  }
];
