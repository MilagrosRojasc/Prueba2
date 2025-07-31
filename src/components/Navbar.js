import { Link } from "react-router-dom";
import "./Navbar.css"; // si tienes estilos

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li><Link to="/atletas">Atletas</Link></li>
        <li><Link to="/wods">WODs</Link></li>
        <li><Link to="/leaderboard">Puntaje</Link></li>
        <li><Link to="/resultados">Leaderboard</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;

