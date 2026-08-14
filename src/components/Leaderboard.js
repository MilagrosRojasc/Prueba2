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

  // Aplica máscara flexible en vivo para permitir tiempos como 10:30, 10:00, 11:15, etc.
  const enmascararTiempo = (valor) => {
    if (!valor) return "";

    // Normaliza ';' por ':' y elimina cualquier caracter que no sea dígito o ':'
    const limpio = valor.replace(";", ":").replace(/[^\d:]/g, "");

    // Si el usuario escribió o insertó los dos puntos ':'
    if (limpio.includes(":")) {
      const partes = limpio.split(":");
      const min = partes[0]; // Mantiene los minutos ingresados (ej: "10", "11", "5")
      const seg = partes[1].slice(0, 2); // Máximo 2 dígitos para segundos
      return `${min}:${seg}`;
    }

    // Si solo ingresa números continuos (ej: '1030' -> '10:30', '1115' -> '11:15')
    const digitos = limpio.slice(0, 5);
    if (digitos.length <= 2) return digitos;

    const min = digitos.slice(0, digitos.length - 2);
    const seg = digitos.slice(-2);
    return `${min}:${seg}`;
  };

  // Formatea el tiempo al perder el foco (onBlur) para asegurar dos dígitos en segundos (ej: "10:0" -> "10:00")
  const formatearTiempoAlSalir = (valor) => {
    if (!valor) return "";
    const limpio = valor.replace(";", ":").trim();

    if (limpio.includes(":")) {
      const [min, seg] = limpio.split(":");
      const minVal = min || "0";
      const segVal = (seg || "00").padEnd(2, "0").slice(0, 2);
      return `${minVal}:${segVal}`;
    }

    return `${limpio}:00`;
  };

  // Convierte cualquier Time Cap del WOD al formato MM:SS
  const formatearTimeCapMMSS = (timeCap) => {
    if (!timeCap) return "";
    const limpio = timeCap.toString().trim().toLowerCase().replace(";", ":").replace(/[^\d:]/g, "");
    
    if (limpio.includes(":")) {
      const [m, s] = limpio.split(":");
      const min = parseInt(m, 10) || 0;
      const seg = (parseInt(s, 10) || 0).toString().padStart(2, "0");
      return `${min}:${seg}`;
    }

    const num = parseInt(limpio, 10);
    if (isNaN(num)) return "";
    return `${num}:00`;
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

  // Manejo de cambios en el score con máscara flexible MM:SS
  const manejarCambioResultado = (nombreAtleta, wodObj, campo, valorIngresado) => {
    const wodNombre = wodObj.nombre;
    const esAmrap = wodObj.tipo === "AMRAP";
    const repsTotalesWod = obtenerRepsTotalesWod(wodObj);

    setResultados((prev) => {
      const nuevo = { ...prev };
      if (!nuevo[nombreAtleta]) nuevo[nombreAtleta] = {};
      if (!nuevo[nombreAtleta][wodNombre]) nuevo[nombreAtleta][wodNombre] = {};

      let valorProcesado = valorIngresado;

      // Aplicar máscara de tiempo en vivo si estamos editando el campo 'tiempo'
      if (campo === "tiempo" && !esAmrap) {
        valorProcesado = enmascararTiempo(valorIngresado);
      }

      const scoreActual = {
        ...nuevo[nombreAtleta][wodNombre],
        [campo]: valorProcesado
      };

      // ----------------------------------------------------------------------
      // VALIDACIÓN FOR TIME: Si tiempo < Time Cap -> Auto-completar Reps Totales
      // ----------------------------------------------------------------------
      if (!esAmrap && campo === "tiempo") {
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
        Ingresa el tiempo en formato <strong>MM:SS</strong> (ej. 10:30, 10:00, 11:15). Los cálculos y autocompletados se aplican según la modalidad.
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
                              maxLength={6} // Permite hasta 6 caracteres (ej: 10:30, 100:00)
                              value={tiempoDisplay}
                              readOnly={esAmrap}
                              onChange={(e) =>
                                manejarCambioResultado(
                                  atleta.nombre,
                                  wod,
                                  "tiempo",
                                  e.target.value
                                )
                              }
                              onBlur={(e) => {
                                if (!esAmrap) {
                                  manejarCambioResultado(
                                    atleta.nombre,
                                    wod,
                                    "tiempo",
                                    formatearTiempoAlSalir(e.target.value)
                                  );
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
