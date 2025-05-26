import React from 'react';
import styled from 'styled-components';
import { QB } from '../games/qb-wins/QBGameEngine';

interface GameOverProps {
  onBackToLobby: () => void;
  finalScore: number;
  picks: QB[];
  isDailyMode: boolean;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  color: white;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  text-align: center;
`;

const Score = styled.div`
  font-size: 48px;
  font-weight: bold;
  text-align: center;
  margin: 24px 0;
  color: #4a90e2;
`;

const PicksList = styled.div`
  margin: 24px 0;
  max-height: 200px;
  overflow-y: auto;
`;

const PickItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #3a3a3a;

  &:last-child {
    border-bottom: none;
  }
`;

const Button = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  margin-top: 16px;

  &:hover {
    background: #357abd;
  }
`;

export const GameOver: React.FC<GameOverProps> = ({
  onBackToLobby,
  finalScore,
  picks,
  isDailyMode
}) => {
  return (
    <Overlay>
      <Modal>
        <Title>Game Over!</Title>
        <Score>{finalScore}</Score>
        <PicksList>
          {picks.map((pick, index) => (
            <PickItem key={index}>
              <span>{pick.displayName}</span>
              <span>{pick.wins} wins</span>
            </PickItem>
          ))}
        </PicksList>
        {isDailyMode && (
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            Daily Challenge Complete!
          </div>
        )}
        <Button onClick={onBackToLobby}>
          Back to Lobby
        </Button>
      </Modal>
    </Overlay>
  );
}; 