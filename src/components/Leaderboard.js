import React from "react";
import "./Leaderboard.css";

function Leaderboard({ atletas = [], wods = [], resultados = {}, setResultados }) {

  // Convierte cadenas "MM:SS" o "M:SS" a segundos para comparaciones
  const convertirMMSSASegundos = (cadenaTiempo) => {
    if (!cadenaTiempo || typeof cadenaTiempo !== "string") return null;
    
    const limpio = cadenaTiempo.replace(";", ":").trim();
    const partes = limpio.split(":");
    if (partes.length !== 2) return null;

    const min = parseInt(partes[0], 10);
    const seg = parseInt(partes[1], 10);

    if (isNaN(min) || isNaN(seg) || seg >= 60) return null;
    return min * 60 + seg;
  };

  // Limpieza en vivo: Máximo 4 dígitos numéricos en total
  const limpiarEntradaEnVivo = (valor) => {
    if (!valor) return "";
    
    // Normaliza ';' por ':' y remueve todo lo que no sea número o ':'
    const limpio = valor.replace(";", ":").replace(/[^\d:]/g, "");

    if (limpio.includes(":")) {
      const [min, seg] = limpio.split(":");
      const minNum = min.slice(0, 2); // Máximo 2 dígitos para minutos
      const segNum = (seg || "").slice(0, 2); // Máximo 2 dígitos para segundos
      return `${minNum}:${segNum}`;
    }

    // Si solo escribe números continuos, limita estrictamente a máximo 4 dígitos (ej: 1030)
    return limpio.slice(0, 4);
  };

  // Valida y formatea a tiempo real MM:SS únicamente al presionar Enter o salir (onBlur)
  const formatearTiempoFinal = (valor) => {
    if (!valor) return "";
    const limpio = valor.replace(";", ":").trim().replace(/[^\d:]/g, "");

    if (!limpio) return "";

    let min = 0;
    let seg = 0;

    // Si el usuario incluyó los dos puntos ':' (ej: "10:30", "10:5", "10:")
    if (limpio.includes(":")) {
      const [m, s] = limpio.split(":");
      min = parseInt(m, 10) || 0;
      seg = parseInt(s || "0", 10);
    } else {
      // Si solo ingresó dígitos continuos (ej: '1030', '930', '10')
      if (limpio.length <= 2) {
        min = parseInt(limpio, 10) || 0;
        seg = 0;
      } else {
        const minStr = limpio.slice(0, limpio.length - 2);
        const segStr = limpio.slice(-2);
        min = parseInt(minStr, 10) || 0;
        seg = parseInt(segStr, 10) || 0;
      }
    }

    // VALIDACIÓN DE TIEMPO REAL: Los segundos deben ser estrictamente entre 0 y 59
    if (seg >= 60) {
      alert("Tiempo inválido: Los segundos deben ser menores a 60 (ejemplo: 10:30, 09:59).");
      return ""; // Borra la entrada inválida
    }

    const minFormatted = min.toString().padStart(2, "0");
    const segFormatted = seg.toString().padStart(2, "0");

    return `${minFormatted}:${segFormatted}`;
  };

  // Convierte cualquier Time Cap del WOD al formato MM:SS
  const formatearTimeCapMMSS = (timeCap) => {
    if (!timeCap) return "";
    const limpio = timeCap.toString().trim().toLowerCase().replace(";", ":").replace(/[^\d:]/g, "");
    
    if (limpio.includes(":")) {
      const [m, s] = limpio.split(":");
      const min = (parseInt(m, 10) || 0).toString().padStart(2, "0");
      const seg = (parseInt(s, 10) || 0).toString().padStart(2, "0");
      return `${min}:${seg}`;
    }

    const num = parseInt(limpio, 10);
    if (isNaN(num)) return "";
    return `${num.toString().padStart(2, "0")}:00`;
  };

  // Obtener/Calcular las reps totales de un WOD
  const obtenerRepsTotalesWod = (wod) => {
    if (wod.repsTotales) return parseInt(wod.repsTotales, 10) || 0;
    
    const rondas = parseInt(wod.rondas, 10) || 1;
    const sumaRepsPorRonda = (wod.movimientos || []).reduce((acc, mov) => {
      return acc + (parseInt(mov.reps, 10) || 0);
    }, 0);

    return rondas * sumaRepsPorRonda;
  };

  // Determina automáticamente el badge de estado (CAP / COMPLETADO)
  const obtenerEstadoAutomatico = (tiempoIngresado, timeCapWod) => {
    const segIngresados = convertirMMSSASegundos(tiempoIngresado);
    const segCap = convertirMMSSASegundos(formatearTimeCapMMSS(timeCapWod));

    if (segIngresados === null || segCap === null) return null;

    if (segIngresados >= segCap) {
      return { label: "CAP", clase: "badge-cap" };
    }
    return { label: "✔ COMPLETADO", clase: "badge-completo" };
  };

  // Manejo de cambios en el score
  const manejarCambioResultado = (nombreAtleta, wodObj, campo, valorIngresado, esFinal = false) => {
    const wodNombre = wodObj.nombre;
    const esAmrap = wodObj.tipo === "AMRAP";
    const repsTotalesWod = obtenerRepsTotalesWod(wodObj);

    setResultados((prev) => {
      const nuevo = { ...prev };
      if (!nuevo[nombreAtleta]) nuevo[nombreAtleta] = {};
      if (!nuevo[nombreAtleta][wodNombre]) nuevo[nombreAtleta][wodNombre] = {};

      let valorProcesado = valorIngresado;

      if (campo === "tiempo" && !esAmrap) {
        valorProcesado = esFinal ? formatearTiempoFinal(valorIngresado) : limpiarEntradaEnVivo(valorIngresado);
      }

      const scoreActual = {
        ...nuevo[nombreAtleta][wodNombre],
        [campo]: valorProcesado
      };

      // ----------------------------------------------------------------------
      // VALIDACIÓN FOR TIME: Si tiempo < Time Cap -> Auto-completar Reps Totales
      // ----------------------------------------------------------------------
      if (!esAmrap && campo === "tiempo" && esFinal) {
        const segIngresados = convertirMMSSASegundos(valorProcesado);
        const segCap = convertirMMSSASegundos(formatearTimeCapMMSS(wodObj.timeCap));

        if (segIngresados !== null && segCap !== null && segIngresados < segCap) {
          if (repsTotalesWod > 0) {
            scoreActual.reps = repsTotalesWod.toString();
          }
        }
      }

      // ----------------------------------------------------------------------
      // VALIDACIÓN AMRAP: Forzar siempre el Time Cap en MM:SS
      // ----------------------------------------------------------------------
      if (esAmrap) {
        scoreActual.tiempo = formatearTimeCapMMSS(wodObj.timeCap);
      }

      nuevo[nombreAtleta][wodNombre] = scoreActual;
      return nuevo;
    });
  };

  return (
    <div className="leaderboard-container">
      <h2>PUNTAJES Y RESULTADOS</h2>
      <p className="subtitulo-leaderboard">
        Ingresa 4 dígitos (ej: <strong>1030</strong> para 10:30 o <strong>1115</strong> para 11:15).
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
                        {wod.timeCap ? ` (${formatearTimeCapMMSS(wod.timeCap)})` : ""}
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
                      ? formatearTimeCapMMSS(wod.timeCap) 
                      : (scoreAtleta.tiempo || "");

                    const estadoAuto = obtenerEstadoAutomatico(
                      tiempoDisplay, 
                      wod.timeCap
                    );

                    return (
                      <td key={wod.id || j}>
                        <div className="score-inputs-wrapper">
                          
                          {/* Campo Tiempo */}
                          <div className="input-block">
                            <label className="input-label">Tiempo (mm:ss)</label>
                            <input
                              type="text"
                              placeholder="10:00"
                              maxLength={5} // Permite hasta 4 dígitos + ':' (o 4 dígitos continuos)
                              value={tiempoDisplay}
                              readOnly={esAmrap}
                              onChange={(e) =>
                                manejarCambioResultado(
                                  atleta.nombre,
                                  wod,
                                  "tiempo",
                                  e.target.value,
                                  false
                                )
                              }
                              onBlur={(e) => {
                                if (!esAmrap) {
                                  manejarCambioResultado(
                                    atleta.nombre,
                                    wod,
                                    "tiempo",
                                    e.target.value,
                                    true
                                  );
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !esAmrap) {
                                  e.target.blur();
                                }
                              }}
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
                                  e.target.value,
                                  false
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
