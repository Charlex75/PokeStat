// Peticiones a PokéAPI: pedir datos y devolverlos ya limpios, nada de DOM aquí
const URL_BASE = "https://pokeapi.co/api/v2";

export async function obtenerPokemon(id) {
  const response = await fetch(`${URL_BASE}/pokemon/${id}`);

  if (!response.ok) {
    throw new Error(`No se pudo capturar este pokemon: ${response.status}`);
  }

  return await response.json();
}