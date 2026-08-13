import React from "react";
import "./Leaderboard.css";

function Leaderboard({ atletas = [], wods = [], resultados = {}, setResultados }) {

  // Convierte textos de tiempo (ej: "12:30", "12 min", "12") a segundos
  const convertirASegundos = (cadenaTiempo) => {
    if (!cadenaTiempo) return null;
    const limpio = cadenaTiempo.toString().trim().toLowerCase().replace(/[^\d:]/g, "");
    
    if (limpio.includes(":")) {
      const [min, seg] = limpio.split(":").map(Number);
      return (min || 0) * 60 + (seg || 0);
    }
    
    const num = parseInt(limpio, 10);
    return isNaN(num) ? null : num * 60; // Si es solo número, lo toma como minutos
  };

  // Determina automáticamente el estado del resultado
  const obtenerEstadoAutomatico = (tiempoIngresado, timeCapWod) => {
    const segIngresados = convertirASegundos(tiempoIngresado);
    const segCap = convertirASegundos(timeCapWod);

    if (segIngresados === null || segCap === null) return null;

    if (segIngresados >= segCap) {
      return { label: "CAP", clase: "badge-cap" };
    }
    return { label: "✔ COMPLETADO", clase: "badge-completo" };
  };

  // Guardar datos ingresados
  const manejarCambioResultado = (nombreAtleta, wodNombre, campo, valor) => {
    setResultados((prev) => {
      const nuevo = { ...prev };
      if (!nuevo[nombreAtleta]) nuevo[nombreAtleta] = {};
      if (!nuevo[nombreAtleta][wodNombre]) nuevo[nombreAtleta][wodNombre] = {};

      nuevo[nombreAtleta][wodNombre] = {
        ...nuevo[nombreAtleta][wodNombre],
        [campo]: valor
      };

      return nuevo;
    });
  };

  return (
    <div className="leaderboard-container">
      <h2>PUNTAJES Y RESULTADOS</h2>
      <p className="subtitulo-leaderboard">
        Ingresa el tiempo y las repeticiones. El estado (CAP / Completado) se detecta automáticamente.
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
                    const scoreAtleta = resultados[atleta.nombre]?.[wod.nombre] || {};
                    const estadoAuto = obtenerEstadoAutomatico(scoreAtleta.tiempo, wod.timeCap);

                    return (
                      <td key={wod.id || j}>
                        <div className="score-inputs-wrapper">
                          
                          {/* Campo Tiempo */}
                          <div className="input-block">
                            <label className="input-label">Tiempo</label>
                            <input
                              type="text"
                              placeholder="ej: 10:45"
                              value={scoreAtleta.tiempo || ""}
                              onChange={(e) =>
                                manejarCambioResultado(
                                  atleta.nombre,
                                  wod.nombre,
                                  "tiempo",
                                  e.target.value
                                )
                              }
                              className="input-score input-tiempo"
                            />
                          </div>

                          {/* Campo Reps */}
                          <div className="input-block">
                            <label className="input-label">Reps Logradas</label>
                            <input
                              type="text"
                              placeholder="ej: 150"
                              value={scoreAtleta.reps || ""}
                              onChange={(e) =>
                                manejarCambioResultado(
                                  atleta.nombre,
                                  wod.nombre,
                                  "reps",
                                  e.target.value
                                )
                              }
                              className="input-score input-reps"
                            />
                          </div>

                        </div>

                        {/* Estado generado automáticamente */}
                        {estadoAuto && (
                          <div className={`status-badge ${estadoAuto.clase}`}>
                            {estadoAuto.label}
                          </div>
                        )}
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
