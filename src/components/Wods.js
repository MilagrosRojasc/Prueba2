import React, { useState } from "react";
import "./Wods.css";

function Wods() {
  const [cantidad, setCantidad] = useState("");
  const [wods, setWods] = useState([]);

  const agregarWods = () => {
    const num = parseInt(cantidad);
    if (!isNaN(num) && num > 0) {
      const nuevosWods = Array.from({ length: num }, (_, i) => `WOD ${i + 1}`);
      setWods(nuevosWods);
      setCantidad("");
    }
  };

  return (
    <div className="wods-container">
      <h1>Agregar WODs</h1>
      <div className="input-wods-container">
        <input
          type="number"
          placeholder="Cantidad de WODs"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="input-cantidad"
        />
        <button onClick={agregarWods} className="btn-agregar-wods">
          Generar
        </button>
      </div>

      <ul className="lista-wods">
        {wods.map((wod, index) => (
          <li key={index} className="item-wod">
            {wod}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Wods;
