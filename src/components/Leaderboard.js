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

    if (isNaN(min) || isNaN(seg)) return null;
    return min * 60 + seg;
  };

  // Limpieza suave mientras el usuario escribe (NO formatea con ':' en vivo para permitir escribir 1000 libremente)
  const limpiarEntradaEnVivo = (valor) => {
    if (!valor) return "";
    // Reemplaza ';' por ':' y remueve caracteres que no sean dígitos o ':'
    return valor.replace(";", ":").replace(/[^\d:]/g, "");
  };

  // Formatea el tiempo únicamente al salir del input (onBlur) o presionar Enter (ej: '1000' -> '10:00', '1030' -> '10:30', '930' -> '09:30')
  const formatearTiempoFinal = (valor) => {
    if (!valor) return "";
    const limpio = valor.replace(";", ":").trim().replace(/[^\d:]/g, "");

    if (!limpio) return "";

    // Si el usuario ya ingresó dos puntos ':' (ej: "10:0", "10:30", "10:")
    if (limpio.includes(":")) {
      const [min, seg] = limpio.split(":");
      const minVal = min ? parseInt(min, 10).toString().padStart(2, "0") : "00";
      const segVal = (seg || "00").padEnd(2, "0").slice(0, 2);
      return `${minVal}:${segVal}`;
    }

    // Si solo ingresó números continuos (ej: '1000', '1030', '930', '5')
    if (limpio.length <= 2) {
      // Si pone '5' -> '05:00', si pone '10' -> '10:00'
      const minVal = parseInt(limpio, 10).toString().padStart(2, "0");
      return `${minVal}:00`;
    }

    // Si pone '1000' -> min '10', seg '00' | Si pone '930' -> min '09', seg '30'
    const minStr = limpio.slice(0, limpio.length - 2);
    const segStr = limpio.slice(-2);

    const minVal = parseInt(minStr, 10).toString().padStart(2, "0");
    const segVal = segStr.padEnd(2, "0").slice(0, 2);

    return `${minVal}:${segVal}`;
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
        Ingresa el tiempo (ej. escribe <strong>1000</strong> para 10:00 o <strong>1030</strong> para 10:30 y presiona Enter o haz clic afuera).
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
                              maxLength={7}
                              value={tiempoDisplay}
                              readOnly={esAmrap}
                              onChange={(e) =>
                                manejarCambioResultado(
                                  atleta.nombre,
                                  wod,
                                  "tiempo",
                                  e.target.value,
                                  false // No finaliza formato todavía
                                )
                              }
                              onBlur={(e) => {
                                if (!esAmrap) {
                                  manejarCambioResultado(
                                    atleta.nombre,
                                    wod,
                                    "tiempo",
                                    e.target.value,
                                    true // Aplica formato final MM:SS al salir
                                  );
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !esAmrap) {
                                  e.target.blur(); // Dispara el onBlur para formatear y salir
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
