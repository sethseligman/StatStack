export interface DefensivePlayer {
  name: string;
  sacks: number;
  teams: string[];
  isHOF: boolean;
  nicknames?: string[];
}

// Nickname mappings for defensive players
const DEFENSIVE_NICKNAMES: Record<string, string> = {
  "Mean Joe": "Joe Greene",
  "Too Tall": "Too Tall Jones",
  "Minister of Defense": "Reggie White",
  "LT": "Lawrence Taylor",
  "The Freak": "Jevon Kearse",
  "Sack Master": "Deacon Jones",
  "Dr. Sack": "Harvey Martin",
  "The Beast": "Bruce Smith",
  "Doomsday": "Bob Lilly",
  "The Secretary of Defense": "Kenny Easley"
};

// Team name mappings for consistency
export const TEAM_MAPPINGS: Record<string, string> = {
  "buf": "Buffalo Bills",
  "mia": "Miami Dolphins",
  "nwe": "New England Patriots",
  "nyj": "New York Jets",
  "rav": "Baltimore Ravens",
  "cin": "Cincinnati Bengals",
  "cle": "Cleveland Browns",
  "pit": "Pittsburgh Steelers",
  "oti": "Tennessee Titans",
  "ind": "Indianapolis Colts",
  "jax": "Jacksonville Jaguars",
  "hou": "Houston Texans",
  "den": "Denver Broncos",
  "kan": "Kansas City Chiefs",
  "rai": "Las Vegas Raiders",
  "sdg": "Los Angeles Chargers",
  "dal": "Dallas Cowboys",
  "nyg": "New York Giants",
  "phi": "Philadelphia Eagles",
  "was": "Washington Commanders",
  "chi": "Chicago Bears",
  "det": "Detroit Lions",
  "gnb": "Green Bay Packers",
  "min": "Minnesota Vikings",
  "atl": "Atlanta Falcons",
  "car": "Carolina Panthers",
  "nor": "New Orleans Saints",
  "tam": "Tampa Bay Buccaneers",
  "crd": "Arizona Cardinals",
  "ram": "Los Angeles Rams",
  "sfo": "San Francisco 49ers",
  "sea": "Seattle Seahawks",
  "clt": "Baltimore Colts",
  "oak": "Oakland Raiders",
  "stl": "St. Louis Cardinals",
  "bos": "Boston Patriots",
  "pho": "Phoenix Cardinals"
};

// Helper function to convert abbreviated team names to full names
export const getFullTeamName = (abbr: string): string => {
  return TEAM_MAPPINGS[abbr.toLowerCase()] || abbr;
};

// Function to calculate string similarity (Levenshtein distance)
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}

// Function to find closest match
export function findClosestDefensiveMatch(input: string, threshold: number = 3): string | null {
  const normalizedInput = input.toLowerCase().trim();
  
  // Check nicknames first (case-insensitive)
  const nicknameMatch = Object.entries(DEFENSIVE_NICKNAMES).find(([nickname]) => 
    nickname.toLowerCase() === normalizedInput
  );
  if (nicknameMatch) return nicknameMatch[1];
  
  // Check exact matches (case-insensitive)
  const exactMatch = Object.keys(defensiveDatabase).find(name => 
    name.toLowerCase() === normalizedInput
  );
  if (exactMatch) return exactMatch;
  
  // Check for last name matches (case-insensitive)
  const lastNameMatch = Object.entries(defensiveDatabase).find(([fullName]) => {
    const lastName = fullName.split(' ').pop()?.toLowerCase();
    return lastName === normalizedInput;
  });
  if (lastNameMatch) return lastNameMatch[0];
  
  // Check for close matches using Levenshtein distance
  let closestMatch: string | null = null;
  let minDistance = threshold;
  
  for (const playerName of Object.keys(defensiveDatabase)) {
    const distance = levenshteinDistance(normalizedInput, playerName.toLowerCase());
    if (distance < minDistance) {
      minDistance = distance;
      closestMatch = playerName;
    }
  }
  
  return closestMatch;
}

// Helper function to validate if a player exists and played for a team
export const validateDefensivePlayer = (input: string, team: string, usedPlayers: string[]): { name: string; statValue: number; displayName: string; } | null => {
  // Try to find the closest match first
  const matchedName = findClosestDefensiveMatch(input);
  if (!matchedName) return null;

  const player = defensiveDatabase[matchedName];
  const normalizedTeam = team.toLowerCase();

  if (!player || !player.teams.includes(normalizedTeam) || usedPlayers.includes(matchedName)) {
    return null;
  }

  return {
    name: player.name,
    statValue: player.sacks,
    displayName: formatDefensiveDisplayName(player)
  };
};

// Helper function to format player display name
export const formatDefensiveDisplayName = (player: DefensivePlayer): string => {
  return `${player.name}${player.isHOF ? ' 🏆' : ''}`;
};

// Helper function to get special effect trigger
export const getDefensiveSpecialEffectTrigger = (playerName: string): boolean => {
  const player = defensiveDatabase[playerName];
  return player?.isHOF || false;
};

// Helper function to find highest sack player for a team
export function findHighestSackPlayer(team: string | null, usedPlayers: string[]): DefensivePlayer | null {
  if (!team) return null;

  const normalizedTeam = team.toLowerCase();
  let highestSackPlayer: DefensivePlayer | null = null;
  let highestSacks = -1;

  Object.values(defensiveDatabase).forEach(player => {
    if (
      player.teams.includes(normalizedTeam) &&
      !usedPlayers.includes(player.name) &&
      player.sacks > highestSacks
    ) {
      highestSacks = player.sacks;
      highestSackPlayer = player;
    }
  });

  return highestSackPlayer;
}

export const defensiveDatabase: Record<string, DefensivePlayer> = {
  // 200+ Sacks
  "Bruce Smith": {
    name: "Bruce Smith",
    sacks: 200,
    teams: ["Buffalo Bills", "Washington Commanders"],
    isHOF: true
  },

  // 190-199 Sacks
  "Reggie White": {
    name: "Reggie White",
    sacks: 198,
    teams: ["Philadelphia Eagles", "Green Bay Packers", "Carolina Panthers"],
    isHOF: true
  },

  // 170-179 Sacks
  "Deacon Jones": {
    name: "Deacon Jones",
    sacks: 173.5,
    teams: ["Los Angeles Rams", "Los Angeles Chargers", "Washington Commanders"],
    isHOF: true
  },

  // 160-169 Sacks
  "Kevin Greene": {
    name: "Kevin Greene",
    sacks: 160,
    teams: ["Los Angeles Rams", "Pittsburgh Steelers", "Carolina Panthers", "San Francisco 49ers"],
    isHOF: true
  },

  // 150-159 Sacks
  "Julius Peppers": {
    name: "Julius Peppers",
    sacks: 159.5,
    teams: ["Carolina Panthers", "Chicago Bears", "Green Bay Packers"],
    isHOF: true
  },
  "Jack Youngblood": {
    name: "Jack Youngblood",
    sacks: 151.5,
    teams: ["Los Angeles Rams"],
    isHOF: true
  },

  // 140-149 Sacks
  "Chris Doleman": {
    name: "Chris Doleman",
    sacks: 150.5,
    teams: ["Minnesota Vikings", "Atlanta Falcons", "San Francisco 49ers"],
    isHOF: true
  },
  "Alan Page": {
    name: "Alan Page",
    sacks: 148.5,
    teams: ["Minnesota Vikings", "Chicago Bears"],
    isHOF: true
  },
  "Lawrence Taylor": {
    name: "Lawrence Taylor",
    sacks: 142,
    teams: ["New York Giants"],
    isHOF: true
  },

  // 130-139 Sacks
  "Michael Strahan": {
    name: "Michael Strahan",
    sacks: 141.5,
    teams: ["New York Giants"],
    isHOF: true
  },
  "Jason Taylor": {
    name: "Jason Taylor",
    sacks: 139.5,
    teams: ["Miami Dolphins", "Washington Commanders", "New York Jets"],
    isHOF: true
  },
  "Terrell Suggs": {
    name: "Terrell Suggs",
    sacks: 139,
    teams: ["Baltimore Ravens", "Arizona Cardinals", "Kansas City Chiefs"],
    isHOF: false
  },
  "DeMarcus Ware": {
    name: "DeMarcus Ware",
    sacks: 138.5,
    teams: ["Dallas Cowboys", "Denver Broncos"],
    isHOF: true
  },

  // 120-129 Sacks
  "Richard Dent": {
    name: "Richard Dent",
    sacks: 137.5,
    teams: ["Chicago Bears", "San Francisco 49ers", "Indianapolis Colts", "Philadelphia Eagles"],
    isHOF: true
  },
  "John Randle": {
    name: "John Randle",
    sacks: 137.5,
    teams: ["Minnesota Vikings", "Seattle Seahawks"],
    isHOF: true
  },
  "Jared Allen": {
    name: "Jared Allen",
    sacks: 136,
    teams: ["Kansas City Chiefs", "Minnesota Vikings", "Chicago Bears", "Carolina Panthers"],
    isHOF: true
  },
  "Rickey Jackson": {
    name: "Rickey Jackson",
    sacks: 136,
    teams: ["New Orleans Saints", "San Francisco 49ers"],
    isHOF: true
  },
  "John Abraham": {
    name: "John Abraham",
    sacks: 133.5,
    teams: ["New York Jets", "Atlanta Falcons", "Arizona Cardinals"],
    isHOF: false
  },
  "Carl Eller": {
    name: "Carl Eller",
    sacks: 133.5,
    teams: ["Minnesota Vikings", "Seattle Seahawks"],
    isHOF: true
  },
  "Leslie O'Neal": {
    name: "Leslie O'Neal",
    sacks: 132.5,
    teams: ["Los Angeles Chargers", "Los Angeles Rams", "Kansas City Chiefs"],
    isHOF: false
  },
  "Al Baker": {
    name: "Al Baker",
    sacks: 131,
    teams: ["Detroit Lions", "St. Louis Rams", "Cleveland Browns", "Minnesota Vikings"],
    isHOF: false
  },
  "Coy Bacon": {
    name: "Coy Bacon",
    sacks: 130.5,
    teams: ["Los Angeles Rams", "Los Angeles Chargers", "Cincinnati Bengals", "Washington Commanders"],
    isHOF: false
  },
  "Jim Marshall": {
    name: "Jim Marshall",
    sacks: 130.5,
    teams: ["Cleveland Browns", "Minnesota Vikings"],
    isHOF: false
  },
  "Claude Humphrey": {
    name: "Claude Humphrey",
    sacks: 130,
    teams: ["Atlanta Falcons", "Philadelphia Eagles"],
    isHOF: true
  },
  "Von Miller": {
    name: "Von Miller",
    sacks: 129.5,
    teams: ["Denver Broncos", "Los Angeles Rams", "Buffalo Bills"],
    isHOF: false
  },
  "Derrick Thomas": {
    name: "Derrick Thomas",
    sacks: 126.5,
    teams: ["Kansas City Chiefs"],
    isHOF: true
  },
  "Dwight Freeney": {
    name: "Dwight Freeney",
    sacks: 125.5,
    teams: ["Indianapolis Colts", "Los Angeles Chargers", "Arizona Cardinals", "Atlanta Falcons", "Detroit Lions", "Seattle Seahawks"],
    isHOF: true
  },
  "Robert Mathis": {
    name: "Robert Mathis",
    sacks: 123,
    teams: ["Indianapolis Colts"],
    isHOF: false
  },
  "Cedrick Hardman": {
    name: "Cedrick Hardman",
    sacks: 122.5,
    teams: ["San Francisco 49ers", "Oakland Raiders"],
    isHOF: false
  },
  "Simeon Rice": {
    name: "Simeon Rice",
    sacks: 122,
    teams: ["Arizona Cardinals", "Tampa Bay Buccaneers", "Denver Broncos", "Indianapolis Colts"],
    isHOF: false
  },
  "Cameron Jordan": {
    name: "Cameron Jordan",
    sacks: 121.5,
    teams: ["New Orleans Saints"],
    isHOF: false
  },
  "Clyde Simmons": {
    name: "Clyde Simmons",
    sacks: 121.5,
    teams: ["Philadelphia Eagles", "Arizona Cardinals", "Jacksonville Jaguars", "Cincinnati Bengals", "Chicago Bears"],
    isHOF: false
  },
  "Jacob Green": {
    name: "Jacob Green",
    sacks: 115.5,
    teams: ["Seattle Seahawks", "San Francisco 49ers"],
    isHOF: false
  },
  "J.J. Watt": {
    name: "J.J. Watt",
    sacks: 114.5,
    teams: ["Houston Texans", "Arizona Cardinals"],
    isHOF: false
  },
  "Harvey Martin": {
    name: "Harvey Martin",
    sacks: 114,
    teams: ["Dallas Cowboys"],
    isHOF: false
  },
  "Sean Jones": {
    name: "Sean Jones",
    sacks: 113,
    teams: ["Las Vegas Raiders", "Houston Texans", "Green Bay Packers"],
    isHOF: false
  },
  "Lyle Alzado": {
    name: "Lyle Alzado",
    sacks: 112,
    teams: ["Denver Broncos", "Cleveland Browns", "Las Vegas Raiders"],
    isHOF: false
  },
  "Justin Houston": {
    name: "Justin Houston",
    sacks: 112,
    teams: ["Kansas City Chiefs", "Indianapolis Colts", "Baltimore Ravens", "Carolina Panthers", "Pittsburgh Steelers"],
    isHOF: false
  },
  "Chandler Jones": {
    name: "Chandler Jones",
    sacks: 112,
    teams: ["New England Patriots", "Arizona Cardinals", "Las Vegas Raiders"],
    isHOF: false
  },
  "Aaron Donald": {
    name: "Aaron Donald",
    sacks: 111,
    teams: ["Los Angeles Rams"],
    isHOF: false
  },
  "Randy White": {
    name: "Randy White",
    sacks: 111,
    teams: ["Dallas Cowboys"],
    isHOF: true
  },
  "Calais Campbell": {
    name: "Calais Campbell",
    sacks: 110.5,
    teams: ["Arizona Cardinals", "Jacksonville Jaguars", "Baltimore Ravens", "Atlanta Falcons", "Detroit Lions"],
    isHOF: false
  },
  "Greg Townsend": {
    name: "Greg Townsend",
    sacks: 109.5,
    teams: ["Las Vegas Raiders", "Philadelphia Eagles"],
    isHOF: false
  },
  "T.J. Watt": {
    name: "T.J. Watt",
    sacks: 108,
    teams: ["Pittsburgh Steelers"],
    isHOF: false
  },
  "Mark Gastineau": {
    name: "Mark Gastineau",
    sacks: 107.5,
    teams: ["New York Jets"],
    isHOF: false
  },
  "Khalil Mack": {
    name: "Khalil Mack",
    sacks: 107.5,
    teams: ["Las Vegas Raiders", "Chicago Bears", "Los Angeles Chargers"],
    isHOF: false
  },
  "Pat Swilling": {
    name: "Pat Swilling",
    sacks: 107.5,
    teams: ["New Orleans Saints", "Detroit Lions", "Oakland Raiders"],
    isHOF: false
  },
  "Trace Armstrong": {
    name: "Trace Armstrong",
    sacks: 106,
    teams: ["Chicago Bears", "Miami Dolphins", "Oakland Raiders"],
    isHOF: false
  },
  "Jack Gregory": {
    name: "Jack Gregory",
    sacks: 106,
    teams: ["Cleveland Browns", "New York Giants"],
    isHOF: false
  },
  "Too Tall Jones": {
    name: "Too Tall Jones",
    sacks: 106,
    teams: ["Dallas Cowboys"],
    isHOF: false
  },
  "Elvis Dumervil": {
    name: "Elvis Dumervil",
    sacks: 105.5,
    teams: ["Denver Broncos", "Los Angeles Rams", "San Francisco 49ers"],
    isHOF: false
  },
  "Elvin Bethea": {
    name: "Elvin Bethea",
    sacks: 105,
    teams: ["Tennessee Titans"],
    isHOF: true
  },
  "Kevin Carter": {
    name: "Kevin Carter",
    sacks: 104.5,
    teams: ["Los Angeles Rams", "Tennessee Titans", "Miami Dolphins", "Tampa Bay Buccaneers"],
    isHOF: false
  },
  "Neil Smith": {
    name: "Neil Smith",
    sacks: 104.5,
    teams: ["Kansas City Chiefs", "Denver Broncos", "Los Angeles Chargers"],
    isHOF: false
  },
  "Dexter Manley": {
    name: "Dexter Manley",
    sacks: 103.5,
    teams: ["Washington Commanders", "Philadelphia Eagles", "Tampa Bay Buccaneers"],
    isHOF: false
  },
  "Fred Dryer": {
    name: "Fred Dryer",
    sacks: 103,
    teams: ["New York Giants", "Los Angeles Rams"],
    isHOF: false
  },
  "Tony McGee": {
    name: "Tony McGee",
    sacks: 103,
    teams: ["Chicago Bears", "New England Patriots", "Washington Commanders"],
    isHOF: false
  },
  "Myles Garrett": {
    name: "Myles Garrett",
    sacks: 102.5,
    teams: ["Cleveland Browns"],
    isHOF: false
  },
  "Jim Jeffcoat": {
    name: "Jim Jeffcoat",
    sacks: 102.5,
    teams: ["Dallas Cowboys", "Buffalo Bills"],
    isHOF: false
  },
  "Robert Quinn": {
    name: "Robert Quinn",
    sacks: 102,
    teams: ["Los Angeles Rams", "Miami Dolphins", "Dallas Cowboys", "Chicago Bears", "Philadelphia Eagles"],
    isHOF: false
  },
  "William Fuller": {
    name: "William Fuller",
    sacks: 100.5,
    teams: ["Tennessee Titans", "Philadelphia Eagles", "Los Angeles Chargers"],
    isHOF: false
  },
  "Charles Haley": {
    name: "Charles Haley",
    sacks: 100.5,
    teams: ["San Francisco 49ers", "Dallas Cowboys"],
    isHOF: true
  },
  "Cameron Wake": {
    name: "Cameron Wake",
    sacks: 100.5,
    teams: ["Miami Dolphins", "Tennessee Titans"],
    isHOF: false
  },
  "Carlos Dunlap": {
    name: "Carlos Dunlap",
    sacks: 100,
    teams: ["Cincinnati Bengals", "Seattle Seahawks", "Kansas City Chiefs"],
    isHOF: false
  },
  "Alex Karras": {
    name: "Alex Karras",
    sacks: 100,
    teams: ["Detroit Lions"],
    isHOF: true
  },
  "Andre Tippett": {
    name: "Andre Tippett",
    sacks: 100,
    teams: ["New England Patriots"],
    isHOF: true
  },
  "Willie Davis": {
    name: "Willie Davis",
    sacks: 99.5,
    teams: ["Cleveland Browns", "Green Bay Packers"],
    isHOF: true
  },
  "Danielle Hunter": {
    name: "Danielle Hunter",
    sacks: 99.5,
    teams: ["Minnesota Vikings", "New Orleans Saints"],
    isHOF: false
  },
  "George Andrie": {
    name: "George Andrie",
    sacks: 98.5,
    teams: ["Dallas Cowboys"],
    isHOF: false
  },
  "Joey Porter": {
    name: "Joey Porter",
    sacks: 98,
    teams: ["Pittsburgh Steelers", "Miami Dolphins", "Arizona Cardinals"],
    isHOF: false
  },
  "Simon Fletcher": {
    name: "Simon Fletcher",
    sacks: 97.5,
    teams: ["Denver Broncos"],
    isHOF: false
  },
  "Mario Williams": {
    name: "Mario Williams",
    sacks: 97.5,
    teams: ["Houston Texans", "Buffalo Bills", "Miami Dolphins"],
    isHOF: false
  },
  "Jethro Pugh": {
    name: "Jethro Pugh",
    sacks: 96.5,
    teams: ["Dallas Cowboys"],
    isHOF: false
  },
  "Warren Sapp": {
    name: "Warren Sapp",
    sacks: 96.5,
    teams: ["Tampa Bay Buccaneers", "Oakland Raiders"],
    isHOF: true
  },
  "Carl Hairston": {
    name: "Carl Hairston",
    sacks: 96,
    teams: ["Philadelphia Eagles", "Cleveland Browns", "Philadelphia Eagles"],
    isHOF: false
  },
  "Ezra Johnson": {
    name: "Ezra Johnson",
    sacks: 96,
    teams: ["Green Bay Packers", "Indianapolis Colts", "Tennessee Titans"],
    isHOF: false
  },
  "George Martin": {
    name: "George Martin",
    sacks: 96,
    teams: ["New York Giants"],
    isHOF: false
  },
  "Ryan Kerrigan": {
    name: "Ryan Kerrigan",
    sacks: 95.5,
    teams: ["Washington Commanders", "Philadelphia Eagles"],
    isHOF: false
  },
  "Bob Lilly": {
    name: "Bob Lilly",
    sacks: 95.5,
    teams: ["Dallas Cowboys"],
    isHOF: true
  },
  "Robert Porcher": {
    name: "Robert Porcher",
    sacks: 95.5,
    teams: ["Detroit Lions"],
    isHOF: false
  },
  "Steve McMichael": {
    name: "Steve McMichael",
    sacks: 95,
    teams: ["New England Patriots", "Chicago Bears", "Green Bay Packers"],
    isHOF: true
  },
  "Doug Atkins": {
    name: "Doug Atkins",
    sacks: 94.5,
    teams: ["Cleveland Browns", "Chicago Bears", "New Orleans Saints"],
    isHOF: true
  },
  "Jason Pierre-Paul": {
    name: "Jason Pierre-Paul",
    sacks: 94.5,
    teams: ["New York Giants", "Tampa Bay Buccaneers", "Baltimore Ravens", "New Orleans Saints", "Denver Broncos"],
    isHOF: false
  },
  "Henry Thomas": {
    name: "Henry Thomas",
    sacks: 93.5,
    teams: ["Minnesota Vikings", "Detroit Lions", "New England Patriots"],
    isHOF: false
  },
  "Fred Dean": {
    name: "Fred Dean",
    sacks: 92,
    teams: ["Los Angeles Chargers", "San Francisco 49ers"],
    isHOF: true
  },
  "Jim Katcavage": {
    name: "Jim Katcavage",
    sacks: 91.5,
    teams: ["New York Giants"],
    isHOF: false
  },
  "Howie Long": {
    name: "Howie Long",
    sacks: 91.5,
    teams: ["Las Vegas Raiders"],
    isHOF: true
  },
  "Clay Matthews III": {
    name: "Clay Matthews III",
    sacks: 91.5,
    teams: ["Green Bay Packers", "Los Angeles Rams"],
    isHOF: false
  },
  "Merlin Olsen": {
    name: "Merlin Olsen",
    sacks: 91,
    teams: ["Los Angeles Rams"],
    isHOF: true
  },
  "Trevor Pryce": {
    name: "Trevor Pryce",
    sacks: 91,
    teams: ["Denver Broncos", "Baltimore Ravens", "New York Jets"],
    isHOF: false
  },
  "Verlon Biggs": {
    name: "Verlon Biggs",
    sacks: 90.5,
    teams: ["New York Jets", "Washington Commanders"],
    isHOF: false
  },
  "Trent Cole": {
    name: "Trent Cole",
    sacks: 90.5,
    teams: ["Philadelphia Eagles", "Indianapolis Colts"],
    isHOF: false
  },
  "Tamba Hali": {
    name: "Tamba Hali",
    sacks: 89.5,
    teams: ["Kansas City Chiefs"],
    isHOF: false
  },
  "Bryant Young": {
    name: "Bryant Young",
    sacks: 89.5,
    teams: ["San Francisco 49ers"],
    isHOF: true
  },
  "Ken Harvey": {
    name: "Ken Harvey",
    sacks: 89,
    teams: ["Philadelphia Eagles", "Washington Commanders"],
    isHOF: false
  },
  "Cameron Heyward": {
    name: "Cameron Heyward",
    sacks: 88.5,
    teams: ["Pittsburgh Steelers"],
    isHOF: false
  },
  "Leonard Little": {
    name: "Leonard Little",
    sacks: 87.5,
    teams: ["Los Angeles Rams"],
    isHOF: false
  },
  "Bill Glass": {
    name: "Bill Glass",
    sacks: 87,
    teams: ["Detroit Lions", "Cleveland Browns"],
    isHOF: false
  },
  "Justin Smith": {
    name: "Justin Smith",
    sacks: 87,
    teams: ["Cincinnati Bengals", "San Francisco 49ers"],
    isHOF: false
  },
  "Willie McGinest": {
    name: "Willie McGinest",
    sacks: 86,
    teams: ["New England Patriots", "Cleveland Browns"],
    isHOF: false
  },
  "Everson Griffen": {
    name: "Everson Griffen",
    sacks: 85.5,
    teams: ["Minnesota Vikings", "Detroit Lions", "Dallas Cowboys"],
    isHOF: false
  },
  "Osi Umenyiora": {
    name: "Osi Umenyiora",
    sacks: 85,
    teams: ["New York Giants", "Atlanta Falcons"],
    isHOF: false
  },
  "Eddie Edwards": {
    name: "Eddie Edwards",
    sacks: 84.5,
    teams: ["Cincinnati Bengals"],
    isHOF: false
  },
  "James Harrison": {
    name: "James Harrison",
    sacks: 84.5,
    teams: ["Pittsburgh Steelers", "Cincinnati Bengals", "New England Patriots"],
    isHOF: false
  },
  "Diron Talbert": {
    name: "Diron Talbert",
    sacks: 84.5,
    teams: ["Los Angeles Rams", "Washington Commanders"],
    isHOF: false
  },
  "Greg Ellis": {
    name: "Greg Ellis",
    sacks: 84,
    teams: ["Dallas Cowboys", "Oakland Raiders"],
    isHOF: false
  },
  "La'Roi Glover": {
    name: "La'Roi Glover",
    sacks: 83.5,
    teams: ["Oakland Raiders", "New Orleans Saints", "Dallas Cowboys", "Los Angeles Rams"],
    isHOF: false
  },
  "Leonard Marshall": {
    name: "Leonard Marshall",
    sacks: 83.5,
    teams: ["New York Giants", "New York Jets", "Washington Commanders"],
    isHOF: false
  },
  "Tommy Hart": {
    name: "Tommy Hart",
    sacks: 83,
    teams: ["San Francisco 49ers", "Chicago Bears", "New Orleans Saints"],
    isHOF: false
  },
  "Charles Mann": {
    name: "Charles Mann",
    sacks: 83,
    teams: ["Washington Commanders", "San Francisco 49ers"],
    isHOF: false
  },
  "Patrick Kerney": {
    name: "Patrick Kerney",
    sacks: 82.5,
    teams: ["Atlanta Falcons", "Seattle Seahawks"],
    isHOF: false
  },
  "Wayne Martin": {
    name: "Wayne Martin",
    sacks: 82.5,
    teams: ["New Orleans Saints"],
    isHOF: false
  },
  "Clay Matthews Jr.": {
    name: "Clay Matthews Jr.",
    sacks: 82.5,
    teams: ["Cleveland Browns", "Atlanta Falcons"],
    isHOF: false
  },
  "Lee Williams": {
    name: "Lee Williams",
    sacks: 82.5,
    teams: ["Los Angeles Chargers", "Tennessee Titans"],
    isHOF: false
  },
  "Dan Hampton": {
    name: "Dan Hampton",
    sacks: 82,
    teams: ["Chicago Bears"],
    isHOF: true
  },
  "Shaun Phillips": {
    name: "Shaun Phillips",
    sacks: 81.5,
    teams: ["Los Angeles Chargers", "Denver Broncos", "Tennessee Titans", "Indianapolis Colts"],
    isHOF: false
  },
  "Tim Harris": {
    name: "Tim Harris",
    sacks: 81,
    teams: ["Green Bay Packers", "San Francisco 49ers", "Philadelphia Eagles"],
    isHOF: false
  },
  "Jim Osborne": {
    name: "Jim Osborne",
    sacks: 81,
    teams: ["Chicago Bears"],
    isHOF: false
  },
  "Julius Adams": {
    name: "Julius Adams",
    sacks: 80.5,
    teams: ["New England Patriots"],
    isHOF: false
  },
  "Andre Carter": {
    name: "Andre Carter",
    sacks: 80.5,
    teams: ["San Francisco 49ers", "Washington Commanders", "New England Patriots", "Oakland Raiders"],
    isHOF: false
  },
  "Chris Jones": {
    name: "Chris Jones",
    sacks: 80.5,
    teams: ["Kansas City Chiefs"],
    isHOF: false
  },
  "Ordell Braase": {
    name: "Ordell Braase",
    sacks: 80,
    teams: ["Cleveland Browns"],
    isHOF: false
  },
  "Hugh Douglas": {
    name: "Hugh Douglas",
    sacks: 80,
    teams: ["New York Jets", "Philadelphia Eagles", "Jacksonville Jaguars"],
    isHOF: false
  },
  "Jason Gildon": {
    name: "Jason Gildon",
    sacks: 80,
    teams: ["Pittsburgh Steelers", "Jacksonville Jaguars"],
    isHOF: false
  },
  "Art Still": {
    name: "Art Still",
    sacks: 80,
    teams: ["Kansas City Chiefs", "Buffalo Bills"],
    isHOF: false
  },
  "Chad Brown": {
    name: "Chad Brown",
    sacks: 79,
    teams: ["Pittsburgh Steelers", "Seattle Seahawks", "New England Patriots"],
    isHOF: false
  },
  "Roger Brown": {
    name: "Roger Brown",
    sacks: 79,
    teams: ["Detroit Lions", "Los Angeles Rams"],
    isHOF: false
  },
  "Gary Jeter": {
    name: "Gary Jeter",
    sacks: 79,
    teams: ["New York Giants", "Los Angeles Rams", "New England Patriots"],
    isHOF: false
  },
  "Karl Mecklenburg": {
    name: "Karl Mecklenburg",
    sacks: 79,
    teams: ["Denver Broncos"],
    isHOF: false
  },
  "Lee Roy Selmon": {
    name: "Lee Roy Selmon",
    sacks: 78.5,
    teams: ["Tampa Bay Buccaneers"],
    isHOF: true
  },
  "L.C. Greenwood": {
    name: "L.C. Greenwood",
    sacks: 78,
    teams: ["Pittsburgh Steelers"],
    isHOF: false
  },
  "Joe Klecko": {
    name: "Joe Klecko",
    sacks: 78,
    teams: ["New York Jets", "Indianapolis Colts"],
    isHOF: true
  },
  "Aaron Schobel": {
    name: "Aaron Schobel",
    sacks: 78,
    teams: ["Buffalo Bills"],
    isHOF: false
  },
  "John Zook": {
    name: "John Zook",
    sacks: 78,
    teams: ["Atlanta Falcons", "St. Louis Rams", "Kansas City Chiefs", "New Orleans Saints"],
    isHOF: false
  },
  "Joe Greene": {
    name: "Joe Greene",
    sacks: 77.5,
    teams: ["Pittsburgh Steelers"],
    isHOF: true
  },
  "Ron McDole": {
    name: "Ron McDole",
    sacks: 77.5,
    teams: ["Buffalo Bills", "Washington Commanders"],
    isHOF: false
  },
  "Trey Hendrickson": {
    name: "Trey Hendrickson",
    sacks: 77,
    teams: ["New Orleans Saints", "Cincinnati Bengals"],
    isHOF: false
  },
  "Ray Childress": {
    name: "Ray Childress",
    sacks: 76.5,
    teams: ["Tennessee Titans", "Dallas Cowboys"],
    isHOF: false
  },
  "Brandon Graham": {
    name: "Brandon Graham",
    sacks: 76.5,
    teams: ["Philadelphia Eagles"],
    isHOF: false
  },
  "Gary Johnson": {
    name: "Gary Johnson",
    sacks: 76.5,
    teams: ["Los Angeles Chargers", "San Francisco 49ers"],
    isHOF: false
  },
  "Geno Atkins": {
    name: "Geno Atkins",
    sacks: 75.5,
    teams: ["Cincinnati Bengals"],
    isHOF: false
  },
  "Barney Chavous": {
    name: "Barney Chavous",
    sacks: 75,
    teams: ["Denver Broncos"],
    isHOF: false
  },
  "Bryce Paup": {
    name: "Bryce Paup",
    sacks: 75,
    teams: ["Green Bay Packers", "Buffalo Bills", "Jacksonville Jaguars", "Minnesota Vikings"],
    isHOF: false
  },
  "Larry Brooks": {
    name: "Larry Brooks",
    sacks: 74.5,
    teams: ["Los Angeles Rams"],
    isHOF: false
  },
  "Kabeer Gbaja-Biamila": {
    name: "Kabeer Gbaja-Biamila",
    sacks: 74.5,
    teams: ["Green Bay Packers"],
    isHOF: false
  },
  "Ike Lassiter": {
    name: "Ike Lassiter",
    sacks: 74.5,
    teams: ["Denver Broncos", "Boston Patriots", "Oakland Raiders"],
    isHOF: false
  },
  "Cliff Avril": {
    name: "Cliff Avril",
    sacks: 74,
    teams: ["Detroit Lions", "Seattle Seahawks"],
    isHOF: false
  },
  "Jevon Kearse": {
    name: "Jevon Kearse",
    sacks: 74,
    teams: ["Tennessee Titans", "Philadelphia Eagles"],
    isHOF: false
  },
  "Shaun Ellis": {
    name: "Shaun Ellis",
    sacks: 73.5,
    teams: ["New York Jets", "New England Patriots"],
    isHOF: false
  },
  "Rulon Jones": {
    name: "Rulon Jones",
    sacks: 73.5,
    teams: ["Denver Broncos"],
    isHOF: false
  },
  "Michael Sinclair": {
    name: "Michael Sinclair",
    sacks: 73.5,
    teams: ["Seattle Seahawks", "Philadelphia Eagles"],
    isHOF: false
  },
  "Rob Burnett": {
    name: "Rob Burnett",
    sacks: 73,
    teams: ["Cleveland Browns", "Baltimore Ravens", "Miami Dolphins"],
    isHOF: false
  },
  "John Dutton": {
    name: "John Dutton",
    sacks: 73,
    teams: ["Cleveland Browns"],
    isHOF: false
  },
  "Joey Bosa": {
    name: "Joey Bosa",
    sacks: 72,
    teams: ["Los Angeles Chargers"],
    isHOF: false
  },
  "Lance Johnstone": {
    name: "Lance Johnstone",
    sacks: 72,
    teams: ["Oakland Raiders", "Minnesota Vikings"],
    isHOF: false
  },
  "Matt Judon": {
    name: "Matt Judon",
    sacks: 72,
    teams: ["Baltimore Ravens", "New England Patriots", "Green Bay Packers"],
    isHOF: false
  },
  "Cornelius Bennett": {
    name: "Cornelius Bennett",
    sacks: 71.5,
    teams: ["Buffalo Bills", "Atlanta Falcons", "Indianapolis Colts"],
    isHOF: false
  },
  "Ndamukong Suh": {
    name: "Ndamukong Suh",
    sacks: 71.5,
    teams: ["Detroit Lions", "Miami Dolphins", "Los Angeles Rams", "Tampa Bay Buccaneers", "Philadelphia Eagles"],
    isHOF: false
  },
  "Michael McCrary": {
    name: "Michael McCrary",
    sacks: 71,
    teams: ["Seattle Seahawks", "Baltimore Ravens"],
    isHOF: false
  },
  "Buck Buchanan": {
    name: "Buck Buchanan",
    sacks: 70.5,
    teams: ["Kansas City Chiefs"],
    isHOF: true
  },
  "Yannick Ngakoue": {
    name: "Yannick Ngakoue",
    sacks: 70.5,
    teams: ["Jacksonville Jaguars", "Minnesota Vikings", "Baltimore Ravens", "Las Vegas Raiders", "Indianapolis Colts", "Chicago Bears", "Chicago Bears"],
    isHOF: false
  },
  "Jerry Sherk": {
    name: "Jerry Sherk",
    sacks: 70.5,
    teams: ["Cleveland Browns"],
    isHOF: false
  },
  "Preston Smith": {
    name: "Preston Smith",
    sacks: 70.5,
    teams: ["Washington Commanders", "Green Bay Packers", "Pittsburgh Steelers"],
    isHOF: false
  },
  "Peter Boulware": {
    name: "Peter Boulware",
    sacks: 70,
    teams: ["Baltimore Ravens"],
    isHOF: false
  },
  "Fletcher Cox": {
    name: "Fletcher Cox",
    sacks: 70,
    teams: ["Philadelphia Eagles"],
    isHOF: false
  },
  "Jerry Hughes": {
    name: "Jerry Hughes",
    sacks: 70,
    teams: ["Indianapolis Colts", "Buffalo Bills", "Houston Texans"],
    isHOF: false
  },
  "Chris Long": {
    name: "Chris Long",
    sacks: 70,
    teams: ["Los Angeles Rams", "New England Patriots", "Philadelphia Eagles"],
    isHOF: false
  },
  "Shawne Merriman": {
    name: "Shawne Merriman",
    sacks: 69.5,
    teams: ["Los Angeles Chargers", "Buffalo Bills"],
    isHOF: false
  },
  "Vern Den Herder": {
    name: "Vern Den Herder",
    sacks: 69.5,
    teams: ["Miami Dolphins"],
    isHOF: false
  },
  "Whitney Mercilus": {
    name: "Whitney Mercilus",
    sacks: 69.5,
    teams: ["Houston Texans", "Green Bay Packers"],
    isHOF: false
  },
  "Dante Fowler": {
    name: "Dante Fowler",
    sacks: 69,
    teams: ["Jacksonville Jaguars", "Los Angeles Rams", "Atlanta Falcons", "Dallas Cowboys"],
    isHOF: false
  },
  "Jamir Miller": {
    name: "Jamir Miller",
    sacks: 69,
    teams: ["Arizona Cardinals", "Cleveland Browns"],
    isHOF: false
  },
  "Keith Millard": {
    name: "Keith Millard",
    sacks: 69,
    teams: ["Minnesota Vikings", "Seattle Seahawks", "Philadelphia Eagles", "Green Bay Packers"],
    isHOF: false
  },
  "Brian Robison": {
    name: "Brian Robison",
    sacks: 69,
    teams: ["Minnesota Vikings"],
    isHOF: false
  },
  "Haason Reddick": {
    name: "Haason Reddick",
    sacks: 68.5,
    teams: ["Arizona Cardinals", "Carolina Panthers", "Philadelphia Eagles"],
    isHOF: false
  },
  "Darren Howard": {
    name: "Darren Howard",
    sacks: 68.5,
    teams: ["New Orleans Saints", "Philadelphia Eagles"],
    isHOF: false
  },
  "Lionel Aldridge": {
    name: "Lionel Aldridge",
    sacks: 68,
    teams: ["Green Bay Packers", "Los Angeles Chargers"],
    isHOF: false
  },
  "Carl Nassib": {
    name: "Carl Nassib",
    sacks: 68,
    teams: ["Cleveland Browns", "Tampa Bay Buccaneers", "Las Vegas Raiders"],
    isHOF: false
  },
  "Tony Brackens": {
    name: "Tony Brackens",
    sacks: 67.5,
    teams: ["Jacksonville Jaguars"],
    isHOF: false
  },
  "Mike Pitts": {
    name: "Mike Pitts",
    sacks: 67.5,
    teams: ["Atlanta Falcons", "Philadelphia Eagles", "New England Patriots"],
    isHOF: false
  },
  "Markus Golden": {
    name: "Markus Golden",
    sacks: 67,
    teams: ["Arizona Cardinals", "New York Giants"],
    isHOF: false
  },
  "Bertrand Berry": {
    name: "Bertrand Berry",
    sacks: 66.5,
    teams: ["Indianapolis Colts", "Denver Broncos", "Arizona Cardinals"],
    isHOF: false
  },
  "Anthony Pleasant": {
    name: "Anthony Pleasant",
    sacks: 66,
    teams: ["Cleveland Browns", "Baltimore Ravens", "Atlanta Falcons", "New York Jets", "San Francisco 49ers", "New England Patriots"],
    isHOF: false
  },
  "Brad Shearer": {
    name: "Brad Shearer",
    sacks: 66,
    teams: ["Chicago Bears"],
    isHOF: false
  },
  "Aundray Bruce": {
    name: "Aundray Bruce",
    sacks: 65.5,
    teams: ["Atlanta Falcons", "Las Vegas Raiders"],
    isHOF: false
  },
  "Mike Golic": {
    name: "Mike Golic",
    sacks: 65.5,
    teams: ["Tennessee Titans", "Philadelphia Eagles", "Miami Dolphins"],
    isHOF: false
  },
  "Brian Orakpo": {
    name: "Brian Orakpo",
    sacks: 65.5,
    teams: ["Washington Commanders", "Tennessee Titans"],
    isHOF: false
  },
  "Olivier Vernon": {
    name: "Olivier Vernon",
    sacks: 65.5,
    teams: ["Miami Dolphins", "New York Giants", "Cleveland Browns"],
    isHOF: false
  },
  "Jadeveon Clowney": {
    name: "Jadeveon Clowney",
    sacks: 65,
    teams: ["Houston Texans", "Seattle Seahawks", "Tennessee Titans", "Cleveland Browns", "Baltimore Ravens"],
    isHOF: false
  },
  "Mike Douglass": {
    name: "Mike Douglass",
    sacks: 65,
    teams: ["Green Bay Packers", "Los Angeles Chargers"],
    isHOF: false
  },
  "Melvin Ingram": {
    name: "Melvin Ingram",
    sacks: 65,
    teams: ["Los Angeles Chargers", "Pittsburgh Steelers", "Kansas City Chiefs", "Miami Dolphins"],
    isHOF: false
  },
  "Shaq Barrett": {
    name: "Shaq Barrett",
    sacks: 64.5,
    teams: ["Denver Broncos", "Tampa Bay Buccaneers"],
    isHOF: false
  },
  "Mathias Kiwanuka": {
    name: "Mathias Kiwanuka",
    sacks: 64.5,
    teams: ["New York Giants"],
    isHOF: false
  },
  "Derrick Burgess": {
    name: "Derrick Burgess",
    sacks: 64,
    teams: ["Philadelphia Eagles", "Oakland Raiders", "New England Patriots"],
    isHOF: false
  },
  "Mike Kadish": {
    name: "Mike Kadish",
    sacks: 64,
    teams: ["Buffalo Bills", "Atlanta Falcons"],
    isHOF: false
  },
  "Davin Joseph": {
    name: "Davin Joseph",
    sacks: 64,
    teams: ["Tampa Bay Buccaneers", "Los Angeles Rams"],
    isHOF: false
  },
  "Dante Jones": {
    name: "Dante Jones",
    sacks: 63.5,
    teams: ["Chicago Bears", "Denver Broncos"],
    isHOF: false
  },
  "Shaq Lawson": {
    name: "Shaq Lawson",
    sacks: 63.5,
    teams: ["Buffalo Bills", "Miami Dolphins", "New York Jets", "Buffalo Bills"],
    isHOF: false
  },
  "Sam Adams": {
    name: "Sam Adams",
    sacks: 63,
    teams: ["Seattle Seahawks", "Baltimore Ravens", "Oakland Raiders", "Buffalo Bills", "Cincinnati Bengals", "Denver Broncos"],
    isHOF: false
  },
  "Antwan Odom": {
    name: "Antwan Odom",
    sacks: 63,
    teams: ["Tennessee Titans", "Cincinnati Bengals"],
    isHOF: false
  },
  "Marcus Spears": {
    name: "Marcus Spears",
    sacks: 63,
    teams: ["Dallas Cowboys", "Baltimore Ravens"],
    isHOF: false
  },
  "Za'Darius Smith": {
    name: "Za'Darius Smith",
    sacks: 63,
    teams: ["Baltimore Ravens", "Green Bay Packers", "Minnesota Vikings", "Cleveland Browns"],
    isHOF: false
  },
  "Darnell Dockett": {
    name: "Darnell Dockett",
    sacks: 62.5,
    teams: ["Arizona Cardinals", "San Francisco 49ers"],
    isHOF: false
  },
  "Renaldo Turnbull": {
    name: "Renaldo Turnbull",
    sacks: 62.5,
    teams: ["New Orleans Saints", "Carolina Panthers"],
    isHOF: false
  },
  "Rashan Gary": {
    name: "Rashan Gary",
    sacks: 62,
    teams: ["Green Bay Packers"],
    isHOF: false
  },
  "Jarvis Green": {
    name: "Jarvis Green",
    sacks: 62,
    teams: ["New England Patriots", "Tennessee Titans"],
    isHOF: false
  },
  "Montez Sweat": {
    name: "Montez Sweat",
    sacks: 62,
    teams: ["Washington Commanders", "Chicago Bears"],
    isHOF: false
  },
  "Josh Allen": {
    name: "Josh Allen",
    sacks: 61.5,
    teams: ["Jacksonville Jaguars"],
    isHOF: false
  },
  "Tony Tolbert": {
    name: "Tony Tolbert",
    sacks: 61.5,
    teams: ["Dallas Cowboys"],
    isHOF: false
  },
  "Maxx Crosby": {
    name: "Maxx Crosby",
    sacks: 61,
    teams: ["Las Vegas Raiders"],
    isHOF: false
  },
  "Micah Parsons": {
    name: "Micah Parsons",
    sacks: 61,
    teams: ["Dallas Cowboys"],
    isHOF: false
  },
  "Brian Burns": {
    name: "Brian Burns",
    sacks: 60.5,
    teams: ["Carolina Panthers"],
    isHOF: false
  },
  "Arik Armstead": {
    name: "Arik Armstead",
    sacks: 60,
    teams: ["San Francisco 49ers"],
    isHOF: false
  },
  "Bradley Chubb": {
    name: "Bradley Chubb",
    sacks: 60,
    teams: ["Denver Broncos", "Miami Dolphins"],
    isHOF: false
  },
  "Juqua Parker": {
    name: "Juqua Parker",
    sacks: 60,
    teams: ["Tennessee Titans", "Philadelphia Eagles", "Cleveland Browns"],
    isHOF: false
  },
  "Daryl Smith": {
    name: "Daryl Smith",
    sacks: 60,
    teams: ["Jacksonville Jaguars", "Baltimore Ravens", "Tampa Bay Buccaneers"],
    isHOF: false
  },
  "Harold Carmichael": {
    name: "Harold Carmichael",
    sacks: 59.5,
    teams: ["Philadelphia Eagles", "Dallas Cowboys"],
    isHOF: true
  },
  "Kwity Paye": {
    name: "Kwity Paye",
    sacks: 59.5,
    teams: ["Indianapolis Colts"],
    isHOF: false
  },
  "Jaylon Ferguson": {
    name: "Jaylon Ferguson",
    sacks: 59,
    teams: ["Baltimore Ravens"],
    isHOF: false
  },
  "Dre'Mont Jones": {
    name: "Dre'Mont Jones",
    sacks: 59,
    teams: ["Denver Broncos", "Seattle Seahawks"],
    isHOF: false
  },
  "Denico Autry": {
    name: "Denico Autry",
    sacks: 58.5,
    teams: ["Las Vegas Raiders", "Indianapolis Colts", "Tennessee Titans"],
    isHOF: false
  },
  "Sam Hubbard": {
    name: "Sam Hubbard",
    sacks: 58.5,
    teams: ["Cincinnati Bengals"],
    isHOF: false
  },
  "Derrick Morgan": {
    name: "Derrick Morgan",
    sacks: 58,
    teams: ["Tennessee Titans"],
    isHOF: false
  },
  "Quinton Jefferson": {
    name: "Quinton Jefferson",
    sacks: 58,
    teams: ["Seattle Seahawks", "Buffalo Bills", "Las Vegas Raiders", "Seattle Seahawks", "New York Jets"],
    isHOF: false
  }
}; 