import "./style.css";
import { obtenerPokemon } from "./api.js";
import {
  idAleatorio,
  iniciarPartida,
  responder,
  avanzarRonda,
  obtenerPartida,
  hayEmpate,
  cambiarPokemonDerecho,
} from "./game.js";
import {
  pintarPokemon,
  pintarValor,
  pintarPregunta,
  mostrarCargando,
  mostrarError,
  ocultarEstado,
  pintarRacha,
  bloquearBotones,
  marcarResultado,
  limpiarResultado,
  mostrarFinPartida,
  ocultarFinPartida,
  mostrarReintento,
} from "./render.js";

const botonMas = document.querySelector("#boton-mas");
const botonMenos = document.querySelector("#boton-menos");
const botonReiniciar = document.querySelector("#boton-reiniciar");

let aceptaRespuesta = false;

function pintarRonda() {
  const { izquierdo, derecho, stat, racha } = obtenerPartida();

  pintarPokemon("izquierda", izquierdo);
  pintarPokemon("derecha", derecho);
  pintarPregunta(stat);
  pintarValor("izquierda", izquierdo.stats[stat]);
  pintarValor("derecha", "?");
  pintarRacha(racha);
}

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function evitarEmpate() {
  const MAX_INTENTOS = 10;

  for (let intento = 0; intento < MAX_INTENTOS; intento++) {
    if (!hayEmpate()) return;

    const nuevo = await obtenerPokemon(idAleatorio());
    cambiarPokemonDerecho(nuevo);
  }

  if (hayEmpate()) {
    throw new Error(
      "No se pudo preparar una ronda sin empate. Prueba otra vez."
    );
  }
}

async function empezarPartida() {
  aceptaRespuesta = false;
  botonReiniciar.disabled = true;
  bloquearBotones(true);
  ocultarFinPartida();
  limpiarResultado();
  pintarRacha(0);
  mostrarCargando();

  try {
    const [izquierdo, derecho] = await Promise.all([
      obtenerPokemon(idAleatorio()),
      obtenerPokemon(idAleatorio()),
    ]);

    iniciarPartida(izquierdo, derecho);
    await evitarEmpate();

    pintarRonda();
    ocultarEstado();

    aceptaRespuesta = true;
    bloquearBotones(false);
  } catch (error) {
    mostrarError(error.message);
    mostrarReintento();
  } finally {
    botonReiniciar.disabled = false;
  }
}

async function manejarRespuesta(eleccion) {
  if (!aceptaRespuesta) return;

  aceptaRespuesta = false;
  bloquearBotones(true);

  const acierto = responder(eleccion);
  const { derecho, stat, racha } = obtenerPartida();

  pintarValor("derecha", derecho.stats[stat]);
  pintarRacha(racha);
  marcarResultado(acierto);

  if (!acierto) {
    mostrarFinPartida(racha);
    return;
  }

  try {
    const [nuevo] = await Promise.all([
      obtenerPokemon(idAleatorio()),
      esperar(1500),
    ]);

    avanzarRonda(nuevo);
    await evitarEmpate();

    pintarRonda();
    limpiarResultado();

    aceptaRespuesta = true;
    bloquearBotones(false);
  } catch (error) {
    mostrarError(error.message);
    mostrarReintento();
  }
}

// Los listeners se registran una sola vez.
botonMas.addEventListener("click", () => manejarRespuesta("mas"));
botonMenos.addEventListener("click", () => manejarRespuesta("menos"));
botonReiniciar.addEventListener("click", empezarPartida);

empezarPartida();