export interface QBData {
  name: string;
  wins: number;
  teams: string[];
  nicknames?: string[];
  ties?: number;
}

// Nickname mappings for QBs
const QB_NICKNAMES: Record<string, string> = {
  "TB12": "Tom Brady",
  "The GOAT": "Tom Brady",
  
  "The Sheriff": "Peyton Manning",
  "Big Ben": "Ben Roethlisberger",
  "A-Rod": "Aaron Rodgers",
  "Joe Cool": "Joe Montana",
  "Captain America": "Roger Staubach",
  "Matty Ice": "Matt Ryan",
  "Dak": "Dak Prescott",
  "Tua": "Tua Tagovailoa",
  "The Snake": "Ken Stabler",
  "The Mad Bomber": "Daryle Lamonica",
  "The Punky QB": "Jim McMahon",
  "Air McNair": "Steve McNair",
  
  "Fitzmagic": "Ryan Fitzpatrick",


};

// Function to find closest match
export const findClosestMatch = (input: string): string | null => {
  const normalizedInput = input.toLowerCase().replace(/'/g, '');

  // Check for nickname match (case-insensitive, exact)
  const nicknameEntry = Object.entries(QB_NICKNAMES).find(([nickname]) => nickname.toLowerCase() === normalizedInput);
  if (nicknameEntry) {
    return nicknameEntry[1];
  }

  // First try exact match
  if (qbDatabase[input]) {
    return input;
  }

  // Then try match without apostrophes
  const matches = Object.keys(qbDatabase).filter(name => {
    const normalizedName = name.toLowerCase().replace(/'/g, '');
    return normalizedName === normalizedInput;
  });

  if (matches.length === 1) {
    return matches[0];
  }

  // If no exact match, try fuzzy matching
  const fuzzyMatches = Object.keys(qbDatabase).filter(name => {
    const normalizedName = name.toLowerCase().replace(/'/g, '');
    return normalizedName.includes(normalizedInput) || normalizedInput.includes(normalizedName);
  });

  if (fuzzyMatches.length === 1) {
    return fuzzyMatches[0];
  }

  return null;
};

export const qbDatabase: Record<string, QBData> = {
  // 200+ Wins
  "Tom Brady": {
    name: "Tom Brady",
    wins: 251,
    teams: ["Patriots", "Buccaneers"]
  },

  // 180-200 Wins
  "Peyton Manning": {
    name: "Peyton Manning",
    wins: 186,
    teams: ["Colts", "Broncos"]
  },
  "Brett Favre": {
    name: "Brett Favre",
    wins: 186,
    teams: ["Packers", "Jets", "Vikings"]
  },

  // 170-180 Wins
  "Drew Brees": {
    name: "Drew Brees",
    wins: 172,
    teams: ["Chargers", "Saints"]
  },

  // 160-170 Wins
  "Ben Roethlisberger": {
    name: "Ben Roethlisberger",
    wins: 165,
    teams: ["Steelers"]
  },

  // 140-160 Wins
  "John Elway": {
    name: "John Elway",
    wins: 148,
    teams: ["Broncos"]
  },
  "Dan Marino": {
    name: "Dan Marino",
    wins: 147,
    teams: ["Dolphins"]
  },
  "Aaron Rodgers": {
    name: "Aaron Rodgers",
    wins: 153,
    teams: ["Packers", "Jets"]
  },

  // 130-140 Wins
  "Philip Rivers": {
    name: "Philip Rivers",
    wins: 134,
    teams: ["Chargers", "Colts"]
  },

  // 120-130 Wins
  "Fran Tarkenton": {
    name: "Fran Tarkenton",
    wins: 124,
    teams: ["Vikings", "Giants"]
  },
  "Johnny Unitas": {
    name: "Johnny Unitas",
    wins: 118,
    teams: ["Colts", "Chargers"]
  },
  "Eli Manning": {
    name: "Eli Manning",
    wins: 117,
    teams: ["Giants"]
  },
  "Joe Montana": {
    name: "Joe Montana",
    wins: 117,
    teams: ["49ers", "Chiefs"]
  },

  // 110-120 Wins
  "Terry Bradshaw": {
    name: "Terry Bradshaw",
    wins: 107,
    teams: ["Steelers"]
  },
  "Warren Moon": {
    name: "Warren Moon",
    wins: 102,
    teams: ["Seahawks", "Oilers", "Vikings", "Chiefs"]
  },
  "Jim Kelly": {
    name: "Jim Kelly",
    wins: 101,
    teams: ["Bills"]
  },

  // 100-110 Wins
  "Russell Wilson": {
    name: "Russell Wilson",
    wins: 113,
    teams: ["Seahawks", "Broncos"]
  },
  "Steve Young": {
    name: "Steve Young",
    wins: 94,
    teams: ["49ers"]
  },
  "Troy Aikman": {
    name: "Troy Aikman",
    wins: 94,
    teams: ["Cowboys"]
  },
  "Roger Staubach": {
    name: "Roger Staubach",
    wins: 85,
    teams: ["Cowboys"]
  },
  "Patrick Mahomes": {
    name: "Patrick Mahomes",
    wins: 89,
    teams: ["Chiefs"]
  },

  // Adding more QBs
  "Matt Ryan": {
    name: "Matt Ryan",
    wins: 124,
    teams: ["Falcons", "Colts"]
  },
  "Drew Bledsoe": {
    name: "Drew Bledsoe",
    wins: 98,
    teams: ["Patriots", "Bills", "Cowboys"]
  },
  "Donovan McNabb": {
    name: "Donovan McNabb",
    wins: 98,
    teams: ["Eagles", "Commanders", "Vikings"]
  },
  "Carson Palmer": {
    name: "Carson Palmer",
    wins: 92,
    teams: ["Bengals", "Raiders", "Cardinals"]
  },
  "Tony Romo": {
    name: "Tony Romo",
    wins: 78,
    teams: ["Cowboys"]
  },
  "Matthew Stafford": {
    name: "Matthew Stafford",
    wins: 108,
    teams: ["Lions", "Rams"]
  },
  "Kirk Cousins": {
    name: "Kirk Cousins",
    wins: 78,
    teams: ["Commanders", "Vikings"]
  },
  "Derek Carr": {
    name: "Derek Carr",
    wins: 77,
    teams: ["Saints", "Raiders"]
  },
  "Dak Prescott": {
    name: "Dak Prescott",
    wins: 76,
    teams: ["Cowboys"]
  },
  "Lamar Jackson": {
    name: "Lamar Jackson",
    wins: 70,
    teams: ["Ravens"]
  },
  "Josh Allen": {
    name: "Josh Allen",
    wins: 76,
    teams: ["Bills"]
  },
  "Joe Burrow": {
    name: "Joe Burrow",
    wins: 38,
    teams: ["Bengals"]
  },
  "Justin Herbert": {
    name: "Justin Herbert",
    wins: 41,
    teams: ["Chargers"]
  },
  "Tua Tagovailoa": {
    name: "Tua Tagovailoa",
    wins: 40,
    teams: ["Dolphins"]
  },
  "Trevor Lawrence": {
    name: "Trevor Lawrence",
    wins: 22,
    teams: ["Jaguars"]
  },
  "Mark Brunell": {
    name: "Mark Brunell",
    wins: 69,
    teams: ["Jaguars", "Commanders", "Saints", "Jets"]
  },
  "David Garrard": {
    name: "David Garrard",
    wins: 39,
    teams: ["Jaguars", "Jets"]
  },
  "Blake Bortles": {
    name: "Blake Bortles",
    wins: 24,
    teams: ["Jaguars", "Rams", "Broncos", "Packers", "Saints"]
  },
  "Nick Foles": {
    name: "Nick Foles",
    wins: 29,
    teams: ["Jaguars", "Eagles", "Rams", "Chiefs", "Bears", "Colts"]
  },
  "Gardner Minshew": {
    name: "Gardner Minshew",
    wins: 7,
    teams: ["Jaguars", "Eagles", "Colts"]
  },
  "Byron Leftwich": {
    name: "Byron Leftwich",
    wins: 24,
    teams: ["Steelers", "Jaguars", "Falcons", "Buccaneers"]
  },
  "Chad Henne": {
    name: "Chad Henne",
    wins: 18,
    teams: ["Jaguars", "Dolphins", "Chiefs"]
  },
  "C.J. Beathard": {
    name: "C.J. Beathard",
    wins: 2,
    teams: ["Jaguars", "49ers"]
  },
  "Mike Glennon": {
    name: "Mike Glennon",
    wins: 6,
    teams: ["Jaguars", "Buccaneers", "Bears", "Cardinals", "Giants", "Dolphins"]
  },
  "Jake Luton": {
    name: "Jake Luton",
    wins: 0,
    teams: ["Seahawks", "Jaguars", "Dolphins", "Vikings"]
  },
  "Josh Johnson": {
    name: "Josh Johnson",
    wins: 1,
    teams: ["Jaguars", "Buccaneers", "49ers", "Browns", "Bengals", "Jets", "Commanders", "Ravens", "Broncos", "Texans", "Raiders", "Cowboys"]
  },
  "Nathan Rourke": {
    name: "Nathan Rourke",
    wins: 0,
    teams: ["Jaguars"]
  },
  "Ken Stabler": {
    name: "Ken Stabler",
    wins: 96,
    teams: ["Raiders", "Oilers", "Saints"]
  },
  "Bob Griese": {
    name: "Bob Griese",
    wins: 92,
    teams: ["Dolphins"]
  },
  "Len Dawson": {
    name: "Len Dawson",
    wins: 94,
    teams: ["Steelers", "Browns", "Chiefs"]
  },
  "Bart Starr": {
    name: "Bart Starr",
    wins: 94,
    teams: ["Packers"]
  },
  "Sonny Jurgensen": {
    name: "Sonny Jurgensen",
    wins: 69,
    teams: ["Eagles", "Commanders"]
  },

  // Adding more historical QBs
  "Otto Graham": {
    name: "Otto Graham",
    wins: 105,
    teams: ["Browns"]
  },
  "Sid Luckman": {
    name: "Sid Luckman",
    wins: 94,
    teams: ["Bears"]
  },
  "Sammy Baugh": {
    name: "Sammy Baugh",
    wins: 77,
    teams: ["Commanders"]
  },
  "Bobby Layne": {
    name: "Bobby Layne",
    wins: 66,
    teams: ["Bears", "Bulldogs", "Lions", "Steelers"]
  },
  "Y.A. Tittle": {
    name: "Y.A. Tittle",
    wins: 78,
    teams: ["Colts", "49ers", "Giants"]
  },
  "Norm Van Brocklin": {
    name: "Norm Van Brocklin",
    wins: 66,
    teams: ["Rams", "Eagles", "Vikings"]
  },
  "George Blanda": {
    name: "George Blanda",
    wins: 83,
    teams: ["Bears", "Colts", "Oilers", "Raiders"]
  },
  "John Brodie": {
    name: "John Brodie",
    wins: 74,
    teams: ["49ers"]
  },
  "Roman Gabriel": {
    name: "Roman Gabriel",
    wins: 86,
    teams: ["Rams", "Eagles"]
  },
  "Daryle Lamonica": {
    name: "Daryle Lamonica",
    wins: 66,
    teams: ["Bills", "Raiders"]
  },
  "Billy Kilmer": {
    name: "Billy Kilmer",
    wins: 69,
    teams: ["49ers", "Saints", "Commanders"]
  },
  "Ken Anderson": {
    name: "Ken Anderson",
    wins: 91,
    teams: ["Bengals"]
  },
  "Jim Hart": {
    name: "Jim Hart",
    wins: 87,
    teams: ["Cardinals", "Commanders"]
  },
  "Archie Manning": {
    name: "Archie Manning",
    wins: 35,
    teams: ["Saints", "Oilers", "Vikings"]
  },
  "Dan Fouts": {
    name: "Dan Fouts",
    wins: 86,
    teams: ["Chargers"]
  },
  "Jim Plunkett": {
    name: "Jim Plunkett",
    wins: 72,
    teams: ["Patriots", "49ers", "Raiders"]
  },
  "Bert Jones": {
    name: "Bert Jones",
    wins: 46,
    teams: ["Colts", "Rams"]
  },
  "Brian Sipe": {
    name: "Brian Sipe",
    wins: 57,
    teams: ["Browns"]
  },
  "Joe Flacco": {
    name: "Joe Flacco",
    wins: 98,
    teams: ["Ravens", "Broncos", "Jets", "Browns", "Colts"]
  },
  "Steve Grogan": {
    name: "Steve Grogan",
    wins: 75,
    teams: ["Patriots"]
  },

  // Adding final group of QBs
  "Phil Simms": {
    name: "Phil Simms",
    wins: 95,
    teams: ["Giants"]
  },
  "Jim McMahon": {
    name: "Jim McMahon",
    wins: 67,
    teams: ["Bears", "Chargers", "Eagles", "Vikings", "Cardinals", "Packers"]
  },
  "Boomer Esiason": {
    name: "Boomer Esiason",
    wins: 80,
    teams: ["Bengals", "Jets", "Cardinals"]
  },
  "Mark Rypien": {
    name: "Mark Rypien",
    wins: 45,
    teams: ["Commanders", "Browns", "Rams", "Eagles", "Colts"]
  },
  "Steve McNair": {
    name: "Steve McNair",
    wins: 91,
    teams: ["Titans", "Oilers", "Ravens"]
  },
  "Kurt Warner": {
    name: "Kurt Warner",
    wins: 67,
    teams: ["Rams", "Giants", "Cardinals"]
  },
  "Rich Gannon": {
    name: "Rich Gannon",
    wins: 76,
    teams: ["Vikings", "Commanders", "Chiefs", "Raiders"]
  },
  "Jeff Garcia": {
    name: "Jeff Garcia",
    wins: 58,
    teams: ["49ers", "Browns", "Lions", "Eagles", "Buccaneers"]
  },
  "Trent Green": {
    name: "Trent Green",
    wins: 56,
    teams: ["Chiefs", "Commanders", "Rams", "Dolphins"]
  },
  "Jake Plummer": {
    name: "Jake Plummer",
    wins: 69,
    teams: ["Cardinals", "Broncos"]
  },
  "Marc Bulger": {
    name: "Marc Bulger",
    wins: 42,
    teams: ["Rams"]
  },
  "Michael Vick": {
    name: "Michael Vick",
    wins: 61,
    teams: ["Steelers", "Falcons", "Eagles", "Jets"]
  },
  "Matt Hasselbeck": {
    name: "Matt Hasselbeck",
    wins: 85,
    teams: ["Titans", "Seahawks", "Packers", "Colts"]
  },
  "Andrew Luck": {
    name: "Andrew Luck",
    wins: 53,
    teams: ["Colts"]
  },
  "Vinny Testaverde": {
    name: "Vinny Testaverde",
    wins: 90,
    teams: ["Buccaneers", "Browns", "Ravens", "Jets", "Cowboys", "Patriots", "Panthers"]
  },

  // Houston Texans QBs
  "Deshaun Watson": {
    name: "Deshaun Watson",
    wins: 28,
    teams: ["Texans", "Browns"]
  },
  "Matt Schaub": {
    name: "Matt Schaub",
    wins: 46,
    teams: ["Texans", "Falcons", "Raiders", "Ravens"]
  },
  "David Carr": {
    name: "David Carr",
    wins: 23,
    teams: ["Texans", "Panthers", "Giants", "49ers"]
  },
  "Case Keenum": {
    name: "Case Keenum",
    wins: 29,
    teams: ["Texans", "Vikings", "Broncos", "Commanders", "Browns", "Bills", "Rams"]
  },
  "Ryan Fitzpatrick": {
    name: "Ryan Fitzpatrick",
    wins: 59,
    teams: ["Titans", "Bills", "Texans", "Jets", "Buccaneers", "Dolphins", "Commanders"]
  },
  "Brian Hoyer": {
    name: "Brian Hoyer",
    wins: 16,
    teams: ["Texans", "Patriots", "Cardinals", "Browns", "Bears", "49ers", "Colts", "Raiders"]
  },
  "T.J. Yates": {
    name: "T.J. Yates",
    wins: 4,
    teams: ["Texans", "Falcons", "Dolphins"]
  },
  "Brandon Weeden": {
    name: "Brandon Weeden",
    wins: 5,
    teams: ["Texans", "Browns", "Cowboys", "Titans"]
  },
  "Ryan Mallett": {
    name: "Ryan Mallett",
    wins: 3,
    teams: ["Texans", "Ravens"]
  },
  "Tom Savage": {
    name: "Tom Savage",
    wins: 2,
    teams: ["Texans", "49ers"]
  },
  "Davis Mills": {
    name: "Davis Mills",
    wins: 5,
    teams: ["Texans"]
  },
  "Tyrod Taylor": {
    name: "Tyrod Taylor",
    wins: 24,
    teams: ["Texans", "Bills", "Browns", "Chargers", "Giants"]
  },
  "Jeff Driskel": {
    name: "Jeff Driskel",
    wins: 1,
    teams: ["Texans", "Bengals", "Lions", "Broncos", "49ers"]
  },
  "Kyle Allen": {
    name: "Kyle Allen",
    wins: 2,
    teams: ["Texans", "Panthers", "Commanders", "Bills"]
  },
  "Scott Hunter": {
    name: "Scott Hunter",
    wins: 6,
    teams: ["Packers", "Bills", "Falcons", "Lions", "Bengals"]
  },
  "Jordan Love": {
    name: "Jordan Love",
    wins: 21,
    teams: ["Packers"]
  },
  "Don Horn": {
    name: "Don Horn",
    wins: 4,
    teams: ["Packers", "Broncos", "Chargers", "Browns"]
  },
  "Zeke Bratkowski": {
    name: "Zeke Bratkowski",
    wins: 12,
    teams: ["Packers", "Bears", "Rams"]
  },
  "John Hadl": {
    name: "John Hadl",
    wins: 82,
    teams: ["Packers", "Chargers", "Rams", "Oilers"]
  },
  "David Whitehurst": {
    name: "David Whitehurst",
    wins: 17,
    teams: ["Packers", "Chiefs"]
  },
  "Lynn Dickey": {
    name: "Lynn Dickey",
    wins: 25,
    teams: ["Packers", "Oilers", "Chiefs"]
  },
  "Randy Wright": {
    name: "Randy Wright",
    wins: 4,
    teams: ["Packers"]
  },
  "Anthony Dilweg": {
    name: "Anthony Dilweg",
    wins: 2,
    teams: ["Packers"]
  },
  "Mike Tomczak": {
    name: "Mike Tomczak",
    wins: 42,
    teams: ["Steelers", "Bears", "Packers", "Browns", "Commanders"]
  },
  "Blair Kiel": {
    name: "Blair Kiel",
    wins: 0,
    teams: ["Packers", "Colts", "Buccaneers"]
  },
  "Don Majkowski": {
    name: "Don Majkowski",
    wins: 27,
    teams: ["Packers", "Colts", "Lions"]
  },
  "Ty Detmer": {
    name: "Ty Detmer",
    wins: 4,
    teams: ["Packers", "Eagles", "49ers", "Browns", "Lions", "Falcons"]
  },
  "Doug Pederson": {
    name: "Doug Pederson",
    wins: 2,
    teams: ["Packers", "Eagles", "Browns", "Dolphins"]
  },
  "Matt Flynn": {
    name: "Matt Flynn",
    wins: 3,
    teams: ["Packers", "Seahawks", "Raiders", "Bills", "Jets", "Saints"]
  },
  "Brett Hundley": {
    name: "Brett Hundley",
    wins: 3,
    teams: ["Packers", "Seahawks", "Cardinals", "Colts"]
  },
  "Tim Boyle": {
    name: "Tim Boyle",
    wins: 0,
    teams: ["Packers", "Lions", "Jets"]
  },
  "Elvis Grbac": {
    name: "Elvis Grbac",
    wins: 31,
    teams: ["Chiefs", "49ers", "Ravens"]
  },
  "Damon Huard": {
    name: "Damon Huard",
    wins: 14,
    teams: ["Chiefs", "Dolphins", "Patriots", "49ers"]
  },
  "Brodie Croyle": {
    name: "Brodie Croyle",
    wins: 0,
    teams: ["Chiefs"]
  },
  "Kerry Collins": {
    name: "Kerry Collins",
    wins: 81,
    teams: ["Titans", "Panthers", "Giants", "Raiders", "Colts"]
  },
  "Jake Locker": {
    name: "Jake Locker",
    wins: 9,
    teams: ["Titans"]
  },
  "Marcus Mariota": {
    name: "Marcus Mariota",
    wins: 29,
    teams: ["Titans", "Raiders", "Falcons", "Eagles"]
  },
  "Matt Cassel": {
    name: "Matt Cassel",
    wins: 33,
    teams: ["Titans", "Patriots", "Chiefs", "Vikings", "Bills", "Cowboys", "Lions"]
  },
  "Blaine Gabbert": {
    name: "Blaine Gabbert",
    wins: 13,
    teams: ["Titans", "Jaguars", "49ers", "Cardinals", "Chiefs", "Buccaneers"]
  },
  "Rusty Smith": {
    name: "Rusty Smith",
    wins: 0,
    teams: ["Titans"]
  },
  "Alex Hasselbeck": {
    name: "Alex Hasselbeck",
    wins: 0,
    teams: ["Titans"]
  },
  "Jay Cutler": {
    name: "Jay Cutler",
    wins: 74,
    teams: ["Broncos", "Bears", "Dolphins"]
  },
  "Joe Theismann": {
    name: "Joe Theismann",
    wins: 77,
    teams: ["Commanders"]
  },
  "Cam Newton": {
    name: "Cam Newton",
    wins: 75,
    teams: ["Panthers", "Patriots", "Panthers"]
  },
  "Alex Smith": {
    name: "Alex Smith",
    wins: 99,
    teams: ["49ers", "Chiefs", "Commanders"]
  },
  "Dave Krieg": {
    name: "Dave Krieg",
    wins: 98,
    teams: ["Seahawks", "Chiefs", "Lions", "Cardinals", "Titans", "Bears"]
  },
  "Andy Dalton": {
    name: "Andy Dalton",
    wins: 84,
    teams: ["Bengals", "Cowboys", "Bears", "Bills", "Panthers"]
  },
  "Randall Cunningham": {
    name: "Randall Cunningham",
    wins: 82,
    teams: ["Eagles", "Vikings", "Cowboys", "Ravens"]
  },
  "Jared Goff": {
    name: "Jared Goff",
    wins: 81,
    teams: ["Rams", "Lions"]
  },
  "Craig Morton": {
    name: "Craig Morton",
    wins: 81,
    teams: ["Cowboys", "Giants", "Broncos", "Raiders"]
  },
  "Ryan Tannehill": {
    name: "Ryan Tannehill",
    wins: 81,
    teams: ["Dolphins", "Titans"]
  },
  "Joe Ferguson": {
    name: "Joe Ferguson",
    wins: 79,
    teams: ["Bills", "Lions", "Buccaneers"]
  },
  "Ron Jaworski": {
    name: "Ron Jaworski",
    wins: 73,
    teams: ["Eagles", "Dolphins", "Chiefs"]
  },
  "Brad Johnson": {
    name: "Brad Johnson",
    wins: 72,
    teams: ["Vikings", "Buccaneers", "Cowboys"]
  },
  "Chris Chandler": {
    name: "Chris Chandler",
    wins: 67,
    teams: ["Colts", "Buccaneers", "Oilers", "Falcons", "Bears", "Rams", "Titans"]
  },
  "Jim Harbaugh": {
    name: "Jim Harbaugh",
    wins: 66,
    teams: ["Bears", "Colts", "Ravens", "Chargers", "Lions", "Panthers"]
  },
  "Charlie Conerly": {
    name: "Charlie Conerly",
    wins: 65,
    teams: ["Giants"]
  },
  "Jack Kemp": {
    name: "Jack Kemp",
    wins: 64,
    teams: ["Bills", "Chargers", "Lions"]
  },
  "Jim Everett": {
    name: "Jim Everett",
    wins: 63,
    teams: ["Rams", "Saints", "Chargers"]
  },
  "Earl Morrall": {
    name: "Earl Morrall",
    wins: 63,
    teams: ["49ers", "Steelers", "Lions", "Colts", "Dolphins", "Ravens"]
  },
  "Jake Delhomme": {
    name: "Jake Delhomme",
    wins: 56,
    teams: ["Panthers", "Browns", "Texans"]
  },
  "Bobby Hebert": {
    name: "Bobby Hebert",
    wins: 56,
    teams: ["Saints", "Falcons"]
  },
  "Dan Pastorini": {
    name: "Dan Pastorini",
    wins: 56,
    teams: ["Oilers", "Raiders", "Rams", "Eagles"]
  },
  "Milt Plum": {
    name: "Milt Plum",
    wins: 56,
    teams: ["Browns", "Lions", "Giants", "Colts"]
  },
  "Neil O'Donnell": {
    name: "Neil O'Donnell",
    wins: 55,
    teams: ["Steelers", "Jets", "Titans", "Bengals"]
  },
  "Joe Namath": {
    name: "Joe Namath",
    wins: 62,
    teams: ["Jets", "Rams"],
    ties: 4
  },
  "Danny White": {
    name: "Danny White",
    wins: 53,
    teams: ["Cowboys"]
  },
  "Jay Schroeder": {
    name: "Jay Schroeder",
    wins: 51,
    teams: ["Commanders", "Raiders", "Bengals", "Cardinals"]
  },
  "Steve Bartkowski": {
    name: "Steve Bartkowski",
    wins: 50,
    teams: ["Falcons", "Rams"]
  },
  "Charley Johnson": {
    name: "Charley Johnson",
    wins: 50,
    teams: ["Cardinals", "Oilers", "Broncos", "Chargers"]
  },
  "Trent Dilfer": {
    name: "Trent Dilfer",
    wins: 50,
    teams: ["Buccaneers", "Ravens", "Seahawks", "Browns", "49ers"]
  },
  "Frank Ryan": {
    name: "Frank Ryan",
    wins: 56,
    teams: ["Rams", "Browns", "Commanders"]
  },
  "Tommy Kramer": {
    name: "Tommy Kramer",
    wins: 54,
    teams: ["Vikings", "Saints"]
  },

  // Adding CJ Stroud and Baker Mayfield
  "C.J. Stroud": {
    name: "C.J. Stroud",
    wins: 19,
    teams: ["Texans"]
  },
  "Baker Mayfield": {
    name: "Baker Mayfield",
    wins: 50,
    teams: ["Browns", "Panthers", "Rams", "Buccaneers"]
  },

  // Adding verified QBs
  "Brandon Allen": {
    name: "Brandon Allen",
    wins: 2,
    teams: ["Broncos", "Bengals", "Titans"]
  },
  "Tyson Bagent": {
    name: "Tyson Bagent",
    wins: 2,
    teams: ["Bears"]
  },
  "Stetson Bennett": {
    name: "Stetson Bennett",
    wins: 0,
    teams: ["Rams"]
  },
  "Jacoby Brissett": {
    name: "Jacoby Brissett",
    wins: 19,
    teams: ["Patriots", "Colts", "Dolphins", "Browns", "Commanders", "Cardinals"]
  },
  "Jake Browning": {
    name: "Jake Browning",
    wins: 4,
    teams: ["Bengals"]
  },
  "Shane Buechele": {
    name: "Shane Buechele",
    wins: 0,
    teams: ["Chiefs", "Bills"]
  },
  "Sean Clifford": {
    name: "Sean Clifford",
    wins: 0,
    teams: ["Packers"]
  },
  "Sam Darnold": {
    name: "Sam Darnold",
    wins: 35,
    teams: ["Jets", "Panthers", "49ers", "Vikings", "Seahawks"]
  },
  "Tommy DeVito": {
    name: "Tommy DeVito",
    wins: 3,
    teams: ["Giants"]
  },
  "Ben DiNucci": {
    name: "Ben DiNucci",
    wins: 0,
    teams: ["Cowboys", "Broncos", "Saints"]
  },
  "Joshua Dobbs": {
    name: "Joshua Dobbs",
    wins: 3,
    teams: ["Steelers", "Jaguars", "Browns", "Titans", "Cardinals", "Vikings", "Patriots"]
  },
  "Sam Ehlinger": {
    name: "Sam Ehlinger",
    wins: 0,
    teams: ["Colts", "Broncos"]
  },
  "Jayden Daniels": {
    name: "Jayden Daniels",
    wins: 12,
    teams: ["Commanders"]
  },
  
  // Adding next set of verified QBs
  "Justin Fields": {
    name: "Justin Fields",
    wins: 14,
    teams: ["Bears", "Jets"]
  },
  "Jake Fromm": {
    name: "Jake Fromm",
    wins: 0,
    teams: ["Bills", "Giants", "Commanders", "Lions"]
  },
  "Jimmy Garoppolo": {
    name: "Jimmy Garoppolo",
    wins: 43,
    teams: ["Patriots", "49ers", "Raiders", "Rams"]
  },
  "Will Grier": {
    name: "Will Grier",
    wins: 0,
    teams: ["Panthers", "Cowboys", "Patriots"]
  },
  "Jake Haener": {
    name: "Jake Haener",
    wins: 0,
    teams: ["Saints"]
  },
  "Jaren Hall": {
    name: "Jaren Hall",
    wins: 0,
    teams: ["Vikings", "Seahawks"]
  },
  "Sam Hartman": {
    name: "Sam Hartman",
    wins: 0,
    teams: ["Commanders"]
  },
  "Taylor Heinicke": {
    name: "Taylor Heinicke",
    wins: 13,
    teams: ["Vikings", "Panthers", "Commanders", "Falcons", "Chargers"]
  },
  "Hendon Hooker": {
    name: "Hendon Hooker",
    wins: 0,
    teams: ["Lions"]
  },
  "Sam Howell": {
    name: "Sam Howell",
    wins: 4,
    teams: ["Commanders", "Seahawks"]
  },
  "Jalen Hurts": {
    name: "Jalen Hurts",
    wins: 46,
    teams: ["Eagles"]
  },
  "Daniel Jones": {
    name: "Daniel Jones",
    wins: 24,
    teams: ["Giants", "Colts"]
  },
  "Emory Jones": {
    name: "Emory Jones",
    wins: 0,
    teams: ["Falcons"]
  },
  "Mac Jones": {
    name: "Mac Jones",
    wins: 20,
    teams: ["Patriots", "49ers"]
  },
  "Trey Lance": {
    name: "Trey Lance",
    wins: 2,
    teams: ["49ers", "Cowboys", "Chargers"]
  },
  
  // Adding next set of verified QBs
  "Devin Leary": {
    name: "Devin Leary",
    wins: 0,
    teams: ["Ravens"]
  },
  "Will Levis": {
    name: "Will Levis",
    wins: 5,
    teams: ["Titans"]
  },
  "Drew Lock": {
    name: "Drew Lock",
    wins: 10,
    teams: ["Broncos", "Seahawks"]
  },
  "Adrian Martinez": {
    name: "Adrian Martinez",
    wins: 0,
    teams: ["Jets"]
  },
  "Drake Maye": {
    name: "Drake Maye",
    wins: 3,
    teams: ["Patriots"]
  },
  "J.J. McCarthy": {
    name: "J.J. McCarthy",
    wins: 0,
    teams: ["Vikings"]
  },
  "Tanner McKee": {
    name: "Tanner McKee",
    wins: 0,
    teams: ["Eagles"]
  },
  "Joe Milton III": {
    name: "Joe Milton III",
    wins: 0,
    teams: ["Cowboys"]
  },
  "Tanner Mordecai": {
    name: "Tanner Mordecai",
    wins: 0,
    teams: ["49ers"]
  },
  "Nick Mullens": {
    name: "Nick Mullens",
    wins: 5,
    teams: ["49ers", "Browns", "Vikings", "Jaguars"]
  },
  "Kyler Murray": {
    name: "Kyler Murray",
    wins: 36,
    teams: ["Cardinals"]
  },
  "Bo Nix": {
    name: "Bo Nix",
    wins: 10,
    teams: ["Broncos"]
  },
  "Aidan O'Connell": {
    name: "Aidan O'Connell",
    wins: 3,
    teams: ["Raiders"]
  },
  "Chris Oladokun": {
    name: "Chris Oladokun",
    wins: 0,
    teams: ["Steelers", "Chiefs"]
  },
  "Michael Penix Jr.": {
    name: "Michael Penix Jr.",
    wins: 0,
    teams: ["Falcons"]
  },
  
  // Adding next set of verified QBs
  "Kenny Pickett": {
    name: "Kenny Pickett",
    wins: 15,
    teams: ["Steelers", "Browns"]
  },
  "Jack Plummer": {
    name: "Jack Plummer",
    wins: 0,
    teams: ["Panthers"]
  },
  "Michael Pratt": {
    name: "Michael Pratt",
    wins: 0,
    teams: ["Buccaneers"]
  },
  "Brock Purdy": {
    name: "Brock Purdy",
    wins: 23,
    teams: ["49ers"]
  },
  "Spencer Rattler": {
    name: "Spencer Rattler",
    wins: 0,
    teams: ["Saints"]
  },
  "Austin Reed": {
    name: "Austin Reed",
    wins: 0,
    teams: ["Bears"]
  },
  "Anthony Richardson": {
    name: "Anthony Richardson",
    wins: 8,
    teams: ["Colts"]
  },
  "Mason Rudolph": {
    name: "Mason Rudolph",
    wins: 8,
    teams: ["Steelers"]
  },
  "Cooper Rush": {
    name: "Cooper Rush",
    wins: 9,
    teams: ["Cowboys", "Ravens"]
  },
  "Brett Rypien": {
    name: "Brett Rypien",
    wins: 2,
    teams: ["Broncos", "Rams", "Seahawks", "Vikings"]
  },
  "Kedon Slovis": {
    name: "Kedon Slovis",
    wins: 0,
    teams: ["Texans"]
  },
  "Geno Smith": {
    name: "Geno Smith",
    wins: 40,
    teams: ["Jets", "Giants", "Chargers", "Seahawks", "Raiders"]
  },
  "Jarrett Stidham": {
    name: "Jarrett Stidham",
    wins: 0,
    teams: ["Patriots", "Raiders", "Broncos"]
  },
  "Skylar Thompson": {
    name: "Skylar Thompson",
    wins: 1,
    teams: ["Dolphins", "Steelers"]
  },
  "Dorian Thompson-Robinson": {
    name: "Dorian Thompson-Robinson",
    wins: 1,
    teams: ["Browns", "Eagles"]
  },
  
  // Adding final set of verified QBs
  "Kyle Trask": {
    name: "Kyle Trask",
    wins: 0,
    teams: ["Buccaneers"]
  },
  "Jordan Travis": {
    name: "Jordan Travis",
    wins: 0,
    teams: ["Jets"]
  },
  "Mitchell Trubisky": {
    name: "Mitchell Trubisky",
    wins: 31,
    teams: ["Bears", "Bills", "Steelers", "Bills"]
  },
  "Clayton Tune": {
    name: "Clayton Tune",
    wins: 0,
    teams: ["Cardinals"]
  },
  "Mike White": {
    name: "Mike White",
    wins: 2,
    teams: ["Jets", "Dolphins", "Bills"]
  },
  "Caleb Williams": {
    name: "Caleb Williams",
    wins: 5,
    teams: ["Bears"]
  },
  "Malik Willis": {
    name: "Malik Willis",
    wins: 3,
    teams: ["Titans", "Packers"]
  },
  "Zach Wilson": {
    name: "Zach Wilson",
    wins: 12,
    teams: ["Jets", "Dolphins"]
  },
  "Jameis Winston": {
    name: "Jameis Winston",
    wins: 36,
    teams: ["Buccaneers", "Saints", "Giants"]
  },
  "John Wolford": {
    name: "John Wolford",
    wins: 1,
    teams: ["Rams", "Jaguars"]
  },
  "Logan Woodside": {
    name: "Logan Woodside",
    wins: 0,
    teams: ["Titans", "Falcons", "Bengals"]
  },
  "Bryce Young": {
    name: "Bryce Young",
    wins: 6,
    teams: ["Panthers"]
  },
  "Bailey Zappe": {
    name: "Bailey Zappe",
    wins: 4,
    teams: ["Patriots", "Chiefs"]
  },
  "Ken O'Brien": {
    name: "Ken O'Brien",
    wins: 50,
    teams: ["Jets", "Eagles"],
    ties: 1
  },
  "Chad Pennington": {
    name: "Chad Pennington",
    wins: 44,
    teams: ["Jets", "Dolphins"],
    ties: 0
  },
  "Richard Todd": {
    name: "Richard Todd",
    wins: 48,
    teams: ["Jets", "Saints"],
    ties: 1
  }
};

// Function to normalize team names
export const normalizeTeamName = (team: string): string => {
  // Remove city/state prefix and just keep the team name
  const parts = team.split(' ');
  return parts[parts.length - 1];
};

// Function to handle historical team transitions
export const areTeamsHistoricallyLinked = (team1: string, team2: string): boolean => {
  const normalizedTeam1 = normalizeTeamName(team1);
  const normalizedTeam2 = normalizeTeamName(team2);

  // Check direct match
  if (normalizedTeam1 === normalizedTeam2) return true;

  // Check historical links (only actual name changes)
  const historicalLinks: { [key: string]: string } = {
    'Commanders': 'Redskins',
    'Titans': 'Oilers'
  };

  return (historicalLinks[normalizedTeam1] === normalizedTeam2 || 
          historicalLinks[normalizedTeam2] === normalizedTeam1);
};

export function validateQB(qbName: string, team: string): QBData | null {
  // Try to find the closest match for the QB name
  const matchedName = findClosestMatch(qbName);
  if (!matchedName) return null;
  
  const qb = qbDatabase[matchedName];
  if (!qb) return null;
  
  // Normalize team names for comparison
  const normalizedCurrentTeam = normalizeTeamName(team);
  const normalizedQbTeams = qb.teams.map(normalizeTeamName);
  
  // Check if any of the QB's teams match historically with the current team
  const isTeamMatch = normalizedQbTeams.some(qbTeam => 
    areTeamsHistoricallyLinked(qbTeam, normalizedCurrentTeam));
  
  if (!isTeamMatch) return null;
  
  return qb;
}

// Function to format QB display name
export function formatQBDisplayName(input: string, fullName: string): string {
  const normalizedInput = input.toLowerCase().trim();
  
  // If input is a recognized nickname, show "Full Name / 'Nickname'"
  const nicknameEntry = Object.entries(QB_NICKNAMES).find(([nickname]) => 
    nickname.toLowerCase() === normalizedInput
  );
  if (nicknameEntry) {
    return `${fullName} / '${nicknameEntry[0]}'`;
  }
  
  // If input is a last name, just show the full name
  const lastNameMatch = Object.entries(qbDatabase).find(([fullName]) => {
    const lastName = fullName.split(' ').pop()?.toLowerCase();
    return lastName === normalizedInput;
  });
  if (lastNameMatch) {
    return lastNameMatch[0];
  }

  // For exact matches, show full name only
  if (normalizedInput === fullName.toLowerCase()) {
    return fullName;
  }

  // For any other case, show the full name
  return fullName;
}

export function findHighestScoringQB(team: string | null, usedQBs: string[]): QBData | null {
  if (!team) return null;
  
  let highestQB: QBData | null = null;
  let highestWins = -1;

  for (const [name, data] of Object.entries(qbDatabase)) {
    if (data.teams.includes(team) && !usedQBs.includes(name)) {
      if (data.wins > highestWins) {
        highestWins = data.wins;
        highestQB = data;
      }
    }
  }

  return highestQB;
}

// Function to find matching QBs based on input text
export function findMatchingQBs(input: string, team: string, usedQBs: string[]): { name: string; wins: number }[] {
  const normalizedInput = input.toLowerCase().trim();
  if (!normalizedInput) return [];

  const normalizedTeam = normalizeTeamName(team);
  
  return Object.entries(qbDatabase)
    .filter(([name, data]) => {
      // Skip if QB is already used
      if (usedQBs.includes(name)) return false;
      
      // Check if QB played for this team
      const normalizedQbTeams = data.teams.map(normalizeTeamName);
      if (!normalizedQbTeams.includes(normalizedTeam)) return false;
      
      // Check if name matches input
      const normalizedName = name.toLowerCase();
      return normalizedName.includes(normalizedInput);
    })
    .map(([name, data]) => ({ name, wins: data.wins }))
    .sort((a, b) => a.name.localeCompare(b.name));
} 