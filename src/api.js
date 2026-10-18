// Peticiones a PokéAPI: pedir datos y devolverlos ya limpios, nada de DOM aquí
const URL_BASE = "https://pokeapi.co/api/v2";

function limpiarPokemon(datos) {
  const stats = Object.fromEntries(
    datos.stats.map(({ stat, base_stat }) => [stat.name, base_stat])
  );

  const total = datos.stats.reduce(
    (suma, stat) => suma + stat.base_stat,
    0
  );

  return {
    id: datos.id,
    nombre: datos.name,
    imagen: datos.sprites.other["official-artwork"].front_default,
    stats,
    total,
  };
}

export async function obtenerPokemon(id) {
  const response = await fetch(`${URL_BASE}/pokemon/${id}`);

  if (!response.ok) {
    throw new Error(`No se pudo capturar este pokemon: ${response.status}`);
  }

  const datos = await response.json();
  return limpiarPokemon(datos);
}