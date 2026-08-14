import React, { useState } from "react";
import "./Wods.css";

function Wods({ wods = [], setWods }) {
  const [wodEditandoId, setWodEditandoId] = useState(null);

  // --- MÁSCARA Y FORMATEO DE TIEMPO MM:SS ---
  const enmascararTiempo = (valor) => {
    // Elimina todo lo que no sea dígito
    const digitos = valor.replace(/\D/g, "").slice(0, 4);

    if (digitos.length === 0) return "";
    if (digitos.length <= 2) return digitos; // Muestra los minutos ingresados

    const min = digitos.slice(0, digitos.length - 2);
    const seg = digitos.slice(-2);
    return `${min.padStart(2, "0")}:${seg}`;
  };

  const formatearTimeCapAlSalir = (valor) => {
    if (!valor) return "";
    const digitos = valor.replace(/\D/g, "");

    if (digitos.length === 0) return "";
    if (digitos.length <= 2) {
      // Si escribió "12", lo convierte a "12:00"
      return `${digitos.padStart(2, "0")}:00`;
    }

    return enmascararTiempo(valor);
  };

  // Crear un nuevo WOD con estructura dinámica de movimientos
  const agregarWod = () => {
    const nuevoId = Date.now();
    const nuevoWod = {
      id: nuevoId,
      nombre: `WOD ${wods.length + 1}`,
      tipo: "For Time",
      timeCap: "",
      rondas: 1,
      movimientos: [
        { id: Date.now(), nombre: "", reps: "" }
      ],
      descripcion: ""
    };
    setWods([...wods, nuevoWod]);
    setWodEditandoId(nuevoId);
  };

  // Actualizar cualquier campo básico del WOD
  const actualizarWod = (index, campo, valor) => {
    const nuevosWods = [...wods];

    let valorProcesado = valor;
    // Si estamos modificando el timeCap, aplicamos la máscara MM:SS
    if (campo === "timeCap") {
      valorProcesado = enmascararTiempo(valor);
    }

    nuevosWods[index] = {
      ...nuevosWods[index],
      [campo]: valorProcesado
    };
    setWods(nuevosWods);
  };

  // --- GESTIÓN DE MOVIMIENTOS DINÁMICOS ---
  const agregarMovimiento = (wodIndex) => {
    const nuevosWods = [...wods];
    nuevosWods[wodIndex].movimientos.push({
      id: Date.now(),
      nombre: "",
      reps: ""
    });
    setWods(nuevosWods);
  };

  const actualizarMovimiento = (wodIndex, movIndex, campo, valor) => {
    const nuevosWods = [...wods];
    nuevosWods[wodIndex].movimientos[movIndex][campo] = valor;
    setWods(nuevosWods);
  };

  const eliminarMovimiento = (wodIndex, movIndex) => {
    const nuevosWods = [...wods];
    nuevosWods[wodIndex].movimientos = nuevosWods[wodIndex].movimientos.filter(
      (_, i) => i !== movIndex
    );
    setWods(nuevosWods);
  };

  // Calcular Repeticiones Totales (Rondas * Suma de Reps de Movimientos)
  const calcularRepsTotales = (wod) => {
    const rondasNum = parseInt(wod.rondas, 10) || 1;
    const sumaRepsPorRonda = (wod.movimientos || []).reduce((acc, mov) => {
      return acc + (parseInt(mov.reps, 10) || 0);
    }, 0);
    return rondasNum * sumaRepsPorRonda;
  };

  const eliminarWod = (index) => {
    const nuevosWods = wods.filter((_, i) => i !== index);
    setWods(nuevosWods);
  };

  const guardarWod = (index) => {
    // Sincronizar repsTotales calculadas en el objeto WOD antes de guardar
    const nuevosWods = [...wods];
    
    // Formatear Time Cap por si quedó incompleto
    nuevosWods[index].timeCap = formatearTimeCapAlSalir(nuevosWods[index].timeCap);
    nuevosWods[index].repsTotales = calcularRepsTotales(nuevosWods[index]);
    
    setWods(nuevosWods);
    setWodEditandoId(null);
  };

  return (
    <div className="wods-container">
      <h2>Configuración de WODs</h2>
      <p className="subtitulo">
        Define la estructura, rondas y movimientos de cada rutina.
      </p>

      <button className="btn-agregar" onClick={agregarWod}>
        ➕ Añadir WOD
      </button>

      {wods.length === 0 ? (
        <p className="mensaje-vacio">
          No hay WODs registrados. Haz clic en "Añadir WOD" para comenzar.
        </p>
      ) : (
        <div className="lista-wods">
          {wods.map((wod, index) => {
            const estaEditando = wodEditandoId === wod.id;
            const totalRepsCalculadas = calcularRepsTotales(wod);

            return (
              <div key={wod.id || index} className={`wod-card ${estaEditando ? "editando" : ""}`}>
                
                {/* HEADER DE TARJETA */}
                <div className="wod-card-header">
                  <h3>{wod.nombre || `WOD ${index + 1}`}</h3>
                  
                  <div className="acciones-header">
                    {estaEditando ? (
                      <button className="btn-guardar" onClick={() => guardarWod(index)}>
                        💾 Guardar
                      </button>
                    ) : (
                      <button className="btn-editar" onClick={() => setWodEditandoId(wod.id)}>
                        ✏️ Editar
                      </button>
                    )}

                    <button className="btn-eliminar" onClick={() => eliminarWod(index)}>
                      ❌
                    </button>
                  </div>
                </div>

                {/* MODO EDICIÓN */}
                {estaEditando ? (
                  <div className="wod-body">
                    <div className="form-group">
                      <label>Nombre del WOD:</label>
                      <input
                        type="text"
                        value={wod.nombre || ""}
                        onChange={(e) => actualizarWod(index, "nombre", e.target.value)}
                        placeholder="Ej: WOD 1 / Franco"
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

                      {/* CAMPO TIME CAP VALIDADO EN MM:SS */}
                      <div className="form-group">
                        <label>Time Cap (mm:ss):</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={wod.timeCap || ""}
                          onChange={(e) => actualizarWod(index, "timeCap", e.target.value)}
                          onBlur={(e) =>
                            actualizarWod(
                              index,
                              "timeCap",
                              formatearTimeCapAlSalir(e.target.value)
                            )
                          }
                          placeholder="12:00"
                        />
                      </div>

                      <div className="form-group">
                        <label>Nº de Rondas:</label>
                        <input
                          type="number"
                          min="1"
                          value={wod.rondas || 1}
                          onChange={(e) => actualizarWod(index, "rondas", e.target.value)}
                          placeholder="Ej: 3"
                        />
                      </div>
                    </div>

                    {/* LISTA DINÁMICA DE MOVIMIENTOS */}
                    <div className="seccion-movimientos-builder">
                      <label className="section-label">Movimientos del WOD:</label>
                      
                      {(wod.movimientos || []).map((mov, movIndex) => (
                        <div key={mov.id || movIndex} className="movimiento-input-row">
                          <input
                            type="number"
                            className="input-reps-mov"
                            value={mov.reps || ""}
                            onChange={(e) =>
                              actualizarMovimiento(index, movIndex, "reps", e.target.value)
                            }
                            placeholder="Reps"
                          />
                          <input
                            type="text"
                            className="input-nombre-mov"
                            value={mov.nombre || ""}
                            onChange={(e) =>
                              actualizarMovimiento(index, movIndex, "nombre", e.target.value)
                            }
                            placeholder="Nombre del movimiento (ej: Thrusters)"
                          />
                          <button
                            type="button"
                            className="btn-remove-mov"
                            onClick={() => eliminarMovimiento(index, movIndex)}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        className="btn-add-movimiento"
                        onClick={() => agregarMovimiento(index)}
                      >
                        ➕ Añadir Movimiento
                      </button>
                    </div>

                    {/* NOTAS O DESCRIPCIÓN OPCIONAL */}
                    <div className="form-group">
                      <label>Notas Adicionales (Opcional):</label>
                      <textarea
                        rows="2"
                        value={wod.descripcion || ""}
                        onChange={(e) => actualizarWod(index, "descripcion", e.target.value)}
                        placeholder="Ej: Peso M: 40kg / F: 30kg"
                      />
                    </div>
                  </div>
                ) : (

                  /* MODO LECTURA */
                  <div className="wod-preview-card">
                    <div className="preview-badges-container">
                      <span className="badge-pill main">{wod.tipo || "For Time"}</span>
                      {wod.rondas && (
                        <span className="badge-pill accent">🔄 {wod.rondas} {wod.rondas === 1 ? "Ronda" : "Rondas"}</span>
                      )}
                      {wod.timeCap && (
                        <span className="badge-pill dark">⏱️ Cap: {wod.timeCap}</span>
                      )}
                      {totalRepsCalculadas > 0 && (
                        <span className="badge-pill success">🎯 Total: {totalRepsCalculadas} Reps</span>
                      )}
                    </div>

                    {wod.movimientos && wod.movimientos.length > 0 ? (
                      <div className="movimientos-display-list">
                        <h4>Esquema de Trabajo:</h4>
                        <ul>
                          {wod.movimientos.map((mov, i) => (
                            <li key={mov.id || i}>
                              <span className="mov-reps-tag">{mov.reps || "0"}</span>
                              <span className="mov-name-text">{mov.nombre || "Movimiento sin nombre"}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="preview-sin-descripcion">No hay movimientos configurados.</p>
                    )}

                    {wod.descripcion && (
                      <div className="wod-notas-footer">
                        <strong>Notas:</strong> {wod.descripcion}
                      </div>
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
