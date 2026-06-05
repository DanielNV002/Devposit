import "./Movimiento.scss";

function Movimiento({ tipo, cantidad, descripcion, fecha, onClick }) {
  const date = fecha instanceof Date ? fecha : new Date(fecha);

  return (
    <div className="movimiento" onClick={onClick}>
      <small className="fecha">
        {!isNaN(date) ? date.toLocaleDateString("es-ES") : ""}
      </small>

      <div className="descripcion" title={descripcion}>
        {descripcion}
      </div>

      <strong className={tipo === "ingreso" ? "ingreso" : "gasto"}>
        {tipo === "ingreso" ? "+" : "-"} {cantidad.toFixed(2)}€
      </strong>
    </div>
  );
}
export default Movimiento;
