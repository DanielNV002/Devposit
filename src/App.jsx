import { useState, useEffect } from "react";
import {
  leerMovimientos,
  guardarMovimientos,
} from "./storage/movimientosStorage";
import "./App.scss";
import Movimiento from "./components/Movimiento";
import FormMovimiento from "./components/FormMovimientos";
import Dashboard from "./components/DashboardGrafica";
import ResetMovimientos from "./components/ResetMovimientos";
import ConfirmReset from "./components/ConfirmReset";
import Settings from "./components/Settings";
import { leerTema } from "./storage/temaStorage";

import { useSwipeable } from "react-swipeable";

function App() {
  const [mostrarReset, setMostrarReset] = useState(false);
  const [movimientos, setMovimientos] = useState([]);
  const [tipoActivo, setTipoActivo] = useState(null); // "ingreso" | "gasto"
  const [pantalla, setPantalla] = useState("home");
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const agregarMovimiento = async (movimiento) => {
    // Copiar y añadir movimiento al inicio
    const nuevosMovimientos = [movimiento, ...movimientos];

    // Guardar en archivo
    await guardarMovimientos(nuevosMovimientos);

    // Guardar en el movimiento la propiedad saldoAcumulado
    const movConSaldo = nuevosMovimientos.map((m, i) => {
      let saldo = 0;
      for (let j = 0; j <= i; j++) {
        saldo +=
          nuevosMovimientos[j].tipo === "ingreso"
            ? nuevosMovimientos[j].cantidad
            : -nuevosMovimientos[j].cantidad;
      }
      return { ...m, saldoAcumulado: saldo };
    });

    setMovimientos(movConSaldo);

    setTipoActivo(null);
  };

  const vaciarMovimientos = async () => {
    await guardarMovimientos([]);
    setMovimientos([]);
    setMostrarReset(false);
  };

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (pantalla !== "home") return;

      if (e.deltaX < 0) {
        setIsDragging(true);
        setDragX(Math.max(e.deltaX, -120)); // límite visual
      }
    },

    onSwiped: (e) => {
      setIsDragging(false);
      setDragX(0);

      if (e.deltaX < -80 && pantalla === "home") {
        setPantalla("settings");
      }
    },

    onSwipedRight: () => {
      if (pantalla === "settings") {
        setPantalla("home");
      }
    },

    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });

  useEffect(() => {
    const cargar = async () => {
      const datos = await leerMovimientos();
      setMovimientos(datos);
    };

    cargar();
  }, []);

  useEffect(() => {
    async function cargarTema() {
      const tema = await leerTema();
      if (!tema) return;

      Object.entries(tema).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
      });
    }

    cargarTema();
  }, []);

  return (
    <div className="app" {...handlers}>
      <div className="cabecera">
        <h1>Devposit</h1>
      </div>
      {pantalla === "home" && (
        <>
          <div
            className="settings-indicator"
            style={{
              opacity: Math.min(Math.abs(dragX) / 80, 1),
            }}
          >
            Ajustes
          </div>
          <p>Tu app para manejar tus movimientos</p>
          <div className="grafica">
            <p>El saldo actual es de:</p>
            <hr />
            <strong>
              {" "}
              {movimientos
                .reduce(
                  (total, m) =>
                    m.tipo === "ingreso"
                      ? total + m.cantidad
                      : total - m.cantidad,
                  0,
                )
                .toFixed(2)}{" "}
              €
            </strong>
            <hr />
            <Dashboard movimientos={movimientos} />
          </div>
          <div className="controles">
            <button
              onClick={(e) => {
                e.currentTarget.blur();
                setTipoActivo("ingreso");
              }}
            >
              Ingreso
            </button>
            <button
              onClick={(e) => {
                e.currentTarget.blur();
                setTipoActivo("gasto");
              }}
            >
              Gasto
            </button>
          </div>
          <div className="popUpMovimiento">
            {tipoActivo && (
              <div className="overlay" onClick={() => setTipoActivo(null)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <FormMovimiento
                    tipo={tipoActivo}
                    onGuardar={agregarMovimiento}
                    onCerrar={() => setTipoActivo(null)}
                  />
                </div>
              </div>
            )}

            <p>Lista de todos los movimientos del mes</p>
          </div>
          <hr />
          <div className="listaMovimientos">
            {[...movimientos].map((m, i) => (
              <Movimiento key={i} {...m} />
            ))}
          </div>
          <hr />
          <ResetMovimientos onClick={() => setMostrarReset(true)} />
          {mostrarReset && (
            <ConfirmReset
              onConfirmar={vaciarMovimientos}
              onCerrar={() => setMostrarReset(false)}
            />
          )}
        </>
      )}
      {pantalla === "settings" && (
        <Settings
          onVolver={() => {
            setPantalla("home");
          }}
        />
      )}
    </div>
  );
}

export default App;
