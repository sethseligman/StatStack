import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface SpecialEffectsProps {
  isVisible: boolean;
  score: number;
  onComplete: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Container = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: none;
  animation: ${props => props.isVisible ? fadeIn : fadeOut} 0.3s ease-in-out;
`;

const ScorePopup = styled.div`
  background: rgba(74, 144, 226, 0.9);
  color: white;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 24px;
  font-weight: bold;
  animation: ${slideUp} 0.3s ease-out;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const BradyEffect = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #ffd700, #ffa500);
  opacity: 0.2;
  z-index: 999;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const HalftimeEffect = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #4a90e2, #357abd);
  opacity: 0.2;
  z-index: 999;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

export const SpecialEffects: React.FC<SpecialEffectsProps> = ({
  isVisible,
  score,
  onComplete
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <Container isVisible={isVisible}>
      <ScorePopup>
        +{score}
      </ScorePopup>
    </Container>
  );
};

export const BradyModeEffect: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null;
  return <BradyEffect />;
};

export const HalftimeModeEffect: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null;
  return <HalftimeEffect />;
}; 