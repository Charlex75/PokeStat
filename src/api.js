// Peticiones a PokéAPI: sin DOM.
import { STATS, IMAGEN_POR_DEFECTO } from "./constantes.js";

const URL_BASE = "https://pokeapi.co/api/v2";

function limpiarPokemon(datos) {
  if (!Array.isArray(datos.stats)) {
    throw new Error("El Pokémon no tiene una lista de estadísticas válida.");
  }

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
    imagen:
      datos.sprites?.other?.["official-artwork"]?.front_default ??
      IMAGEN_POR_DEFECTO,
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
  const pokemon = limpiarPokemon(datos);

  const statsValidas = STATS.every(
    stat =>
      Object.hasOwn(pokemon.stats, stat) &&
      Number.isFinite(pokemon.stats[stat]) &&
      pokemon.stats[stat] >= 0
  );

  if (!statsValidas) {
    throw new Error(
      `El Pokémon ${pokemon.nombre} no tiene las seis estadísticas válidas.`
    );
  }

  return pokemon;
}