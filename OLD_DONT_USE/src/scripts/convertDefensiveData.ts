import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DefensivePlayer {
  name: string;
  sacks: number;
  teams: string[];
  isHOF: boolean;
  nicknames?: string[];
}

// Team name mappings for consistency
const TEAM_MAPPINGS: Record<string, string> = {
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

// Get the existing database content
const existingDatabasePath = path.join(__dirname, '../data/defensiveData.ts');
const existingContent = fs.readFileSync(existingDatabasePath, 'utf8');

// Extract the database object
const databaseMatch = existingContent.match(/export const defensiveDatabase: Record<string, DefensivePlayer> = ({[^]*?});/);
if (!databaseMatch) {
  throw new Error('Could not find database in file');
}

// Convert the database string to an object
const databaseString = databaseMatch[1];
const context = vm.createContext({});
let defensiveDatabase: Record<string, DefensivePlayer>;
try {
  defensiveDatabase = vm.runInContext(`(${databaseString})`, context) as Record<string, DefensivePlayer>;
} catch (e) {
  throw new Error('Error evaluating database string');
}

// Convert team abbreviations to full names
function convertTeams(teams: string[]): string[] {
  return teams.map(team => TEAM_MAPPINGS[team.toLowerCase()] || team);
}

// Group players by sack ranges
function groupPlayers() {
  const groups: { [key: string]: DefensivePlayer[] } = {
    '200+': [],
    '190-199': [],
    '180-189': [],
    '170-179': [],
    '160-169': [],
    '150-159': [],
    '140-149': [],
    '130-139': [],
    '120-129': [],
    '110-119': [],
    '100-109': [],
    '90-99': [],
    '80-89': [],
    '70-79': [],
    '60-69': [],
    'Under 60': []
  };

  for (const [, player] of Object.entries(defensiveDatabase)) {
    const sacks = player.sacks;
    let group = '';

    if (sacks >= 200) group = '200+';
    else if (sacks >= 190) group = '190-199';
    else if (sacks >= 180) group = '180-189';
    else if (sacks >= 170) group = '170-179';
    else if (sacks >= 160) group = '160-169';
    else if (sacks >= 150) group = '150-159';
    else if (sacks >= 140) group = '140-149';
    else if (sacks >= 130) group = '130-139';
    else if (sacks >= 120) group = '120-129';
    else if (sacks >= 110) group = '110-119';
    else if (sacks >= 100) group = '100-109';
    else if (sacks >= 90) group = '90-99';
    else if (sacks >= 80) group = '80-89';
    else if (sacks >= 70) group = '70-79';
    else if (sacks >= 60) group = '60-69';
    else group = 'Under 60';

    groups[group].push({
      name: player.name,
      sacks: player.sacks,
      teams: convertTeams(player.teams),
      isHOF: player.isHOF
    });
  }

  return groups;
}

// Generate the new file content
function generateNewFileContent() {
  const groups = groupPlayers();
  let content = `export interface DefensivePlayer {
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

export const defensiveDatabase: Record<string, DefensivePlayer> = {
`;

  Object.entries(groups).forEach(([range, players]) => {
    if (players.length > 0) {
      content += `  // ${range} Sacks\n`;
      players.forEach((player, index) => {
        content += `  "${player.name}": {
    name: "${player.name}",
    sacks: ${player.sacks},
    teams: ${JSON.stringify(player.teams)},
    isHOF: ${player.isHOF}
  }${index < players.length - 1 || range !== 'Under 60' ? ',' : ''}\n\n`;
      });
    }
  });

  content += '};';
  return content;
}

// Write the new file
const newContent = generateNewFileContent();
const outputPath = path.join(__dirname, '../data/defensiveData2.ts');
fs.writeFileSync(outputPath, newContent);

console.log('Conversion complete. New file written to:', outputPath); 