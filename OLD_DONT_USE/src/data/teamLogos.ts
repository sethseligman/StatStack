export interface TeamLogo {
  name: string;
  url: string;
}

export const TEAM_LOGOS: TeamLogo[] = [
  { name: "Arizona Cardinals", url: "https://a.espncdn.com/i/teamlogos/nfl/500/ari.png" },
  { name: "Atlanta Falcons", url: "https://a.espncdn.com/i/teamlogos/nfl/500/atl.png" },
  { name: "Baltimore Ravens", url: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
  { name: "Buffalo Bills", url: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
  { name: "Carolina Panthers", url: "https://a.espncdn.com/i/teamlogos/nfl/500/car.png" },
  { name: "Chicago Bears", url: "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png" },
  { name: "Cincinnati Bengals", url: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png" },
  { name: "Cleveland Browns", url: "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png" },
  { name: "Dallas Cowboys", url: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
  { name: "Denver Broncos", url: "https://a.espncdn.com/i/teamlogos/nfl/500/den.png" },
  { name: "Detroit Lions", url: "https://a.espncdn.com/i/teamlogos/nfl/500/det.png" },
  { name: "Green Bay Packers", url: "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png" },
  { name: "Houston Texans", url: "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png" },
  { name: "Indianapolis Colts", url: "https://a.espncdn.com/i/teamlogos/nfl/500/ind.png" },
  { name: "Jacksonville Jaguars", url: "https://a.espncdn.com/i/teamlogos/nfl/500/jax.png" },
  { name: "Kansas City Chiefs", url: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png" },
  { name: "Las Vegas Raiders", url: "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png" },
  { name: "Los Angeles Chargers", url: "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png" },
  { name: "Los Angeles Rams", url: "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png" },
  { name: "Miami Dolphins", url: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png" },
  { name: "Minnesota Vikings", url: "https://a.espncdn.com/i/teamlogos/nfl/500/min.png" },
  { name: "New England Patriots", url: "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png" },
  { name: "New Orleans Saints", url: "https://a.espncdn.com/i/teamlogos/nfl/500/no.png" },
  { name: "New York Giants", url: "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png" },
  { name: "New York Jets", url: "https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png" },
  { name: "Philadelphia Eagles", url: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
  { name: "Pittsburgh Steelers", url: "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png" },
  { name: "San Francisco 49ers", url: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png" },
  { name: "Seattle Seahawks", url: "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png" },
  { name: "Tampa Bay Buccaneers", url: "https://a.espncdn.com/i/teamlogos/nfl/500/tb.png" },
  { name: "Tennessee Titans", url: "https://a.espncdn.com/i/teamlogos/nfl/500/ten.png" },
  { name: "Washington Commanders", url: "https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png" }
];

export function getTeamLogo(teamName: string | null): string | undefined {
  if (!teamName) return undefined;
  return TEAM_LOGOS.find(logo => logo.name === teamName)?.url;
} 