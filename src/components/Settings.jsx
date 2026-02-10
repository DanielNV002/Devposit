import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { leerTema, guardarTema } from "../storage/temaStorage";
import "./Settings.scss";
import { THEMES } from "../themes/themes";
import { aplicarTema } from "../themes/themeManager";

function Settings({ onVolver }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [temaSeleccionado, setTemaSeleccionado] = useState("dark");

  const seleccionarTema = (key) => {
    setTemaSeleccionado(key);
    aplicarTema(THEMES[key].colores);
  };

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

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (e.deltaX > 0) {
        setIsDragging(true);
        setDragX(Math.min(e.deltaX, 120));
      }
    },

    onSwiped: (e) => {
      setIsDragging(false);
      setDragX(0);

      if (e.deltaX > 80) {
        onVolver();
      }
    },

    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });

  useEffect(() => {
    async function cargarTema() {
      const temaGuardado = await leerTema();

      if (temaGuardado?.nombre && THEMES[temaGuardado.nombre]) {
        setTemaSeleccionado(temaGuardado.nombre);
        aplicarTema(THEMES[temaGuardado.nombre].colores);
      } else {
        setTemaSeleccionado("dark");
        aplicarTema(THEMES.dark.colores);
      }
    }

    cargarTema();
  }, []);

  const guardar = async () => {
    await guardarTema({ nombre: temaSeleccionado });
  };

  const resetearTema = async () => {
    setTemaSeleccionado("dark");
    await aplicarTema(THEMES.dark.colores);
    await guardarTema({ nombre: "dark" });
  };

  return (
    <div className="settings" {...handlers}>
      <div
        className="home-indicator"
        style={{
          opacity: Math.min(dragX / 80, 1),
        }}
      >
        Home
      </div>
      <hr />
      <h2>Tema de Aplicacion</h2>
      <hr />
      <div className="lista-temas">
        {Object.entries(THEMES).map(([key, tema]) => (
          <button
            key={key}
            className={temaSeleccionado === key ? "activo" : ""}
            onClick={() => seleccionarTema(key)}
          >
            {tema.nombre}
          </button>
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
      <button
        onClick={async (e) => {
          e.currentTarget.blur();
          await resetearTema();
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default Settings;
