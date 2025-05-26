import { getTeamLogo, getFallbackLogo } from '../utils/teams';
import styled from 'styled-components';

interface TeamDisplayProps {
  team: string;
  isShuffling: boolean;
  showScore: boolean;
  totalScore: number;
  showBradyEffect: boolean;
  showHalftimeEffect: boolean;
  shufflingTeam?: string;
  startNextRound?: () => void;
  setShowBradyEffect?: (show: boolean) => void;
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
`;

const LogoContainer = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img<{ isVisible: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.3s;
  opacity: ${props => props.isVisible ? 1 : 0};
  position: ${props => props.isVisible ? 'relative' : 'absolute'};
`;

const TeamName = styled.h2`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0;
`;

const Score = styled.div`
  font-size: 48px;
  font-weight: bold;
  text-align: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.variant === 'primary' ? '#4a90e2' : '#3a3a3a'};
  color: white;
  border: none;

  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#357abd' : '#4a4a4a'};
  }
`;

const EffectButton = styled(Button)<{ isActive: boolean }>`
  background-color: ${props => props.isActive ? '#4CAF50' : '#3a3a3a'};
  
  &:hover {
    background-color: ${props => props.isActive ? '#45a049' : '#4a4a4a'};
  }
`;

export default function TeamDisplay({
  team,
  isShuffling,
  showScore,
  totalScore,
  showBradyEffect,
  showHalftimeEffect,
  shufflingTeam,
  startNextRound,
  setShowBradyEffect
}: TeamDisplayProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = getFallbackLogo();
  };

  return (
    <Container>
      <LogoContainer>
        <Logo
          src={getTeamLogo(team)}
          alt={team}
          onError={handleImageError}
          isVisible={!isShuffling}
        />
        {shufflingTeam && (
          <Logo
            src={getTeamLogo(shufflingTeam)}
            alt={shufflingTeam}
            onError={handleImageError}
            isVisible={isShuffling}
          />
        )}
      </LogoContainer>

      <TeamName>{team}</TeamName>

      {showScore && (
        <Score>{totalScore}</Score>
      )}

      {startNextRound && (
        <Button variant="primary" onClick={startNextRound}>
          Start Next Round
        </Button>
      )}

      {setShowBradyEffect && (
        <EffectButton
          isActive={showBradyEffect}
          onClick={() => setShowBradyEffect(!showBradyEffect)}
        >
          {showBradyEffect ? 'Brady Effect: ON' : 'Brady Effect: OFF'}
        </EffectButton>
      )}
    </Container>
  );
} 