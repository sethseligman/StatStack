import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useMediaQuery } from 'react-responsive';

// Animation for the score to rise up, pause, then move to final position
const scoreAnimation = (isMobile: boolean) => keyframes`
  0% {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
  20% {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  60% {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    top: ${isMobile ? '64px' : '50%'};
    left: ${isMobile ? 'calc(100% - 100px)' : '44%'};
    transform: ${isMobile ? 
      'translate(-50%, -50%) scale(0.2)' : 
      'translate(-50%, -50%) scale(0.2)'};
    opacity: 0;
  }
`;

const glow = keyframes`
  0% {
    text-shadow: 0 0 20px rgba(76, 175, 80, 0.8), 0 0 40px rgba(76, 175, 80, 0.6);
  }
  50% {
    text-shadow: 0 0 30px rgba(76, 175, 80, 1), 0 0 50px rgba(76, 175, 80, 0.8);
  }
  100% {
    text-shadow: 0 0 20px rgba(76, 175, 80, 0.8), 0 0 40px rgba(76, 175, 80, 0.6);
  }
`;

const ScoreContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  pointer-events: none;
  display: ${props => props.isVisible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;

const ScoreText = styled.div<{ isMobile: boolean }>`
  position: absolute;
  font-size: ${props => props.isMobile ? '120px' : '160px'};
  font-weight: 900;
  color: #4CAF50;
  animation: ${props => scoreAnimation(props.isMobile)} 500ms ease-out forwards,
             ${glow} 0.5s ease-in-out infinite;
  text-align: center;
  text-shadow: 0 0 20px rgba(76, 175, 80, 0.8), 0 0 40px rgba(76, 175, 80, 0.6);
  -webkit-text-stroke: 2px white;
  will-change: transform, opacity;
`;

interface ScoreDisplayProps {
  score: number;
  onAnimationComplete: () => void;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  onAnimationComplete
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    // Small delay before showing to prevent double animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // Animation duration is now 500ms
    const animationTimer = setTimeout(() => {
      setIsVisible(false);
      onAnimationComplete();
    }, 500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(animationTimer);
    };
  }, [score, onAnimationComplete]);

  return (
    <ScoreContainer isVisible={isVisible}>
      <ScoreText isMobile={isMobile}>+{score}</ScoreText>
    </ScoreContainer>
  );
};

export default ScoreDisplay; 