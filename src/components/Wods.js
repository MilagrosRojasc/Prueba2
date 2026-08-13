import React, { useState } from "react";
import "./Wods.css";

function Wods({ wods = [], setWods }) {
  // Estado para saber qué WOD se está editando (almacena su id)
  const [wodEditandoId, setWodEditandoId] = useState(null);

  // Crear un nuevo WOD y ponerlo automáticamente en modo edición
  const agregarWod = () => {
    const nuevoId = Date.now();
    const nuevoWod = {
      id: nuevoId,
      nombre: `WOD ${wods.length + 1}`,
      tipo: "For Time",
      timeCap: "",
      descripcion: ""
    };
    setWods([...wods, nuevoWod]);
    setWodEditandoId(nuevoId); // Pasa a edición de inmediato para llenar los datos
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

  // Guardar cambios (simplemente cierra el modo edición)
  const guardarWod = () => {
    setWodEditandoId(null);
  };

  return (
    <div className="wods-container">
      <h2>Configuración de WODs</h2>
      <p className="subtitulo">
        Agrega los WODs de la competencia y especifica sus métricas.
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
          {wods.map((wod, index) => {
            const estaEditando = wodEditandoId === wod.id;

            return (
              <div key={wod.id || index} className={`wod-card ${estaEditando ? "editando" : ""}`}>
                
                {/* Header de la Tarjeta */}
                <div className="wod-card-header">
                  <h3>{wod.nombre || `WOD ${index + 1}`}</h3>
                  
                  <div className="acciones-header">
                    {estaEditando ? (
                      <button
                        className="btn-guardar"
                        onClick={guardarWod}
                        title="Guardar WOD"
                      >
                        💾 Guardar
                      </button>
                    ) : (
                      <button
                        className="btn-editar"
                        onClick={() => setWodEditandoId(wod.id)}
                        title="Editar WOD"
                      >
                        ✏️ Editar
                      </button>
                    )}

                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarWod(index)}
                      title="Eliminar WOD"
                    >
                      ❌
                    </button>
                  </div>
                </div>

                {/* VISTA EN MODO EDICIÓN */}
                {estaEditando ? (
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
                          onChange={(e) => actualizarWod(index, "tipo", e.target.value)}
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
                ) : (
                  /* VISTA EN MODO LECTURA (TARJETA FIJA) */
                  <div className="wod-preview">
                    <div className="preview-badges">
                      <span className="badge-preview tipo">{wod.tipo || "For Time"}</span>
                      {wod.timeCap && (
                        <span className="badge-preview cap">⏱️ Time Cap: {wod.timeCap}</span>
                      )}
                    </div>

                    {wod.descripcion ? (
                      <p className="preview-descripcion">{wod.descripcion}</p>
                    ) : (
                      <p className="preview-sin-descripcion">Sin descripción registrada.</p>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Wods;
