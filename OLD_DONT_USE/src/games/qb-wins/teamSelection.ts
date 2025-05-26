import { NFL_TEAMS } from '../../data/teams';

let recentTeams: string[] = [];

export const selectNextTeam = (): string => {
  // Filter out recently used teams
  const availableTeams = NFL_TEAMS.filter((team: string) => !recentTeams.includes(team));
  
  // If all teams have been used recently, reset the recent teams list
  if (availableTeams.length === 0) {
    recentTeams = [];
    return NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
  }
  
  // Select a random team from available teams
  const selectedTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
  
  // Add to recent teams and maintain list size
  recentTeams.push(selectedTeam);
  if (recentTeams.length > 5) {
    recentTeams.shift();
  }
  
  return selectedTeam;
}; 