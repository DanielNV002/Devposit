const KEY = "historial";

export const leerHistorial = async () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : {};
};

export const guardarHistorial = async (historial) => {
  localStorage.setItem(KEY, JSON.stringify(historial));
};
