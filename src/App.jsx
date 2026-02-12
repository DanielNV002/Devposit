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
import Historial from "./components/Historial";
import { leerTema } from "./storage/temaStorage";

import { useSwipeable } from "react-swipeable";
import { guardarHistorial } from "./storage/historialStorage";

function App() {
  const [mostrarReset, setMostrarReset] = useState(false);
  const [movimientos, setMovimientos] = useState([]);
  const [historial, setHistorial] = useState({});
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
    guardarHistorial({});
    setMovimientos([]);
    setHistorial({});
    setMostrarReset(false);
  };

  const handlers = useSwipeable({
    onSwiping: (e) => {
      setIsDragging(true);

      if (e.deltaX < 0) {
        setDragX(Math.max(e.deltaX, -100));
      } else {
        setDragX(Math.min(e.deltaX, 100));
      }
    },

    onSwiped: (e) => {
      setIsDragging(false);
      setDragX(0);

      const limite = 80;

      if (pantalla === "home") {
        if (e.deltaX < -limite) {
          setPantalla("settings");
        } else if (e.deltaX > limite) {
          setPantalla("historial");
        }
      }

      if (pantalla === "settings" && e.deltaX > limite) {
        setPantalla("home");
      }

      if (pantalla === "historial" && e.deltaX < -limite) {
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
    <div className="app">
      <div className="cabecera">
        <h1>Devposit</h1>
      </div>
      {pantalla === "home" && (
        <div {...handlers}>
          <div
            className="settings-indicator"
            style={{
              opacity: dragX < 0 ? Math.min(Math.abs(dragX) / 80, 1) : 0,
              transform: `translateY(-50%) translateX(${Math.max(dragX, -40)}px)`,
            }}
          >
            Ajustes
          </div>
          <div
            className="historial-indicator"
            style={{
              opacity: dragX > 0 ? Math.min(dragX / 80, 1) : 0,
              transform: `translateY(-50%) translateX(${Math.min(dragX, 40)}px)`,
            }}
          >
            Historial
          </div>
          <div className="grafica">
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
          <button
            onClick={async () => {
              // Si no hay movimientos ni saldo inicial, no hacemos nada
              if (movimientos.length === 0) return;

              // Import dinámico de las funciones correctas
              const mod = await import("./storage/historialStorage");
              const { leerHistorial, guardarHistorial } = mod;
              const movimientosMod =
                await import("./storage/movimientosStorage");
              const { guardarMovimientos } = movimientosMod;

              // Leemos historial completo
              const historial = await leerHistorial();

              // Mes actual en formato YYYY-MM
              const mesActual = new Date().toISOString().slice(0, 7);

              // Calculamos ingresos y gastos de este mes
              const totalIngreso = movimientos
                .filter((m) => m.tipo === "ingreso")
                .reduce((acc, m) => acc + m.cantidad, 0);

              const totalGasto = movimientos
                .filter((m) => m.tipo === "gasto")
                .reduce((acc, m) => acc + m.cantidad, 0);

              const variacionMes = totalIngreso - totalGasto;

              // Saldo inicial = saldoFinal del mes anterior (si existe)
              const mesesPrevios = Object.keys(historial).sort();
              const saldoInicial = mesesPrevios.length
                ? historial[mesesPrevios[mesesPrevios.length - 1]].saldoFinal
                : 0;

              // Saldo final = variación de este mes
              const saldoFinal = variacionMes;

              // Guardamos el mes cerrado en el historial
              historial[mesActual] = {
                saldoInicial,
                totalIngreso,
                totalGasto,
                saldoFinal,
                movimientos,
              };

              await guardarHistorial(historial);

              // Preparamos el nuevo mes con movimiento inicial si hay saldo final
              const movimientosNuevoMes =
                saldoFinal > 0
                  ? [
                      {
                        tipo: "ingreso",
                        cantidad: saldoFinal,
                        descripcion: "Saldo inicial",
                        fecha: new Date(),
                      },
                    ]
                  : [];

              await guardarMovimientos(movimientosNuevoMes);
              setMovimientos(movimientosNuevoMes);
            }}
          >
            Cerrar mes
          </button>

          <ResetMovimientos onClick={() => setMostrarReset(true)} />
          {mostrarReset && (
            <ConfirmReset
              onConfirmar={vaciarMovimientos}
              onCerrar={() => setMostrarReset(false)}
            />
          )}
        </div>
      )}
      {pantalla === "settings" && (
        <Settings onVolver={() => setPantalla("home")} />
      )}
      {pantalla === "historial" && (
        <Historial onVolver={() => setPantalla("home")} />
      )}
    </div>
  );
}

export default App;
