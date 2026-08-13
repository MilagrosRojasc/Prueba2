import React, { useState, useMemo } from "react";
import "./Resultados.css";

const categoriasDisponibles = [
  "Dupla Iniciado",
  "Dupla Escalado",
  "Dupla Avanzado",
];

// ============================================================================
// FUNCIONES AUXILIARES DE PROCESAMIENTO
// ============================================================================

const tiempoASegundos = (cadenaTiempo) => {
  if (!cadenaTiempo) return Infinity;
  const limpio = cadenaTiempo.toString().trim().toUpperCase();
  if (limpio === "CAP" || limpio === "") return Infinity;

  const partes = limpio.split(":");
  if (partes.length === 2) {
    const min = parseInt(partes[0], 10) || 0;
    const seg = parseInt(partes[1], 10) || 0;
    return min * 60 + seg;
  }
  const num = parseInt(limpio, 10);
  return isNaN(num) ? Infinity : num * 60;
};

const parsearReps = (cadenaReps) => {
  if (!cadenaReps) return 0;
  const num = parseInt(cadenaReps.toString().replace(/[^\d]/g, ""), 10);
  return isNaN(num) ? 0 : num;
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
function Resultados({ atletas = [], wods = [], resultados = {} }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    categoriasDisponibles[0]
  );

  const atletasFiltrados = useMemo(() => {
    return atletas.filter((a) => a.categoria === categoriaSeleccionada);
  }, [atletas, categoriaSeleccionada]);

  // ALGORITMO OFICIAL DE RANKING
  const { rankingFinal, puntuacionesPorWOD } = useMemo(() => {
    const puntuacionesTotales = {};
    const puntuacionesPorWOD = {};
    const historialPosiciones = {};

    atletasFiltrados.forEach((a) => {
      puntuacionesTotales[a.nombre] = 0;
      puntuacionesPorWOD[a.nombre] = {};
      historialPosiciones[a.nombre] = [];
    });

    wods.forEach((wod) => {
      const timeCapSegundos = tiempoASegundos(wod.timeCap);
      const esAmrap = wod.tipo === "AMRAP";

      const tablaWod = atletasFiltrados.map((atleta) => {
        const data = resultados[atleta.nombre]?.[wod.nombre] || {};
        const segundos = tiempoASegundos(data.tiempo);
        const reps = parsearReps(data.reps);

        const terminoATiempo =
          !esAmrap && segundos !== Infinity && segundos < timeCapSegundos;

        return {
          atleta: atleta.nombre,
          segundos,
          reps,
          terminoATiempo,
        };
      });

      tablaWod.sort((a, b) => {
        if (esAmrap) {
          return b.reps - a.reps;
        } else {
          if (a.terminoATiempo && b.terminoATiempo) {
            return a.segundos - b.segundos;
          }
          if (a.terminoATiempo && !b.terminoATiempo) return -1;
          if (!a.terminoATiempo && b.terminoATiempo) return 1;

          if (b.reps !== a.reps) {
            return b.reps - a.reps;
          }
          return a.segundos - b.segundos;
        }
      });

      tablaWod.forEach((res, i) => {
        let posicion = i + 1;

        if (i > 0) {
          const prev = tablaWod[i - 1];
          const esEmpate = esAmrap
            ? res.reps === prev.reps
            : res.terminoATiempo === prev.terminoATiempo &&
              res.segundos === prev.segundos &&
              res.reps === prev.reps;

          if (esEmpate) {
            posicion = puntuacionesPorWOD[prev.atleta][wod.nombre];
          }
        }

        puntuacionesPorWOD[res.atleta][wod.nombre] = posicion;
        puntuacionesTotales[res.atleta] += posicion;
        historialPosiciones[res.atleta].push(posicion);
      });
    });

    const rankingFinal = Object.entries(puntuacionesTotales).sort((a, b) => {
      const atletaA = a[0];
      const atletaB = b[0];
      const puntosA = a[1];
      const puntosB = b[1];

      if (puntosA !== puntosB) {
        return puntosA - puntosB;
      }

      const puestosA = [...historialPosiciones[atletaA]].sort((x, y) => x - y);
      const puestosB = [...historialPosiciones[atletaB]].sort((x, y) => x - y);

      for (let i = 0; i < Math.max(puestosA.length, puestosB.length); i++) {
        const valA = puestosA[i] ?? Infinity;
        const valB = puestosB[i] ?? Infinity;

        if (valA !== valB) {
          return valA - valB;
        }
      }

      return 0;
    });

    return { rankingFinal, puntuacionesPorWOD };
  }, [atletasFiltrados, wods, resultados]);

  const getEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "";
  };

  return (
    <div className="resultados-container">
      <h2>LEADERBOARD OFICIAL</h2>

      <div className="filtro-categoria-container">
        <label htmlFor="categoria-select">Filtrar por categoría:</label>
        <select
          id="categoria-select"
          className="select-categoria"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          {categoriasDisponibles.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {atletasFiltrados.length === 0 ? (
        <p className="mensaje-vacio">
          No hay equipos registrados en esta categoría.
        </p>
      ) : (
        <div className="ranking-lista">
          {rankingFinal.map(([atleta, puntos], index) => {
            const clasePodio =
              index === 0
                ? "podio-1"
                : index === 1
                ? "podio-2"
                : index === 2
                ? "podio-3"
                : "";

            return (
              <div key={atleta} className={`ranking-item ${clasePodio}`}>
                {/* Columna Izquierda: Posición + Nombre */}
                <div className="ranking-main-info">
                  <span className="ranking-posicion">
                    {getEmoji(index)} #{index + 1}
                  </span>
                  <span className="ranking-equipo">{atleta}</span>
                </div>

                {/* Columna Central: Badges de cada WOD */}
                <div className="ranking-wods-breakdown">
                  {wods.map((wod) => (
                    <div key={wod.id || wod.nombre} className="wod-score-badge">
                      <span className="wod-score-label">{wod.nombre}</span>
                      <span className="wod-score-valor">
                        {puntuacionesPorWOD[atleta]?.[wod.nombre]
                          ? `${puntuacionesPorWOD[atleta][wod.nombre]}°`
                          : "-"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Columna Derecha: Puntos Totales */}
                <div className="ranking-puntos-total">
                  <span className="puntos-numero">{puntos}</span>
                  <span className="puntos-leyenda">PTS</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Resultados;
