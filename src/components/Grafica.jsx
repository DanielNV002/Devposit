import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../components/Grafica.scss";

function GraficaSaldo({ data }) {
  return (
    <div className="graficaSaldo">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis width={35} />
          <Line
            type="monotone"
            dataKey="saldo"
            stroke={getComputedStyle(document.documentElement)
              .getPropertyValue("--color-texto-primario")
              .trim()}
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficaSaldo;
