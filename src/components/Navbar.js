// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">WOD Scoreboard</h1>
      <ul className="nav-links">
        <li><Link to="/">Leaderboard</Link></li>
        <li><Link to="/atletas">Atletas</Link></li>
        <li><Link to="/wods">WODs</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
