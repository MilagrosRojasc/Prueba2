import React from "react";
import "./Resultados.css";

const tiempoASegundos = (tiempo) => {
  if (!tiempo) return 9999;
  const partes = tiempo.split(":");
  const minutos = parseInt(partes[0], 10);
  const segundos = parseInt(partes[1], 10);
  return minutos * 60 + segundos;
};

function Resultados({ atletas, wods, resultados }) {
  const puntuacionesTotales = {};
  const puntuacionesPorWOD = {};

  wods.forEach((wod) => {
    const resultadosWOD = atletas
      .map((atleta) => {
        const data = resultados[atleta]?.[wod.nombre];
        if (!data) return null;

        return {
          atleta,
          reps: parseInt(data.reps) || 0,
          tiempo: tiempoASegundos(data.tiempo || "99:99"),
        };
      })
      .filter(Boolean);

    resultadosWOD.sort((a, b) => {
      if (b.reps !== a.reps) return b.reps - a.reps;
      return a.tiempo - b.tiempo;
    });

    // Asignar posiciones con empates
    let posicionActual = 1;
    for (let i = 0; i < resultadosWOD.length; i++) {
      if (i > 0) {
        const prev = resultadosWOD[i - 1];
        const curr = resultadosWOD[i];
        if (curr.reps === prev.reps && curr.tiempo === prev.tiempo) {
          // Misma posición que el anterior
          curr.posicion = prev.posicion;
        } else {
          // Nueva posición
          curr.posicion = i + 1;
        }
      } else {
        resultadosWOD[i].posicion = 1;
      }

      const res = resultadosWOD[i];
      if (!puntuacionesTotales[res.atleta]) puntuacionesTotales[res.atleta] = 0;
      puntuacionesTotales[res.atleta] += res.posicion;

      if (!puntuacionesPorWOD[res.atleta]) puntuacionesPorWOD[res.atleta] = {};
      puntuacionesPorWOD[res.atleta][wod.nombre] = res.posicion;
    }
  });

  // Ordenar ranking final con criterio de desempate por mejores posiciones
  const rankingFinal = Object.entries(puntuacionesTotales).sort((a, b) => {
    const puntosA = a[1];
    const puntosB = b[1];

    if (puntosA !== puntosB) {
      return puntosA - puntosB;
    }

    const posA = Object.values(puntuacionesPorWOD[a[0]]);
    const posB = Object.values(puntuacionesPorWOD[b[0]]);

    posA.sort((x, y) => x - y);
    posB.sort((x, y) => x - y);

    for (let i = 0; i < Math.max(posA.length, posB.length); i++) {
      const valA = posA[i] ?? Infinity;
      const valB = posB[i] ?? Infinity;

      if (valA !== valB) {
        return valA - valB;
      }
    }

    return 0;
  });

  const getEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "";
  };

  return (
    <div className="resultados-container">
      <h2>LEADERBOARD</h2>
      <table className="resultados-table">
        <thead>
          <tr>
            <th>Posición</th>
            <th>Atleta</th>
            {wods.map((wod) => (
              <th key={wod.nombre}>{wod.nombre}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rankingFinal.map(([atleta, puntos], index) => (
            <tr key={index}>
              <td>{getEmoji(index)} {index + 1}</td>
              <td>{atleta}</td>
              {wods.map((wod) => (
                <td key={wod.nombre}>
                  {puntuacionesPorWOD[atleta]?.[wod.nombre] || "-"}
                </td>
              ))}
              <td>{puntos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Resultados;
