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

function App() {
  const [mostrarReset, setMostrarReset] = useState(false);
  const [movimientos, setMovimientos] = useState([]);
  const [tipoActivo, setTipoActivo] = useState(null); // "ingreso" | "gasto"
  const [pantalla, setPantalla] = useState("home");

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
        <button
          onClick={(e) => {
            e.currentTarget.blur();
            setPantalla("settings");
          }}
        >
          Ajustes
        </button>
      </div>
      {pantalla === "home" && (
        <>
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
          onVolver={(e) => {
            e.currentTarget.blur();
            setPantalla("home");
          }}
        />
      )}
    </div>
  );
}

export default App;
