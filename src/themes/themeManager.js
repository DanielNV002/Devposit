export const aplicarTema = (tema) => {
  Object.entries(tema).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value);
  });
};
