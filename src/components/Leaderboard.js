import React from "react";
import "./Leaderboard.css";

function Leaderboard({ atletas, wods, resultados, setResultados }) {
  const manejarCambioResultado = (nombreAtleta, wodNombre, campo, valor) => {
    setResultados((prev) => {
      const nuevo = { ...prev };
      if (!nuevo[nombreAtleta]) nuevo[nombreAtleta] = {};
      if (!nuevo[nombreAtleta][wodNombre]) nuevo[nombreAtleta][wodNombre] = {};
      nuevo[nombreAtleta][wodNombre][campo] = valor;
      return nuevo;
    });
  };

  return (
    <div className="leaderboard-container">
      <h2>PUNTAJES</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Equipo</th>
            {wods.map((wod, i) => (
              <th key={i}>{wod.nombre}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {atletas.map((atleta, i) => (
            <tr key={i}>
              <td>{atleta.nombre}</td> {/*Mostrar el nombre del atleta */}
              {wods.map((wod, j) => (
                <td key={j}>
                  <input
                    type="text"
                    placeholder="Reps"
                    value={resultados[atleta.nombre]?.[wod.nombre]?.reps || ""}
                    onChange={(e) =>
                      manejarCambioResultado(
                        atleta.nombre,
                        wod.nombre,
                        "reps",
                        e.target.value
                      )
                    }
                    className="input-reps"
                  />
                  <input
                    type="text"
                    placeholder="min:seg"
                    value={resultados[atleta.nombre]?.[wod.nombre]?.tiempo || ""}
                    onChange={(e) =>
                      manejarCambioResultado(
                        atleta.nombre,
                        wod.nombre,
                        "tiempo",
                        e.target.value
                      )
                    }
                    className="input-tiempo"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;

