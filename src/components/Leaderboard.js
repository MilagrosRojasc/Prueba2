import React from "react";
import "./Leaderboard.css"; // si quieres estilizarlo

function Leaderboard({ wods }) {
  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>

      {wods.length === 0 ? (
        <p>No hay WODs agregados aún.</p>
      ) : (
        <ul>
          {wods.map((wod, index) => (
            <li key={index}>{wod}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Leaderboard;
