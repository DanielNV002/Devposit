import "./ConfirmReset.scss";

function ConfirmReset({ onConfirmar, onCerrar }) {
  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="modalReset" onClick={(e) => e.stopPropagation()}>
        <h3>⚠️ Vaciar historial ⚠️</h3>

        <p>
          Esta acción eliminará <strong>TODOS</strong> los movimientos
          guardados.
        </p>
        <p>
          <strong>NO</strong> se puede deshacer.
        </p>

        <div className="botones">
          <button className="cancelar" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="confirmar" onClick={onConfirmar}>
            Sí, borrar todo
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmReset;
