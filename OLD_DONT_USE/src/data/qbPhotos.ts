export interface QBPhoto {
  name: string;
  url: string;
}

export const QB_PHOTOS: QBPhoto[] = [
  { name: "Tom Brady", url: "https://a.espncdn.com/i/headshots/nfl/players/full/2330.png" },
  { name: "Peyton Manning", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  { name: "Brett Favre", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  { name: "Drew Brees", url: "https://a.espncdn.com/i/headshots/nfl/players/full/2580.png" },
  { name: "Aaron Rodgers", url: "https://a.espncdn.com/i/headshots/nfl/players/full/8439.png" },
  { name: "John Elway", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  { name: "Dan Marino", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  { name: "Joe Montana", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  { name: "Steve Young", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  { name: "Fran Tarkenton", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  { name: "Warren Moon", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  { name: "Johnny Unitas", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  { name: "Terry Bradshaw", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  { name: "Roger Staubach", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  { name: "Troy Aikman", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  { name: "Ben Roethlisberger", url: "https://a.espncdn.com/i/headshots/nfl/players/full/5536.png" },
  { name: "Philip Rivers", url: "https://a.espncdn.com/i/headshots/nfl/players/full/5529.png" },
  { name: "Eli Manning", url: "https://a.espncdn.com/i/headshots/nfl/players/full/5526.png" },
  { name: "Matt Ryan", url: "https://a.espncdn.com/i/headshots/nfl/players/full/8436.png" },
  { name: "Matthew Stafford", url: "https://a.espncdn.com/i/headshots/nfl/players/full/2577417.png" },
  { name: "Kirk Cousins", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  { name: "Derek Carr", url: "https://a.espncdn.com/i/headshots/nfl/players/full/16768.png" },
  { name: "Dak Prescott", url: "https://a.espncdn.com/i/headshots/nfl/players/full/2979549.png" },
  { name: "Lamar Jackson", url: "https://a.espncdn.com/i/headshots/nfl/players/full/3915517.png" },
  { name: "Josh Allen", url: "https://a.espncdn.com/i/headshots/nfl/players/full/3916387.png" },
  { name: "Joe Burrow", url: "https://a.espncdn.com/i/headshots/nfl/players/full/3915517.png" },
  { name: "Justin Herbert", url: "https://a.espncdn.com/i/headshots/nfl/players/full/3915517.png" },
  { name: "Tua Tagovailoa", url: "https://a.espncdn.com/i/headshots/nfl/players/full/3915517.png" },
  { name: "Trevor Lawrence", url: "https://a.espncdn.com/i/headshots/nfl/players/full/3915517.png" },
  { name: "Patrick Mahomes", url: "https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png" },
  { name: "Steve McNair", url: "https://a.espncdn.com/i/headshots/nfl/players/full/14876.png" },
  // Add more QBs as needed
];

export function getQBPhoto(qbName: string): string | undefined {
  return QB_PHOTOS.find(photo => photo.name === qbName)?.url;
} 