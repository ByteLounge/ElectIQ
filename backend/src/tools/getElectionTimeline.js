/**
 * Returns the key phases and dates of an election process for a given country and election type.
 * @param {string} country - ISO 3166-1 alpha-2 country code (e.g., US, IN, GB).
 * @param {string} electionType - Type of election (general, presidential, local, state, primary).
 * @param {number} year - Election year.
 * @returns {Promise<Object>} - The structured election timeline.
 */
export const get_election_timeline = async ({ country, electionType, year }) => {
  const defaultPhases = [
    { name: "Announcement", description: "Official announcement of the election date and process.", typicalDuration: "1-2 weeks", keyActions: ["Publication of the gazette", "Setting key dates"], officialLinks: [] },
    { name: "Voter Registration", description: "Period for eligible citizens to register to vote or update details.", typicalDuration: "4-8 weeks", keyActions: ["Submitting registration forms", "Verification of voter lists"], officialLinks: [] },
    { name: "Candidate Nomination", description: "Filing of nominations by candidates and political parties.", typicalDuration: "2-3 weeks", keyActions: ["Scrutiny of nominations", "Withdrawal period"], officialLinks: [] },
    { name: "Campaigning", description: "Official period for candidates to reach out to voters.", typicalDuration: "4-12 weeks", keyActions: ["Rallies", "Debates", "Media advertisements"], officialLinks: [] },
    { name: "Election Day", description: "The day when voting takes place.", typicalDuration: "1 day", keyActions: ["Casting of ballots", "Monitoring by observers"], officialLinks: [] },
    { name: "Vote Counting", description: "Counting and tabulation of ballots.", typicalDuration: "1-5 days", keyActions: ["Verification of ballot boxes", "Tallying results"], officialLinks: [] },
    { name: "Results", description: "Declaration of official winners.", typicalDuration: "1-2 days", keyActions: ["Announcement of winners", "Issuing certificates of election"], officialLinks: [] },
    { name: "Certification", description: "Formal legal certification of the election results.", typicalDuration: "1-4 weeks", keyActions: ["Dispute resolution", "Final audit"], officialLinks: [] }
  ];

  const specificTimelines = {
    US: {
      country: "United States",
      phases: defaultPhases.map(p => {
        if (p.name === "Voter Registration") return { ...p, keyActions: [...p.keyActions, "Online registration", "Mail-in registration"] };
        return p;
      })
    },
    IN: {
      country: "India",
      phases: defaultPhases.map(p => {
        if (p.name === "Election Day") return { ...p, typicalDuration: "Multiple phases over weeks", description: "Voting occurs in multiple phases across different states." };
        return p;
      })
    },
    GB: {
      country: "United Kingdom",
      phases: defaultPhases.map(p => {
        if (p.name === "Announcement") return { ...p, description: "Dissolution of Parliament and issuance of the writ." };
        return p;
      })
    }
  };

  return specificTimelines[country] || { country: "Generic", phases: defaultPhases };
};
