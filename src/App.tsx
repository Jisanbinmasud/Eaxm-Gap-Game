import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TournamentProvider } from './TournamentContext';
import { Home } from './Home';
import { AdminPage } from './AdminPage';

export default function App() {
  return (
    <TournamentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </TournamentProvider>
  );
}
