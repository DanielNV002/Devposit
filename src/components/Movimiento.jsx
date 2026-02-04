import "./Movimiento.scss";

function Movimiento({ tipo, cantidad, descripcion, fecha }) {
  const date = fecha instanceof Date ? fecha : new Date(fecha);

  return (
    <div className="movimiento">
      <small>{!isNaN(date) ? date.toLocaleDateString("es-ES") : ""}</small>
      <hr />
      <div className="descripcion">{descripcion}</div>
      <hr />
      <strong className={tipo === "ingreso" ? "ingreso" : "gasto"}>
        {tipo === "ingreso" ? "+" : "-"} {cantidad}€
      </strong>
    </div>
  );
}
export default Movimiento;
