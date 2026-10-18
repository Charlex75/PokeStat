# PokeStat

Misión M2 · Async Odyssey — Web Development I.

Juego de «más o menos» con las estadísticas de los Pokémon. Aparecen dos Pokémon y una estadística (PS, Ataque, Defensa, Ataque especial, Defensa especial o Velocidad). Ves el valor del de la izquierda y tienes que adivinar si el de la derecha tiene más o menos. Si aciertas, el de la derecha pasa a la izquierda y entra uno nuevo; si fallas, se acaba la partida.

La idea viene de que me encantan los Pokémon y últimamente me salían muchos vídeos comparando estadísticas sin sentido (un Pokémon normal con más defensa que un legendario y cosas así). Me hacía gracia convertir eso en un juego.

## Cómo probarlo

```bash
npm install
npm run dev
```

Abre http://localhost:5173. Con `npm run build` se genera la versión final en `dist/`.

- Pulsa «▲ Más» o «▼ Menos».
- La racha actual y el récord se ven debajo de los botones. El récord se guarda en el navegador.
- Los Pokémon que ya han salido se guardan en `localStorage` (bonus de la misión), así que no se vuelven a pedir a la API.

## Estructura

```
src/
├── main.js        → punto de entrada: conecta los módulos y gestiona los eventos
├── api.js         → peticiones a PokéAPI, limpieza y validación de datos (sin DOM)
├── game.js        → estado de la partida, racha, récord y reglas (sin fetch ni DOM)
├── render.js      → todo lo que toca el DOM (sin fetch ni reglas)
├── almacen.js     → lectura y escritura en localStorage, sin romper si falla
├── constantes.js  → valores compartidos (estadísticas e imagen por defecto)
├── style.css
└── fonts/         → fuente Pokemon Solid para el título
public/
└── pokeball.png   → imagen por defecto si un Pokémon no tiene imagen o no carga
```

## Uso de IA

He usado **Claude Code** (Anthropic) durante todo el proyecto, pero no como «hazme el ejercicio». Al empezar le propuse este plan:

> «Mi idea para desarrollar esta tarea es que fracciones su desarrollo de 5 a 7 fases. La primera sería montar el proyecto, que te harías cargo tú; desde ahí, por etapa, solo te encargarías de asesorarme en las siguientes etapas, yo las hago, tú las corriges de ser necesario.»

**Qué hizo la IA directamente:**

- **Montar el proyecto:** `package.json`, `.gitignore`, el `index.html` inicial y los módulos vacíos con su responsabilidad comentada. Me explicó para qué sirve cada archivo, por qué Vite y por qué `node_modules` no se sube.
- **El CSS entero**, incluido el tema nocturno y la fuente del título. También añadió en el HTML los contenedores y clases que necesitaba para maquetar (`.arena`, `.controles`, `.marcadores`, `.carta`). Le pedí esto porque el CSS me parecía la parte más tediosa y menos relevante para la misión: «Respecto al CSS, hazlo tú… sé que tú vas a hacer un mejor trabajo que yo».
- **Algunos cambios pequeños que le pedí:**
  - conectar la imagen por defecto con `?.` y `??` en `api.js`, explicándome cómo funcionan;
  - sacar las constantes duplicadas a `constantes.js`;
  - mostrar el récord en pantalla (`pintarRecord`);
  - el comentario del `catch` de `almacen.js`.
- **Este README**, a partir de lo que pasó realmente en el proceso y con lo que le conté.

**Qué hice yo, siguiendo sus instrucciones fase a fase:**

- `api.js`: el `fetch` con async/await, la comprobación de `response.ok`, la limpieza de datos con `map`, `Object.fromEntries` y `reduce`, la validación con `every` y la caché.
- `game.js`: el estado de la partida, las reglas, la gestión de empates y el récord.
- `render.js`: las funciones que pintan en el DOM y el respaldo de la imagen cuando no carga.
- `main.js`: la orquestación con `Promise.all`, los estados de carga y error, el reintento y los listeners.
- `almacen.js`.

**Cómo la usé como asesora:**

- Al final de cada fase me revisaba el código y me señalaba los fallos en lugar de arreglarlos ella. Por ejemplo:
  - en la fase 3 se me olvidó un `await` delante de `response.json()`;
  - al reintentar después de un error de red se mostraba la racha de la partida anterior.
- En la fase de robustez me dio ideas de qué podía fallar:
  - una imagen que existe pero no carga, y el bucle infinito si la imagen de respaldo también falla;
  - Pokémon con estadísticas incompletas;
  - nombres compuestos con guiones, como `mr-mime`;
  - el mismo Pokémon en los dos lados.
- En cada fase me dejaba preguntas de defensa (por qué `Promise.all` y no dos `await` seguidos, por qué `??` y no `||`, por qué `obtenerPartida` devuelve una copia…).

**Verificación:**

- Probé cada fase en el navegador antes de pasar a la siguiente: aciertos, fallos, recargar la página y el modo «Sin conexión» de DevTools.
- La IA, además, comprobó la lógica con scripts de Node: peticiones reales a PokéAPI (Pikachu, Shuckle, Mr. Mime…) y datos falsos para forzar los errores de validación. También compilaba el proyecto con `vite build` y revisaba el resultado en un navegador.

## Autopsia

1. **Usar PokéAPI aunque fuera la API del ejemplo del enunciado.** Sabía que mucha gente de clase la iba a usar, y la IA me propuso alternativas menos vistas (Open-Meteo, REST Countries, Open Trivia DB…). Las descarté porque me encantan los Pokémon y prefería hacer algo que me motivara. Para que no fuera «otra Pokédex más», la originalidad la puse en la mecánica: un juego de más o menos en vez de un buscador.

2. **Qué pasa cuando los dos Pokémon empatan en la estadística.** Al principio hice que el empate contara como acierto, dijeras «más» o «menos». No me convenció, porque así el jugador gana una ronda sin haber adivinado nada. Lo cambié para que **no pueda haber empates**: si los valores coinciden, se pide otro Pokémon para la derecha, con un máximo de 10 intentos para no quedarse en un bucle infinito (`evitarEmpate` en `main.js`). Esto también evita que salga el mismo Pokémon en los dos lados, porque todas sus estadísticas serían iguales. Descarté la otra opción que valoramos, cambiar la estadística en lugar del Pokémon: ahorraría peticiones a la red, pero la estadística ya no sería del todo aleatoria.

## Créditos

- Datos e imágenes de los Pokémon: [PokéAPI](https://pokeapi.co/).
- Imagen de la Pokéball: descargada de Wikipedia.
- Fuente del título: «Pokemon Solid», fuente gratuita para uso personal.
- Pokémon y sus nombres son marcas de Nintendo, Game Freak y The Pokémon Company. Este es un proyecto educativo sin ánimo de lucro.
