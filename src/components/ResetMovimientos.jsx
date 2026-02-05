import "./ResetMovimientos.scss";

function ResetMovimientos({ onClick }) {
  return (
    <div className="resetMovimientos">
      <button className="botonReset" onClick={onClick}>
        Vaciar Historial
      </button>
    </div>
  );
}

export default ResetMovimientos;
