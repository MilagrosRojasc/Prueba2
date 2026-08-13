import React from "react";
import "./Wods.css";

function Wods({ wods = [], setWods }) {

  // Crear un nuevo WOD con valores por defecto
  const agregarWod = () => {
    const nuevoWod = {
      id: Date.now(),
      nombre: `WOD ${wods.length + 1}`,
      tipo: "For Time", // Valor por defecto
      timeCap: "",
      descripcion: ""
    };
    setWods([...wods, nuevoWod]);
  };

  // Actualizar cualquier campo de un WOD
  const actualizarWod = (index, campo, valor) => {
    const nuevosWods = [...wods];
    nuevosWods[index] = {
      ...nuevosWods[index],
      [campo]: valor
    };
    setWods(nuevosWods);
  };

  // Eliminar un WOD por su índice
  const eliminarWod = (index) => {
    const nuevosWods = wods.filter((_, i) => i !== index);
    setWods(nuevosWods);
  };

  return (
    <div className="wods-container">
      <h2>Configuración de WODs</h2>
      <p className="subtitulo">
        Agrega los WODs de la competencia y especifica sus métricas (Tiempo o Repeticiones).
      </p>

      <button className="btn-agregar" onClick={agregarWod}>
        ➕ Añadir WOD
      </button>

      {wods.length === 0 ? (
        <p className="mensaje-vacio">
          No hay WODs registrados. Haz clic en "Añadir WOD" para crear el primero.
        </p>
      ) : (
        <div className="lista-wods">
          {wods.map((wod, index) => (
            <div key={wod.id || index} className="wod-card">
              
              <div className="wod-card-header">
                <h3>{wod.nombre || `WOD ${index + 1}`}</h3>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarWod(index)}
                  title="Eliminar WOD"
                >
                  ❌
                </button>
              </div>

              {/* Formulario de edición dentro de la tarjeta */}
              <div className="wod-body">
                <div className="form-group">
                  <label>Nombre del WOD:</label>
                  <input
                    type="text"
                    value={wod.nombre}
                    onChange={(e) => actualizarWod(index, "nombre", e.target.value)}
                    placeholder="Ej: WOD 1"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo:</label>
                    <select
                      value={wod.tipo || "For Time"}
                      onChange={(e) =>
                        actualizarWod(index, "tipo", e.target.value)
                      }
                    >
                      <option value="For Time">For Time</option>
                      <option value="AMRAP">AMRAP</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Time Cap:</label>
                    <input
                      type="text"
                      value={wod.timeCap}
                      onChange={(e) => actualizarWod(index, "timeCap", e.target.value)}
                      placeholder="Ej: 12 min"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Descripción / Movimientos:</label>
                  <textarea
                    rows="3"
                    value={wod.descripcion || ""}
                    onChange={(e) => actualizarWod(index, "descripcion", e.target.value)}
                    placeholder="Ej: 21-15-9 Thrusters + Pull-ups"
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wods;
