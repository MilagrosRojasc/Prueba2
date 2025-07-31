import React, { useState } from "react";
import "./Resultados.css";

const tiempoASegundos = (tiempo) => {
  if (!tiempo) return 9999;
  const partes = tiempo.split(":");
  const minutos = parseInt(partes[0], 10);
  const segundos = parseInt(partes[1], 10);
  return minutos * 60 + segundos;
};

const categoriasDisponibles = [
  "Cuarteto Escalado",
  "Dupla Iniciado",
  "Dupla Avanzado",
  "Kids",
];

function Resultados({ atletas, wods, resultados }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoriasDisponibles[0]);

  // Filtrar atletas según categoría seleccionada
  const atletasFiltrados = atletas.filter(
    (a) => a.categoria === categoriaSeleccionada
  );

  const calcularRanking = (listaAtletas) => {
    const puntuacionesTotales = {};
    const puntuacionesPorWOD = {};

    wods.forEach((wod) => {
      const resultadosWOD = listaAtletas
        .map((atleta) => {
          const data = resultados[atleta.nombre]?.[wod.nombre];
          if (!data) return null;

          return {
            atleta: atleta.nombre,
            reps: parseInt(data.reps) || 0,
            tiempo: tiempoASegundos(data.tiempo || "99:99"),
          };
        })
        .filter(Boolean);

      resultadosWOD.sort((a, b) => {
        if (b.reps !== a.reps) return b.reps - a.reps;
        return a.tiempo - b.tiempo;
      });

      for (let i = 0; i < resultadosWOD.length; i++) {
        if (i > 0) {
          const prev = resultadosWOD[i - 1];
          const curr = resultadosWOD[i];
          if (curr.reps === prev.reps && curr.tiempo === prev.tiempo) {
            curr.posicion = prev.posicion;
          } else {
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

    return { rankingFinal, puntuacionesPorWOD };
  };

  const { rankingFinal, puntuacionesPorWOD } = calcularRanking(atletasFiltrados);

  const getEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "";
  };

  return (
    <div className="resultados-container">
      <h2>LEADERBOARD</h2>

      <label htmlFor="categoria-select">Filtrar por categoría:</label>
      <select
        id="categoria-select"
        value={categoriaSeleccionada}
        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        style={{
          margin: "0.5rem 0 1rem",
          padding: "8px",
          borderRadius: "8px",
          border: "1.5px solid #ccc",
          minWidth: "220px",
        }}
      >
        {categoriasDisponibles.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {atletasFiltrados.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", fontWeight: "600" }}>
          No hay equipos en esta categoría.
        </p>
      ) : (
        <table className="resultados-table">
          <thead>
            <tr>
              <th>Posición</th>
              <th>Equipo</th>
              {wods.map((wod) => (
                <th key={wod.nombre}>{wod.nombre}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rankingFinal.map(([atleta, puntos], index) => (
              <tr key={atleta}>
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
      )}
    </div>
  );
}

export default Resultados;
