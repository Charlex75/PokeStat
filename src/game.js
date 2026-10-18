// Reglas y estado del juego: sin fetch ni DOM.
import { STATS } from "./constantes.js";
import { leer, guardar } from "./almacen.js";

const TOTAL_POKEMON = 1025;
const CLAVE_RECORD = "pokestat-record";

const recordGuardado = leer(CLAVE_RECORD);

let record =
  Number.isSafeInteger(recordGuardado) && recordGuardado >= 0
    ? recordGuardado
    : 0;

const partida = {
  izquierdo: null,
  derecho: null,
  stat: null,
  racha: 0,
};

export function idAleatorio() {
  return Math.floor(Math.random() * TOTAL_POKEMON) + 1;
}

export function statAleatoria() {
  const indice = Math.floor(Math.random() * STATS.length);
  return STATS[indice];
}

export function iniciarPartida(izquierdo, derecho) {
  partida.izquierdo = izquierdo;
  partida.derecho = derecho;
  partida.stat = statAleatoria();
  partida.racha = 0;
}

export function responder(eleccion) {
  const valorIzquierdo = partida.izquierdo.stats[partida.stat];
  const valorDerecho = partida.derecho.stats[partida.stat];

  const acierto =
    (eleccion === "mas" && valorDerecho > valorIzquierdo) ||
    (eleccion === "menos" && valorDerecho < valorIzquierdo);

  if (acierto) {
    partida.racha += 1;
  } else if (partida.racha > record) {
    record = partida.racha;
    guardar(CLAVE_RECORD, record);
  }

  return acierto;
}

export function avanzarRonda(nuevo) {
  partida.izquierdo = partida.derecho;
  partida.derecho = nuevo;
  partida.stat = statAleatoria();
}

export function obtenerPartida() {
  return { ...partida };
}

export function hayEmpate() {
  return (
    partida.izquierdo.stats[partida.stat] ===
    partida.derecho.stats[partida.stat]
  );
}

export function cambiarPokemonDerecho(nuevo) {
  partida.derecho = nuevo;
}

export function obtenerRecord() {
  return record;
}