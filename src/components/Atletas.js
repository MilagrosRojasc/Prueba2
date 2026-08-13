import React, { useState } from "react";
import "./Atletas.css";

const categoriasDisponibles = [
  "Dupla Iniciado",
  "Dupla Escalado",
  "Dupla Avanzado",
];

function Atletas({ atletas, setAtletas }) {
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [integrante1, setIntegrante1] = useState("");
  const [integrante2, setIntegrante2] = useState("");
  const [categoriaInput, setCategoriaInput] = useState(categoriasDisponibles[0]);
  
  const [filtro, setFiltro] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  
  const [editEquipo, setEditEquipo] = useState("");
  const [editInt1, setEditInt1] = useState("");
  const [editInt2, setEditInt2] = useState("");

  const agregarAtleta = (e) => {
    e.preventDefault();
    if (!nombreEquipo.trim() || !integrante1.trim() || !integrante2.trim()) return;

    const nuevoEquipo = {
      id: Date.now().toString(),
      nombre: nombreEquipo.trim(),
      integrantes: [integrante1.trim(), integrante2.trim()],
      categoria: categoriaInput,
    };

    setAtletas((prevAtletas) => [...prevAtletas, nuevoEquipo]);
    
    setNombreEquipo("");
    setIntegrante1("");
    setIntegrante2("");
  };

  const eliminarAtleta = (id) => {
    setAtletas((prevAtletas) => prevAtletas.filter((atleta) => atleta.id !== id));
  };

  const iniciarEdicion = (atleta) => {
    setEditandoId(atleta.id);
    setEditEquipo(atleta.nombre);
    setEditInt1(atleta.integrantes[0] || "");
    setEditInt2(atleta.integrantes[1] || "");
  };

  const guardarEdicion = (id) => {
    if (!editEquipo.trim() || !editInt1.trim() || !editInt2.trim()) return;

    setAtletas((prevAtletas) =>
      prevAtletas.map((atleta) =>
        atleta.id === id
          ? {
              ...atleta,
              nombre: editEquipo.trim(),
              integrantes: [editInt1.trim(), editInt2.trim()],
            }
          : atleta
      )
    );
    setEditandoId(null);
  };

  const atletasFiltrados = atletas.filter((atleta) => {
    const textoFiltro = filtro.toLowerCase();
    const coincideEquipo = atleta.nombre.toLowerCase().includes(textoFiltro);
    const coincideIntegrantes = atleta.integrantes.some((int) =>
      int.toLowerCase().includes(textoFiltro)
    );
    return coincideEquipo || coincideIntegrantes;
  });

  return (
    <div className="atletas-container">
      <h1>Registro de Duplas - CrossFit</h1>

      <form onSubmit={agregarAtleta} className="input-container">
        <input
          type="text"
          placeholder="Nombre del Equipo"
          value={nombreEquipo}
          onChange={(e) => setNombreEquipo(e.target.value)}
          className="input-nuevo"
        />
        <input
          type="text"
          placeholder="Atleta 1"
          value={integrante1}
          onChange={(e) => setIntegrante1(e.target.value)}
          className="input-nuevo"
        />
        <input
          type="text"
          placeholder="Atleta 2"
          value={integrante2}
          onChange={(e) => setIntegrante2(e.target.value)}
          className="input-nuevo"
        />
        <select
          value={categoriaInput}
          onChange={(e) => setCategoriaInput(e.target.value)}
        >
          {categoriasDisponibles.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-agregarE">
          Agregar Dupla
        </button>
      </form>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por equipo o atleta..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-filtro"
        />
      </div>

      <ul className="lista-atletas">
        {atletasFiltrados.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
            No se encontraron duplas registradas.
          </p>
        ) : (
          atletasFiltrados.map((atleta) => (
            <li key={atleta.id} className="item-atleta">
              {editandoId === atleta.id ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editEquipo}
                    onChange={(e) => setEditEquipo(e.target.value)}
                    placeholder="Equipo"
                  />
                  <input
                    type="text"
                    value={editInt1}
                    onChange={(e) => setEditInt1(e.target.value)}
                    placeholder="Atleta 1"
                  />
                  <input
                    type="text"
                    value={editInt2}
                    onChange={(e) => setEditInt2(e.target.value)}
                    placeholder="Atleta 2"
                  />
                  <button onClick={() => guardarEdicion(atleta.id)} className="btn-guardar">
                    💾 Guardar
                  </button>
                  <button onClick={() => setEditandoId(null)} className="btn-cancelar">
                    ❌
                  </button>
                </div>
              ) : (
                <div className="info-atleta">
                  <div>
                    <strong>{atleta.nombre}</strong> <span className="badge-cat">({atleta.categoria})</span>
                    <div className="integrantes-texto">
                      👥 {atleta.integrantes.join(" & ")}
                    </div>
                  </div>
                  <div className="menu-opciones">
                    <button
                      onClick={() => iniciarEdicion(atleta)}
                      className="btn-editar"
                      title="Editar"
                    >
                      📝
                    </button>
                    <button
                      onClick={() => eliminarAtleta(atleta.id)}
                      className="btn-eliminar"
                      title="Eliminar"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
