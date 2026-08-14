import React from "react";
import "./Leaderboard.css";

function Leaderboard({ atletas = [], wods = [], resultados = {}, setResultados }) {

  // Convierte cadenas de tiempo (ej: "12:30", "12 min", "12") a segundos
  const convertirASegundos = (cadenaTiempo) => {
    if (!cadenaTiempo) return null;
    const limpio = cadenaTiempo.toString().trim().toLowerCase().replace(/[^\d:]/g, "");
    
    if (limpio.includes(":")) {
      const [min, seg] = limpio.split(":").map(Number);
      return (min || 0) * 60 + (seg || 0);
    }
    
    const num = parseInt(limpio, 10);
    return isNaN(num) ? null : num * 60; // Si es solo número, lo convierte a minutos en segundos
  };

  // Formatea el Time Cap a formato estricto MM:SS (ej: "12" -> "12:00", "12 min" -> "12:00", "12:30" -> "12:30")
  const formatearTiempoMMSS = (timeCap) => {
    if (!timeCap) return "";
    const totalSegundos = convertirASegundos(timeCap);
    if (totalSegundos === null) return "";

    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;

    const minStr = String(minutos).padStart(2, "0");
    const segStr = String(segundos).padStart(2, "0");

    return `${minStr}:${segStr}`;
  };

  // Obtener/Calcular las reps totales de un WOD (rondas * suma de reps de cada movimiento)
  const obtenerRepsTotalesWod = (wod) => {
    if (wod.repsTotales) return parseInt(wod.repsTotales, 10) || 0;
    
    const rondas = parseInt(wod.rondas, 10) || 1;
    const sumaRepsPorRonda = (wod.movimientos || []).reduce((acc, mov) => {
      return acc + (parseInt(mov.reps, 10) || 0);
    }, 0);

    return rondas * sumaRepsPorRonda;
  };

  // Determina automáticamente el badge de estado del resultado
  const obtenerEstadoAutomatico = (tiempoIngresado, timeCapWod) => {
    const segIngresados = convertirASegundos(tiempoIngresado);
    const segCap = convertirASegundos(timeCapWod);

    if (segIngresados === null || segCap === null) return null;

    if (segIngresados >= segCap) {
      return { label: "CAP", clase: "badge-cap" };
    }
    return { label: "✔ COMPLETADO", clase: "badge-completo" };
  };

  // Guardar datos ingresados con validaciones según modalidad
  const manejarCambioResultado = (nombreAtleta, wodObj, campo, valor) => {
    const wodNombre = wodObj.nombre;
    const esAmrap = wodObj.tipo === "AMRAP";
    const repsTotalesWod = obtenerRepsTotalesWod(wodObj);

    setResultados((prev) => {
      const nuevo = { ...prev };
      if (!nuevo[nombreAtleta]) nuevo[nombreAtleta] = {};
      if (!nuevo[nombreAtleta][wodNombre]) nuevo[nombreAtleta][wodNombre] = {};

      const scoreActual = {
        ...nuevo[nombreAtleta][wodNombre],
        [campo]: valor
      };

      // ----------------------------------------------------------------------
      // VALIDACIÓN 1: WOD FOR TIME
      // Si el tiempo ingresado es menor al Time Cap, autocompleta con Reps Totales
      // ----------------------------------------------------------------------
      if (!esAmrap) {
        if (campo === "tiempo") {
          const segIngresados = convertirASegundos(valor);
          const segCap = convertirASegundos(wodObj.timeCap);

          if (segIngresados !== null && segCap !== null && segIngresados < segCap) {
            if (repsTotalesWod > 0) {
              scoreActual.reps = repsTotalesWod.toString();
            }
          }
        }
      }

      // ----------------------------------------------------------------------
      // VALIDACIÓN 2: WOD AMRAP
      // El tiempo SIEMPRE se fija automáticamente al Time Cap en formato MM:SS
      // ----------------------------------------------------------------------
      if (esAmrap) {
        const tiempoFormateado = formatearTiempoMMSS(wodObj.timeCap);
        if (tiempoFormateado) {
          scoreActual.tiempo = tiempoFormateado;
        }
      }

      nuevo[nombreAtleta][wodNombre] = scoreActual;
      return nuevo;
    });
  };

  return (
    <div className="leaderboard-container">
      <h2>PUNTAJES Y RESULTADOS</h2>
      <p className="subtitulo-leaderboard">
        Ingresa el tiempo y/o las repeticiones. La plataforma calcula y autocompleta según la modalidad del WOD.
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
                    const esAmrap = wod.tipo === "AMRAP";
                    const tiempoDisplay = esAmrap 
                      ? formatearTiempoMMSS(wod.timeCap) 
                      : (scoreAtleta.tiempo || "");

                    const estadoAuto = obtenerEstadoAutomatico(scoreAtleta.tiempo || tiempoDisplay, wod.timeCap);

                    return (
                      <td key={wod.id || j}>
                        <div className="score-inputs-wrapper">
                          
                          {/* Campo Tiempo */}
                          <div className="input-block">
                            <label className="input-label">Tiempo</label>
                            <input
                              type="text"
                              placeholder="ej: 10:45"
                              value={tiempoDisplay}
                              readOnly={esAmrap} // Se bloquea en AMRAP porque el tiempo es fijo
                              onChange={(e) =>
                                manejarCambioResultado(
                                  atleta.nombre,
                                  wod,
                                  "tiempo",
                                  e.target.value
                                )
                              }
                              className={`input-score input-tiempo ${
                                esAmrap ? "input-disabled" : ""
                              }`}
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
                                  wod,
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
