import React, { useState } from "react";
import "./Atletas.css";


function Atletas() {
  const [atletas, setAtletas] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [atletaSeleccionado, setAtletaSeleccionado] = useState(null);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");

  const agregarAtleta = () => {
    if (nuevoNombre.trim() === "") return;
    setAtletas([...atletas, nuevoNombre]);
    setNuevoNombre("");
  };

  const eliminarAtleta = (index) => {
    const nuevos = [...atletas];
    nuevos.splice(index, 1);
    setAtletas(nuevos);
    setAtletaSeleccionado(null);
  };

  const guardarEdicion = (index) => {
    const nuevos = [...atletas];
    nuevos[index] = nombreEditado;
    setAtletas(nuevos);
    setEditandoIndex(null);
    setNombreEditado("");
  };

  return (
    <div className="atletas-container">
      <h1>Equipos</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Nombre del atleta"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          className="input-nuevo"
        />
        <button onClick={agregarAtleta} className="btn-agregar">
          Agregar
        </button>
      </div>

      <ul className="lista-atletas">
        {atletas.map((atleta, index) => (
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
