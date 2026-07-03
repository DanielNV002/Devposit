import "./FormMovimientos.scss";
import { useState } from "react";

function FormMovimiento({ tipo, onGuardar, onCerrar }) {
  const [cantidad, setCantidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");

  const guardar = () => {
    if (!cantidad) return;

    let fechaMovimiento;

    if (fecha) {
      fechaMovimiento = new Date(fecha);

      const ahora = new Date();

      fechaMovimiento.setHours(
        ahora.getHours(),
        ahora.getMinutes(),
        ahora.getSeconds(),
        ahora.getMilliseconds(),
      );
    } else {
      fechaMovimiento = new Date();
    }

    onGuardar({
      tipo,
      cantidad: Number(cantidad),
      descripcion,
      fecha: fechaMovimiento,
    });
  };

  return (
    <div className="popUpNuevo">
      <h2>{tipo === "ingreso" ? "Nuevo ingreso" : "Nuevo gasto"}</h2>

      <input
        type="number"
        placeholder="Importe"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
      />

      <input
        type="text"
        placeholder="Descripción"
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
        <button onClick={guardar}>Guardar</button>
      </div>
    </div>
  );
}

export default FormMovimiento;
