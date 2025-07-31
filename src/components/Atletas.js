import React, { useState } from "react";
import "./Atletas.css";

const categoriasDisponibles = [
  "Cuarteto Escalado",
  "Dupla Iniciado",
  "Dupla Avanzado",
  "Kids",
];

function Atletas({ atletas, setAtletas }) {
  const [nombreInput, setNombreInput] = useState("");
  const [categoriaInput, setCategoriaInput] = useState(categoriasDisponibles[0]);
  const [atletaSeleccionado, setAtletaSeleccionado] = useState(null);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [filtro, setFiltro] = useState("");

  // Agrega atleta y limpia input
  const agregarAtleta = () => {
    if (nombreInput.trim() === "") return;

    const nuevoAtleta = {
      nombre: nombreInput.trim(),
      categoria: categoriaInput,
    };

    setAtletas([...atletas, nuevoAtleta]);
    setNombreInput("");
    setFiltro("");
  };

  // Eliminar atleta
  const eliminarAtleta = (index) => {
    const nuevos = [...atletas];
    nuevos.splice(index, 1);
    setAtletas(nuevos);
    setAtletaSeleccionado(null);
  };

  // Guardar edición
  const guardarEdicion = (index) => {
    if (nombreEditado.trim() === "") return;

    const nuevos = [...atletas];
    nuevos[index] = { ...nuevos[index], nombre: nombreEditado.trim() };
    setAtletas(nuevos);
    setEditandoIndex(null);
    setNombreEditado("");
  };

  // Actualiza filtro en tiempo real
  const handleInputChange = (e) => {
    setNombreInput(e.target.value);
    setFiltro(e.target.value.toLowerCase());
  };

  // Botón Buscar fija filtro al texto actual del input
  const aplicarFiltro = () => {
    setFiltro(nombreInput.toLowerCase());
  };

  // Filtra atletas por nombre (en minúsculas)
  const atletasFiltrados = atletas.filter((atleta) =>
    atleta.nombre.toLowerCase().includes(filtro)
  );

  return (
    <div className="atletas-container">
      <h1>Equipos</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Nombre del equipo"
          value={nombreInput}
          onChange={handleInputChange}
          className="input-nuevo"
        />
        <select
          value={categoriaInput}
          onChange={(e) => setCategoriaInput(e.target.value)}
        >
          {categoriasDisponibles.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button onClick={agregarAtleta} className="btn-agregarE">
          Agregar
        </button>
        <button onClick={aplicarFiltro} className="btn-buscar">
          Buscar
        </button>
      </div>

      <ul className="lista-atletas">
        {atletasFiltrados.map((atleta, index) => (
          <li
            key={index}
            onMouseEnter={() => setAtletaSeleccionado(index)}
            onMouseLeave={() => setAtletaSeleccionado(null)}
            className={`item-atleta ${
              atletaSeleccionado === index ? "activo" : ""
            }`}
          >
            {editandoIndex === index ? (
              <div>
                <input
                  type="text"
                  value={nombreEditado}
                  onChange={(e) => setNombreEditado(e.target.value)}
                  className="input-editar"
                />
                <button
                  onClick={() => guardarEdicion(index)}
                  className="btn-guardar"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <>
                <span onClick={() => setAtletaSeleccionado(index)}>
                  {atleta.nombre} - {atleta.categoria}
                </span>

                {atletaSeleccionado === index && (
                  <div className="menu-opciones">
                    <button
                      onClick={() => {
                        setEditandoIndex(index);
                        setNombreEditado(atleta.nombre);
                      }}
                      className="btn-editar"
                    >
                      📝
                    </button>
                    <button
                      onClick={() => eliminarAtleta(index)}
                      className="btn-eliminar"
                    >
                      ❌
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Atletas;
