// Almacenamiento opcional
export function leer(clave) {
  try {
    const contenido = localStorage.getItem(clave);
    return JSON.parse(contenido);
  } catch {
    return null;
  }
}

export function guardar(clave, valor) {
  try {
    const contenido = JSON.stringify(valor);
    localStorage.setItem(clave, contenido);
  } catch {
    // Si no se puede guardar (modo privado, almacenamiento lleno...), el juego sigue sin caché
  }
}