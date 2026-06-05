import "./FormMovimientos.scss";
import { useState } from "react";

function FormCambioMovimiento({ movimiento, onGuardar, onCerrar }) {
  const [cantidad, setCantidad] = useState(movimiento.cantidad);
  const [descripcion, setDescripcion] = useState(movimiento.descripcion);
  const [fecha, setFecha] = useState(
    new Date(movimiento.fecha).toISOString().split("T")[0],
  );

  const guardar = () => {
    if (!cantidad) return;

    onGuardar({
      ...movimiento, // 👈 mantenemos lo anterior
      cantidad: Number(cantidad),
      descripcion,
      fecha: new Date(fecha),
    });
  };

  return (
    <div className="popUpNuevo">
      <h2>Editar movimiento</h2>

      <input
        type="number"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
      />

      <input
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <div className="botones">
        <button className="botonCancelar" onClick={onCerrar}>
          Cancelar
        </button>
        <button onClick={guardar}>Guardar cambios</button>
      </div>
    </div>
  );
}

export default FormCambioMovimiento;
