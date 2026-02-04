import Grafica from "./Grafica";

function generarSerieSaldoDiario(movs) {
  // Ordenar por fecha
  const ordenados = [...movs].sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha),
  );

  // Objeto para agrupar por fecha
  const diario = {};

  ordenados.forEach((m) => {
    const dia = new Date(m.fecha).toLocaleDateString("es-ES");
    diario[dia] =
      m.tipo === "ingreso"
        ? (diario[dia] || 0) + m.cantidad
        : (diario[dia] || 0) - m.cantidad;
  });

  // Convertir a saldo acumulado
  let saldoAcumulado = 0;
  const serie = Object.keys(diario)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((dia) => {
      saldoAcumulado += diario[dia];
      return { fecha: dia, saldo: saldoAcumulado };
    });

  return serie;
}

function Dashboard({ movimientos }) {
  const datosGrafica = generarSerieSaldoDiario(movimientos);

  return <Grafica data={datosGrafica} />;
}

export default Dashboard;
