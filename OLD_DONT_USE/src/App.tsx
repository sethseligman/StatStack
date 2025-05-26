import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { LobbyPage } from './pages/LobbyPage';
import QBGame from './games/qb-wins/QBGame';
import { LeaderboardPage } from './pages/Leaderboard';
import { Admin } from './pages/Admin';
import { TestEffects } from './pages/TestEffects';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/game/qb-wins" element={<QBGame />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/test-effects" element={<TestEffects />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App; 