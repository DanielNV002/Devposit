import { useState, useEffect } from "react";
import {
  leerMovimientos,
  guardarMovimientos,
} from "./storage/movimientosStorage";
import "./App.scss";
import Movimiento from "./components/Movimiento";
import FormMovimiento from "./components/FormMovimientos";
import Dashboard from "./components/DashboardGrafica";

function App() {
  const [movimientos, setMovimientos] = useState([]);
  const [tipoActivo, setTipoActivo] = useState(null); // "ingreso" | "gasto"

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

  useEffect(() => {
    const cargar = async () => {
      const datos = await leerMovimientos();
      setMovimientos(datos);
    };

    cargar();
  }, []);

  return (
    <div className="app">
      <div className="cabecera">
        <h1>Devposit</h1>
        <p>Tu app para manejar tus movimientos</p>
      </div>
      <div className="grafica">
        <p>El saldo actual es de:</p>
        <hr />
        <strong>
          {" "}
          {movimientos
            .reduce(
              (total, m) =>
                m.tipo === "ingreso" ? total + m.cantidad : total - m.cantidad,
              0,
            )
            .toFixed(2)}{" "}
          €
        </strong>
        <hr />
        <Dashboard movimientos={movimientos} />
      </div>
      <div className="controles">
        <button onClick={() => setTipoActivo("ingreso")}>Ingreso</button>
        <button onClick={() => setTipoActivo("gasto")}>Gasto</button>
      </div>
      <div className="popUpMovimiento">
        {tipoActivo && (
          <FormMovimiento
            tipo={tipoActivo}
            onGuardar={agregarMovimiento}
            onCerrar={() => setTipoActivo(null)}
          />
        )}
        <p>Lista de todos los movimientos del mes</p>
      </div>
      <hr />
      <div className="listaMovimientos">
        {[...movimientos].map((m, i) => (
          <Movimiento key={i} {...m} />
        ))}
      </div>
    </div>
  );
}

export default App;
