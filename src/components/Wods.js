import React, { useState } from "react";
import "./Wods.css";

function Wods({ wods, setWods }) {

  const agregarWod = () => {
    const nuevoWod = {
      nombre: `WOD ${wods.length + 1}`,
      tipo: '',
      timeCap: ''
    };
    setWods([...wods, nuevoWod]);
  };

  const actualizarWod = (index, campo, valor) => {
    const nuevosWods = [...wods];
    nuevosWods[index] = {
      ...nuevosWods[index],
      [campo]: valor
    };
    setWods(nuevosWods);
  };

  const eliminarWod = (index) => {
    const nuevosWods = wods.filter((_, i) => i !== index);
    setWods(nuevosWods);
  };

  return (
    <div className="wods-container">
      <h2>Agregar WODs</h2>
      <button className="btn-agregar" onClick={agregarWod}>Añadir WOD</button>
      <div className="lista-wods">
        {wods.map((wod, index) => (
          <div key={index} className="wod-card">
            
            <label>
              Nombre del WOD:
              <input
                type="text"
                value={wod.nombre}
                onChange={(e) => actualizarWod(index, 'nombre', e.target.value)}
              />
            </label>

            <label>
              Tipo:
              <select
                value={wod.tipo}
                onChange={(e) => actualizarWod(index, 'tipo', e.target.value)}
              >
                <option value="">Selecciona</option>
                <option value="For Time">For Time</option>
                <option value="AMRAP">AMRAP</option>
              </select>
            </label>

            <label>
              Time Cap:
              <input
                type="text"
                placeholder="Ej: 12 min"
                value={wod.timeCap}
                onChange={(e) => actualizarWod(index, 'timeCap', e.target.value)}
              />
            </label>

            <div className="botones-wod">
              <button className="btn-eliminar" onClick={() => eliminarWod(index)}>
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wods;
