import React from "react";
import "./Leaderboard.css";

function Leaderboard({ atletas = [], wods = [], resultados = {}, setResultados }) {

  // Función para guardar el resultado de un atleta en un WOD específico
  const manejarCambioResultado = (nombreAtleta, wodNombre, valor) => {
    setResultados((prev) => {
      const nuevo = { ...prev };
      if (!nuevo[nombreAtleta]) nuevo[nombreAtleta] = {};
      nuevo[nombreAtleta][wodNombre] = valor;
      return nuevo;
    });
  };

  return (
    <div className="leaderboard-container">
      <h2>PUNTAJES Y RESULTADOS</h2>
      <p className="subtitulo-leaderboard">
        Ingresa el tiempo (ej: <code>08:30</code>) o <code>CAP + reps</code> para For Time, y total de reps para AMRAP.
      </p>

      {atletas.length === 0 || wods.length === 0 ? (
        <p className="mensaje-vacio">
          Debes registrar al menos un atleta y un WOD para ingresar puntajes.
        </p>
      ) : (
        <div className="tabla-responsive">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Atleta / Equipo</th>
                {wods.map((wod, i) => (
                  <th key={wod.id || i}>
                    <div className="wod-header-cell">
                      <span>{wod.nombre || `WOD ${i + 1}`}</span>
                      <small className="badge-tipo">
                        {wod.tipo === "AMRAP" ? "AMRAP" : "For Time"}
                        {wod.timeCap ? ` (${wod.timeCap})` : ""}
                      </small>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {atletas.map((atleta, i) => (
                <tr key={atleta.id || i}>
                  <td className="atleta-celda">
                    <strong>{atleta.nombre}</strong>
                  </td>
                  {wods.map((wod, j) => {
                    const esAmrap = wod.tipo === "AMRAP";
                    const valorActual = resultados[atleta.nombre]?.[wod.nombre] || "";

                    return (
                      <td key={wod.id || j}>
                        <div className="input-score-container">
                          <input
                            type="text"
                            placeholder={
                              esAmrap
                                ? "Reps (ej: 185)"
                                : "Tiempo o CAP + reps"
                            }
                            value={valorActual}
                            onChange={(e) =>
                              manejarCambioResultado(
                                atleta.nombre,
                                wod.nombre,
                                e.target.value
                              )
                            }
                            className={`input-score ${esAmrap ? "amrap" : "fortime"}`}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
