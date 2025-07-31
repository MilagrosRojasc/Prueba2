import React, { useState } from "react";
import "./Atletas.css";

function Atletas({ atletas, setAtletas }) {
  const [nombreInput, setNombreInput] = useState("");
  const [atletaSeleccionado, setAtletaSeleccionado] = useState(null);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [filtro, setFiltro] = useState("");

  // Agrega atleta y limpia input
  const agregarAtleta = () => {
    if (nombreInput.trim() === "") return;
    setAtletas([...atletas, nombreInput.trim()]);
    setNombreInput("");
    // Opcional: reset filtro para mostrar todo después de agregar
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
    const nuevos = [...atletas];
    nuevos[index] = nombreEditado.trim();
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

  return (
    <div className="atletas-container">
      <h1>Equipos</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Nombre del equipo "
          value={nombreInput}
          onChange={handleInputChange}
          className="input-nuevo"
        />
        <button onClick={agregarAtleta} className="btn-agregara">
          Agregar
        </button>
        <button onClick={aplicarFiltro} className="btn-buscar">
          Buscar
        </button>
      </div>

      <ul className="lista-atletas">
        {atletas
          .filter((atleta) => atleta.toLowerCase().includes(filtro))
          .map((atleta, index) => (
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
                    {atleta}
                  </span>

                  {atletaSeleccionado === index && (
                    <div className="menu-opciones">
                      <button
                        onClick={() => {
                          setEditandoIndex(index);
                          setNombreEditado(atleta);
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
