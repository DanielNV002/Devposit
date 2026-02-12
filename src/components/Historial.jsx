import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import "./Historial.scss";
import { leerHistorial } from "../storage/historialStorage";

function Historial({ onVolver }) {
  const [historial, setHistorial] = useState({});
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    async function cargar() {
      const data = await leerHistorial();
      setHistorial(data);
    }
    cargar();
  }, []);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (e.deltaX < 0) {
        setIsDragging(true);
        setDragX(Math.max(e.deltaX, -120)); // límite
      }
    },

    onSwiped: (e) => {
      setIsDragging(false);
      setDragX(0);

      if (e.deltaX < -80) {
        onVolver();
      }
    },

    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });

  return (
    <div className="historial" {...handlers}>
      <div
        className="historial-to-home-indicator"
        style={{
          opacity: dragX < 0 ? Math.min(Math.abs(dragX) / 80, 1) : 0,
          transform: `translateY(-50%) translateX(${Math.max(dragX, -40)}px)`,
        }}
      >
        Home
      </div>

      <h2>Historial</h2>

      {Object.entries(historial).map(([mes, datos]) => (
        <div key={mes} className="mes-card">
          <h3>{mes}</h3>
          <p>Ingresos: {datos.totalIngreso.toFixed(2)} €</p>
          <p>Gastos: {datos.totalGasto.toFixed(2)} €</p>
          <strong>Saldo: {datos.saldoFinal.toFixed(2)} €</strong>
        </div>
      ))}
    </div>
  );
}

export default Historial;
