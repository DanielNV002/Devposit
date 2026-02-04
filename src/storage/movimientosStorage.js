import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

const FILE_NAME = "movimientos.json";

/**
 * Lee los movimientos desde el archivo JSON
 */
export async function leerMovimientos() {
  try {
    const result = await Filesystem.readFile({
      path: FILE_NAME,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    return JSON.parse(result.data);
  } catch (error) {
    // Si el archivo no existe, devolvemos array vacío
    return [];
  }
}

/**
 * Guarda (sobrescribe) todos los movimientos en el archivo JSON
 */
export async function guardarMovimientos(movimientos) {
  await Filesystem.writeFile({
    path: FILE_NAME,
    data: JSON.stringify(movimientos, null, 2),
    directory: Directory.Data,
    encoding: Encoding.UTF8,
  });
}
