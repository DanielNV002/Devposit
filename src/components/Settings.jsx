import { useEffect, useState } from "react";
import { leerTema, guardarTema } from "../storage/temaStorage";
import "./Settings.scss";

function Settings({ onVolver }) {
  const VARIABLES_TEMA = {
    "color-fondo": "Color del fondo",
    "color-borde-modal": "Borde del modal",
    "color-fondo-modal": "Fondo del modal",
    "color-fondo-botones": "Fondo de botones",
    "color-fondo-botones-focus": "Fondo botones (focus)",
    "color-fondo-grafica": "Fondo de gráfica",
    "color-texto": "Color del texto",
    "color-texto-primario": "Texto primario",
    "color-ingreso": "Color de Ingreso",
    "color-gasto": "Color de Gasto",
    "color-cancelar": "Color cancelar",
    "color-cancelar-focus": "Cancelar (focus)",
  };

  useEffect(() => {
    async function cargarTema() {
      const temaGuardado = await leerTema();
      if (temaGuardado) {
        setTema(temaGuardado);
        Object.entries(temaGuardado).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--${key}`, value);
        });
      }
    }
    cargarTema();
  }, []);

  const cambiarColor = (key, value) => {
    setTema({ ...tema, [key]: value });
    document.documentElement.style.setProperty(`--${key}`, value);
  };

  const guardar = async () => {
    await guardarTema(tema);
  };

  const [tema, setTema] = useState(() => {
    const estilos = getComputedStyle(document.documentElement);
    const obj = {};

    Object.keys(VARIABLES_TEMA).forEach((key) => {
      obj[key] = estilos.getPropertyValue(`--${key}`).trim();
    });

    return obj;
  });

  return (
    <div className="settings">
      <div className="settings-header">
        <button className="volver" onClick={onVolver}>
          Volver
        </button>
      </div>
      <hr />
      <h2>Colores</h2>
      <hr />
      <div className="modal-colores">
        {Object.entries(tema).map(([key, value]) => (
          <label key={key}>
            {VARIABLES_TEMA[key]}
            <input
              type="color"
              value={value}
              onChange={(e) => cambiarColor(key, e.target.value)}
            />
          </label>
        ))}
      </div>

      <button
        onClick={async (e) => {
          e.currentTarget.blur();
          await guardar();
        }}
      >
        Guardar
      </button>
    </div>
  );
}

export default Settings;
