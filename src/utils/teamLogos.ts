const teamLogos: { [key: string]: string } = {
  'Arizona Cardinals': '/logos/cardinals.png',
  'Atlanta Falcons': '/logos/falcons.png',
  'Baltimore Ravens': '/logos/ravens.png',
  'Buffalo Bills': '/logos/bills.png',
  'Carolina Panthers': '/logos/panthers.png',
  'Chicago Bears': '/logos/bears.png',
  'Cincinnati Bengals': '/logos/bengals.png',
  'Cleveland Browns': '/logos/browns.png',
  'Dallas Cowboys': '/logos/cowboys.png',
  'Denver Broncos': '/logos/broncos.png',
  'Detroit Lions': '/logos/lions.png',
  'Green Bay Packers': '/logos/packers.png',
  'Houston Texans': '/logos/texans.png',
  'Indianapolis Colts': '/logos/colts.png',
  'Jacksonville Jaguars': '/logos/jaguars.png',
  'Kansas City Chiefs': '/logos/chiefs.png',
  'Las Vegas Raiders': '/logos/raiders.png',
  'Los Angeles Chargers': '/logos/chargers.png',
  'Los Angeles Rams': '/logos/rams.png',
  'Miami Dolphins': '/logos/dolphins.png',
  'Minnesota Vikings': '/logos/vikings.png',
  'New England Patriots': '/logos/patriots.png',
  'New Orleans Saints': '/logos/saints.png',
  'New York Giants': '/logos/giants.png',
  'New York Jets': '/logos/jets.png',
  'Philadelphia Eagles': '/logos/eagles.png',
  'Pittsburgh Steelers': '/logos/steelers.png',
  'San Francisco 49ers': '/logos/49ers.png',
  'Seattle Seahawks': '/logos/seahawks.png',
  'Tampa Bay Buccaneers': '/logos/buccaneers.png',
  'Tennessee Titans': '/logos/titans.png',
  'Washington Commanders': '/logos/commanders.png'
};

export function getTeamLogo(team: string): string {
  return teamLogos[team] || '/logos/default.png';
} 