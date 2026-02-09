import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

const FILE_NAME = "tema.json";

export async function leerTema() {
  try {
    const result = await Filesystem.readFile({
      path: FILE_NAME,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
    return JSON.parse(result.data);
  } catch {
    return null;
  }
}

export async function guardarTema(tema) {
  await Filesystem.writeFile({
    path: FILE_NAME,
    data: JSON.stringify(tema, null, 2),
    directory: Directory.Data,
    encoding: Encoding.UTF8,
  });
}
