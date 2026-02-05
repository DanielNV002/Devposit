import "./FormMovimientos.scss";
import { useState } from "react";

function FormMovimiento({ tipo, onGuardar, onCerrar }) {
  const [cantidad, setCantidad] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const guardar = () => {
    if (!cantidad) return;
    onGuardar({
      tipo,
      cantidad: Number(cantidad),
      descripcion,
      fecha: new Date(),
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
      <div className="botones">
        <button className="botonCancelar" onClick={onCerrar}>
          Cancelar
        </button>
        <button onClick={guardar}>Guardar</button>
      </div>
    </div>
  );
}

const modalStyle = {
  border: "1px solid #ccc",
  padding: "1rem",
  marginTop: "1rem",
  background: "#00000044",
};

export default FormMovimiento;
