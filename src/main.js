// Punto de entrada: conecta los módulos y arranca el juego
import "./style.css";
import { obtenerPokemon } from "./api.js";

// Prueba temporal: borrar en la fase 4.
async function probarPokemon() {
  try {
    const pokemon = await obtenerPokemon(25);
    console.log(pokemon);
  } catch (error) {
    console.error(error);
  }
}

probarPokemon();