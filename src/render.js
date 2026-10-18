// Presentación: recibe datos y los muestra en el DOM.
import { IMAGEN_POR_DEFECTO } from "./constantes.js";

const cartas = {
  izquierda: document.querySelector("#carta-izquierda"),
  derecha: document.querySelector("#carta-derecha"),
};

const pregunta = document.querySelector("#pregunta");
const estado = document.querySelector("#estado");
const rachaElemento = document.querySelector("#racha");
const botonMas = document.querySelector("#boton-mas");
const botonMenos = document.querySelector("#boton-menos");
const finPartida = document.querySelector("#fin-partida");
const mensajeFin = finPartida.querySelector("p");

const NOMBRES_STATS = {
  hp: "PS",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "Ataque especial",
  "special-defense": "Defensa especial",
  speed: "Velocidad",
};

Object.values(cartas).forEach(carta => {
  const imagen = carta.querySelector("img");

  imagen.addEventListener("error", () => {
    if (imagen.getAttribute("src") !== IMAGEN_POR_DEFECTO) {
      imagen.src = IMAGEN_POR_DEFECTO;
    }
  });
});

export function pintarPokemon(carta, pokemon) {
  const elemento = cartas[carta];
  const imagen = elemento.querySelector("img");
  const nombre = pokemon.nombre.replaceAll("-", " ");

  imagen.src = pokemon.imagen;
  imagen.alt = nombre;
  elemento.querySelector(".nombre").textContent = nombre;
}

export function pintarValor(carta, valor) {
  cartas[carta].querySelector(".valor").textContent = valor;
}

export function pintarPregunta(stat) {
  pregunta.textContent = `¿Quién tiene más ${NOMBRES_STATS[stat]}?`;
}

export function mostrarCargando() {
  estado.textContent = "Cargando Pokémon...";
  estado.hidden = false;
}

export function mostrarError(mensaje) {
  estado.textContent = mensaje;
  estado.hidden = false;
}

export function ocultarEstado() {
  estado.textContent = "";
  estado.hidden = true;
}

export function pintarRacha(racha) {
  rachaElemento.textContent = `Racha: ${racha}`;
}

export function bloquearBotones(bloqueado) {
  botonMas.disabled = bloqueado;
  botonMenos.disabled = bloqueado;
}

export function limpiarResultado() {
  cartas.derecha.classList.remove("acierto", "fallo");
}

export function marcarResultado(acierto) {
  limpiarResultado();
  cartas.derecha.classList.add(acierto ? "acierto" : "fallo");
}

export function mostrarFinPartida(racha) {
  mensajeFin.textContent = `Fin de partida. Racha conseguida: ${racha}.`;
  finPartida.hidden = false;
}

export function ocultarFinPartida() {
  finPartida.hidden = true;
}

export function mostrarReintento() {
  mensajeFin.textContent = "";
  finPartida.hidden = false;
}