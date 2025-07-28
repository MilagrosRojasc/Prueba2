// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Leaderboard from './components/Leaderboard';
import Atletas from './components/Atletas';
import Wods from './components/Wods';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Leaderboard />} />
          <Route path="/atletas" element={<Atletas />} />
          <Route path="/wods" element={<Wods />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
