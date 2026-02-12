import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import "./Historial.scss";
import { leerHistorial } from "../storage/historialStorage";
import Movimiento from "./Movimiento";

function Historial({ onVolver }) {
  const [historial, setHistorial] = useState({});
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [modalMovimientos, setModalMovimientos] = useState(null);

  useEffect(() => {
    async function cargar() {
      const data = await leerHistorial();
      setHistorial(data);
    }
    cargar();
  }, []);

  const formatearMes = (clave) => {
    const [anio, mes] = clave.split("-");
    const fecha = new Date(anio, mes - 1);

    const nombreMes = fecha.toLocaleString("es-ES", {
      month: "long",
    });

    return {
      nombreMes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
      anio,
    };
  };

  const formatearSaldo = (valor) => {
    const numero = Number(valor) || 0;
    return (Object.is(numero, -0) ? 0 : numero).toFixed(2);
  };

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
      <hr />
      <h2>Historial</h2>
      <hr />
      <div className="historial-lista">
        {Object.entries(historial)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([mes, datos]) => {
            const { nombreMes, anio } = formatearMes(mes);

            return (
              <div
                key={mes}
                className="mes-card"
                onClick={() => setModalMovimientos(datos.movimientos)}
              >
                <h3>{nombreMes}</h3>
                <span className="anio">{anio}</span>

                <p>Inicio: {formatearSaldo(datos.saldoInicial)} €</p>
                <p>Final: {formatearSaldo(datos.saldoFinal)} €</p>
              </div>
            );
          })}
      </div>
      {modalMovimientos && (
        <div className="overlay" onClick={() => setModalMovimientos(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Movimientos del mes</h3>
            <div className="lista-movimientos">
              {modalMovimientos.map((m, i) => (
                <Movimiento key={i} {...m} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Historial;
