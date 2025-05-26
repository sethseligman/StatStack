import { teamColors } from '../data/teamColors';
import { getTeamLogo as getESPNTeamLogo } from '../data/teamLogos';

/**
 * Returns the appropriate Tailwind CSS border color class for a given team name
 * @param teamName - The name of the NFL team
 * @returns A Tailwind CSS class for border color
 */
export function getTeamColorClass(teamName: string): string {
  const colorClass = teamColors[teamName];
  if (!colorClass) return 'border-neutral-200 dark:border-neutral-700';
  return colorClass.replace('text-', 'border-');
}

/**
 * Returns the URL to the team logo image for a given team name
 * @param teamName - The name of the NFL team
 * @returns The URL to the team logo image
 */
export function getTeamLogo(teamName: string): string {
  return getESPNTeamLogo(teamName) || '/team-logos/nfl.png';
}

/**
 * Returns a fallback image path if the team logo is not found
 * @returns The path to the fallback image
 */
export function getFallbackLogo(): string {
  return '/team-logos/nfl.png';
} 