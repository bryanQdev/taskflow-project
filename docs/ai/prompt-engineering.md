#Prompt con rol (Rol prompting)

# Prompt 1
Actúa como un desarrollador senior con 10 años de experiencia en JavaScript.
Revisa esta función e identifica problemas de rendimiento, legibilidad y posibles bugs. Sè directo y especifico:
```

searchInput.addEventListener("input", filterTask);
function filterTask(){
    
    const searchText= searchInput.value.toLowerCase();

    
    const todasLasTareas = taskList.querySelectorAll(".deberes");
        
    
    todasLasTareas.forEach(function(tarea){
        
        const textoTarea = tarea.querySelector("h2").textContent.toLowerCase();
        
        
            if(textoTarea.includes(searchText)){
                tarea.style.display= "flex";
            } else{
                //Si no, lo ocultamos
                tarea.style.display = "none";
            }
        } );
    };

```


##Respuesta de la IA:


## Problemas encontrados

### 🔴 Bug crítico — Crash garantizado

```javascript
const textoTarea = tarea.querySelector("h2").textContent.toLowerCase();
//                                          ^^^
// Si no existe el h2, .textContent explota con:
// "Cannot read properties of null"
```

**Fix:**

```javascript
const h2 = tarea.querySelector("h2");
if (!h2) return;
const textoTarea = h2.textContent.toLowerCase();
```

---

### 🟠 Problema de rendimiento — DOM query en cada pulsación de tecla

```javascript
// ❌ Re-consulta el DOM en cada evento "input"
const todasLasTareas = taskList.querySelectorAll(".deberes");
```

`querySelectorAll` es costoso. Con pocas tareas no se nota, pero escala mal. El DOM **no debería ser la fuente de verdad** — el array `tareas` ya existe en memoria.

**Fix — filtrar sobre el array y re-renderizar:**

```javascript
function filterTask() {
    const searchText = searchInput.value.trim().toLowerCase();

    taskList.querySelectorAll(".deberes").forEach(el => el.remove());

    tareas
        .filter(t => t.text.toLowerCase().includes(searchText))
        .forEach(renderTask);
}
```

---

### 🟡 Rendimiento — Sin debounce

El evento `input` dispara en **cada pulsación**. Con 200 tareas, estás manipulando el DOM 200 veces por tecla.

**Fix:**

```javascript
searchInput.addEventListener("input", debounce(filterTask, 200));

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
```

---

### 🟡 Legibilidad — `.trim()` ausente

```javascript
// ❌ Un espacio inicial haría que "  comprar" no matchee "comprar"
const searchText = searchInput.value.toLowerCase();

// ✅ Correcto
const searchText = searchInput.value.trim().toLowerCase();
```

---

### 🟢 Legibilidad — `function` anónima innecesaria

```javascript
// ❌ Verboso e inconsistente con el resto del código
todasLasTareas.forEach(function(tarea) { ... });

// ✅ Consistente con el estilo del proyecto
todasLasTareas.forEach((tarea) => { ... });
```

---

## ✅ Versión final corregida

```javascript
searchInput.addEventListener("input", debounce(filterTask, 200));

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function filterTask() {
    const searchText = searchInput.value.trim().toLowerCase();

    taskList.querySelectorAll(".deberes").forEach(el => el.remove());

    tareas
        .filter(tarea => tarea.text.toLowerCase().includes(searchText))
        .forEach(renderTask);
}
```

---

## Resumen de problemas

| Problema | Severidad |
|---|---|
| Crash si no existe `h2` | 🔴 Crítico |
| DOM como fuente de verdad | 🟠 Alto |
| Sin debounce | 🟡 Medio |
| Sin `.trim()` | 🟡 Medio |
| `function` anónima innecesaria | 🟢 Bajo |


```
## Por qué funciona?

El rol activa un "modo" más crítico y técnico. La IA ajusta el nivel de detalle y el vocabulario al perfil pedido.

```



# Promt 2
Actúa como un experto en seguridad web. Analiza este código de una 
app de tareas y dime qué vulnerabilidades tiene, especialmente relacionados con la  manipulación del DOM y datos en localStorage.
Propón el código corregido:

---

## Mapa de vulnerabilidades

```
[Input usuario] ──► addTask()            ──► renderTask() ◄── [localStorage]
                    (sin sanitización)        ↑                (confía en datos externos)
                                         classList → XSS ✗
                                         dataset   → XSS ✗
                                         textContent    ✓
```

---

## Vulnerabilidades encontradas

### 🔴 Crítico — XSS via `classList.add`

```javascript
// renderTask() — línea ofensiva:
clone.querySelector(".prioridad").classList.add(tarea.prioridad);
//                                                ^^^^^^^^^^^^^^
// Si tarea.prioridad viene del localStorage con el valor:
// "bajaalert(1)"
// classList.add lo inyecta como clase CSS en el DOM.
```

Un atacante que pueda modificar el localStorage (XSS previo, extensión maliciosa) puede inyectar clases arbitrarias. Aunque `classList.add` no ejecuta JS directamente, **abre la puerta a CSS injection** para exfiltrar datos o alterar visualmente la UI.

**✅ Fix — whitelist estricta:**

```javascript
const PRIORIDADES_VALIDAS = new Set(["baja", "media", "alta"]);

function renderTask(tarea) {
    const prioridad = PRIORIDADES_VALIDAS.has(tarea.prioridad)
        ? tarea.prioridad
        : "media"; // fallback seguro

    clone.querySelector(".prioridad").classList.add(prioridad);
}
```

---

### 🔴 Crítico — Prototype Pollution via `localStorage`

```javascript
function loadTasksFromStorage() {
    const parsed = JSON.parse(storedTasks); // ← sin schema
    const normalized = parsed.map(normalizeTask); // normaliza, pero incompleto
}
```

`normalizeTask` solo protege `id`, `text` y `prioridad`. Un payload como este en el localStorage pasaría sin problemas:

```json
[{
  "__proto__": { "isAdmin": true },
  "id": "abc",
  "text": "tarea normal",
  "prioridad": "alta"
}]
```

**✅ Fix — validación de schema explícita:**

```javascript
const CAMPOS_PERMITIDOS = new Set(["id", "text", "prioridad"]);

function isValidTask(task) {
    return (
        task !== null &&
        typeof task === "object" &&
        !Array.isArray(task) &&
        Object.keys(task).every(k => CAMPOS_PERMITIDOS.has(k))
    );
}

const normalized = parsed
    .filter(isValidTask)
    .map(normalizeTask);
```

---

### 🔴 Crítico — Sin límite de tamaño (DoS / Storage Exhaustion)

```javascript
function addTask() {
    const text = input.value; // puede ser 10MB de texto
    tareas.push(tarea);
    saveTasksToStorage(); // localStorage tiene límite ~5MB → QuotaExceededError
}
```

Un usuario (o script) puede llenar el localStorage hasta que explote silenciosamente, rompiendo toda la app para esa sesión.

**✅ Fix:**

```javascript
const MAX_CHARS = 500;
const MAX_TAREAS = 100;

function addTask() {
    if (tareas.length >= MAX_TAREAS) {
        // mostrar error al usuario
        return;
    }
    const text = input.value.trim().slice(0, MAX_CHARS);
    // ...
}

function saveTasksToStorage() {
    try {
        localStorage.setItem("tareas", JSON.stringify(tareas));
    } catch (e) {
        if (e.name === "QuotaExceededError") {
            // notificar al usuario
        }
    }
}
```

---

### 🟡 Medio — `input.value` sin `.trim()` permite bypass de validación

```javascript
function addTask() {
    const text = input.value; // ← sin trim

    if (!validarLongitudTarea(text)) { // validarLongitud SÍ hace trim internamente
        return;
    }

    const tarea = { text: text }; // pero se guarda CON espacios
}
```

`"  a  "` pasa la validación (5 chars con trim), pero se guarda como `"  a  "`. Inconsistencia entre lo que se valida y lo que se persiste.

**✅ Fix:**

```javascript
const text = input.value.trim();
```

---

### 🟡 Medio — Sin Content Security Policy (CSP)

La app no define ningún header ni meta-tag CSP. Si existiera cualquier vector de XSS, el navegador ejecutaría scripts inyectados sin ninguna restricción. Para una app con `localStorage` esto es especialmente peligroso porque un XSS puede leer y modificar todas las tareas.

**✅ Fix mínimo (meta tag):**

```html

```

---

### 🟢 Bajo — `getTasksFromLocalStorage` nunca se usa

```javascript
// Esta función existe pero no se llama en ningún lugar del código.
// Es superficie de ataque innecesaria y genera confusión.
function getTasksFromLocalStorage() { ... }
```

**✅ Fix:** Eliminar la función. La lógica ya está cubierta por `loadTasksFromStorage`.

---

## Lo que está bien hecho ✅

```javascript
// textContent previene XSS directamente — correcto.
clone.querySelector(".tarea-texto").textContent = tarea.text;
```

El uso de `textContent` en lugar de `innerHTML` es la decisión correcta y evita el vector de XSS más obvio. El problema está en las propiedades adyacentes (`classList`, `dataset`) que tienen menos protección implícita.

---

## Resumen

| Vulnerabilidad | Severidad | Vector |
|---|---|---|
| XSS via `classList.add` | 🔴 Crítico | localStorage manipulado / CSS injection |
| Prototype pollution | 🔴 Crítico | JSON sin validación de schema |
| DoS / QuotaExceededError | 🔴 Crítico | Sin límite de tamaño ni manejo de error |
| `input.value` sin `.trim()` | 🟡 Medio | Bypass de validación |
| Sin Content Security Policy | 🟡 Medio | Sin mitigación ante XSS |
| Función `getTasksFromLocalStorage` sin usar | 🟢 Bajo | Superficie de ataque innecesaria |

```
Y por què funciona?
Porque el rol de seguridad orienta la respuesta hacia vectores de ataque que en un review normal se ignorarían.

```



#Prompt 3
Few-shot: Generar tests unitarios

Quiero tests unitarios con Jest para mi app de tareas. Te muestro el patrón:

EJEMPLO INPUT:
function sumar(a, b) { return a + b; }

EJEMPLO OUTPUT:
describe("sumar", () => {
  it("suma dos positivos", () => expect(sumar(2,3)).toBe(5));
  it("suma con negativos", () => expect(sumar(-1,1)).toBe(0));
});

Ahora genera tests con ese mismo patrón para esta función:

function removeTaskFromArray(text) {
    tareas = tareas.filter(function(task) {
        return task.text !== text;
    });
    localStorage.setItem("tareas", JSON.stringify(tareas));
}



## Respuesta:

# 🧪 Tests unitarios — `removeTaskFromArray`

> **Framework:** Jest
> **Función bajo test:** `removeTaskFromArray(text)` — filtra por texto y persiste en localStorage

---

## Patrón seguido

```javascript
// INPUT
function sumar(a, b) { return a + b; }

// OUTPUT
describe("sumar", () => {
    it("suma dos positivos",   () => expect(sumar(2, 3)).toBe(5));
    it("suma con negativos",   () => expect(sumar(-1, 1)).toBe(0));
});
```

---

## Función bajo test

```javascript
function removeTaskFromArray(text) {
    tareas = tareas.filter(function (task) {
        return task.text !== text;
    });
    localStorage.setItem("tareas", JSON.stringify(tareas));
}
```

---

## Tests completos

```javascript
// Mock de localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] ?? null,
        setItem: (key, value) => { store[key] = String(value); },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(global, "localStorage", { value: localStorageMock });

// --- Función bajo test ---
let tareas = [];

function removeTaskFromArray(text) {
    tareas = tareas.filter(function (task) {
        return task.text !== text;
    });
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

// --- Tests ---
describe("removeTaskFromArray", () => {

    beforeEach(() => {
        localStorage.clear();
        tareas = [
            { text: "Comprar leche" },
            { text: "Hacer ejercicio" },
            { text: "Estudiar Jest" },
        ];
    });

    // --- Comportamiento principal ---
    it("elimina la tarea cuyo texto coincide exactamente", () => {
        removeTaskFromArray("Comprar leche");
        expect(tareas).not.toContainEqual({ text: "Comprar leche" });
    });

    it("no elimina tareas con texto diferente", () => {
        removeTaskFromArray("Comprar leche");
        expect(tareas).toContainEqual({ text: "Hacer ejercicio" });
        expect(tareas).toContainEqual({ text: "Estudiar Jest" });
    });

    it("reduce el array en exactamente un elemento cuando el texto existe", () => {
        removeTaskFromArray("Hacer ejercicio");
        expect(tareas).toHaveLength(2);
    });

    // --- localStorage ---
    it("persiste el array actualizado en localStorage", () => {
        removeTaskFromArray("Estudiar Jest");
        const stored = JSON.parse(localStorage.getItem("tareas"));
        expect(stored).toEqual([
            { text: "Comprar leche" },
            { text: "Hacer ejercicio" },
        ]);
    });

    it("guarda un array vacío en localStorage si se elimina la única tarea", () => {
        tareas = [{ text: "Única tarea" }];
        removeTaskFromArray("Única tarea");
        const stored = JSON.parse(localStorage.getItem("tareas"));
        expect(stored).toEqual([]);
    });

    // --- Edge cases ---
    it("no modifica el array si el texto no existe", () => {
        removeTaskFromArray("Tarea inexistente");
        expect(tareas).toHaveLength(3);
    });

    it("elimina todas las tareas que comparten el mismo texto (duplicados)", () => {
        tareas = [
            { text: "Tarea duplicada" },
            { text: "Tarea duplicada" },
            { text: "Otra tarea" },
        ];
        removeTaskFromArray("Tarea duplicada");
        expect(tareas).toEqual([{ text: "Otra tarea" }]);
    });

    it("no elimina nada si el array está vacío", () => {
        tareas = [];
        removeTaskFromArray("Comprar leche");
        expect(tareas).toHaveLength(0);
    });

    it("es sensible a mayúsculas — no elimina si el case no coincide", () => {
        removeTaskFromArray("comprar leche"); // minúscula
        expect(tareas).toContainEqual({ text: "Comprar leche" });
    });

    it("es sensible a espacios — no elimina si hay espacios extra", () => {
        removeTaskFromArray("  Comprar leche  ");
        expect(tareas).toContainEqual({ text: "Comprar leche" });
    });
});
```

---

## Razonamiento por grupo

### Comportamiento principal
Verifica que la función hace lo que promete: elimina la tarea correcta, deja las demás intactas y reduce el array en exactamente uno.

### localStorage
Valida que la persistencia funciona, incluyendo el caso de quedarse con array vacío.

### Edge cases
Los más relevantes para esta función concretamente:

| Test | Por qué importa |
|---|---|
| **Duplicados** | La función filtra *todos* los que coincidan, no solo el primero. Puede ser un bug según lo que se espere. |
| **Case sensitivity** | `"comprar leche"` ≠ `"Comprar leche"` — la función no normaliza. |
| **Espacios extra** | `"  Comprar leche  "` no matchea. Conecta con el bug de `input.value` sin `.trim()`. |

---

## Cómo ejecutar

```bash
# Instalar Jest si no lo tienes
npm install --save-dev jest

# Ejecutar los tests
npx jest removeTaskFromArray.test.js

# Con cobertura
npx jest --coverage removeTaskFromArray.test.js
```

---

## Resultado esperado

```
PASS removeTaskFromArray.test.js
  removeTaskFromArray
    ✓ elimina la tarea cuyo texto coincide exactamente
    ✓ no elimina tareas con texto diferente
    ✓ reduce el array en exactamente un elemento cuando el texto existe
    ✓ persiste el array actualizado en localStorage
    ✓ guarda un array vacío en localStorage si se elimina la única tarea
    ✓ no modifica el array si el texto no existe
    ✓ elimina todas las tareas que comparten el mismo texto (duplicados)
    ✓ no elimina nada si el array está vacío
    ✓ es sensible a mayúsculas — no elimina si el case no coincide
    ✓ es sensible a espacios — no elimina si hay espacios extra

Tests: 10 passed, 10 total
```
```
Por què funciona? 
 El ejemplo elimina la ambigüedad de formato. Sin él, la IA varía mucho en estructura, nivel de detalle y nomenclatura.

```


````
# Prompt 4:


Documenta estas funciones con JSDoc siguiendo este formato exacto:

EJEMPLO INPUT:
function dividir(a, b) {
  if (b === 0) throw new Error("División por cero");
  return a / b;
}

EJEMPLO OUTPUT:
/**
 * Divide dos números.
 * @param {number} a - Dividendo.
 * @param {number} b - Divisor. No puede ser 0.
 * @returns {number} Resultado de la división.
 * @throws {Error} Si b es 0.
 */

Documenta estas dos funciones con el mismo formato:

function addTask() { ... }
function renderTask(tarea) { ... }

```

## `addTask()`

```javascript
/**
 * Crea una nueva tarea a partir del valor del input principal,
 * la valida, la persiste en localStorage y la renderiza en el DOM.
 *
 * @returns {void}
 *
 * @throws {void} No lanza errores — los fallos de validación se
 *                comunican mediante el elemento #mensaje-error-longitud.
 *
 * @example
 * // El usuario escribe "Comprar leche" y pulsa el botón
 * addTask();
 * // → Nueva tarea añadida al array, guardada en localStorage y visible en la UI
 */
function addTask() {
    const text = input.value;
    const mensajeError = document.getElementById("mensaje-error-longitud");

    if (!validarLongitudTarea(text)) {
        if (mensajeError) mensajeError.style.display = "block";
        return;
    } else {
        if (mensajeError) mensajeError.style.display = "none";
    }

    /** @type {Tarea} */
    const tarea = { id: crypto.randomUUID(), text: text, prioridad: prioridadSeleccionada };

    tareas.push(tarea);
    saveTasksToStorage();
    renderTask(tarea);
    input.value = "";
}
```

---

## `renderTask(tarea)`

```javascript
/**
 * Renderiza una tarea en la lista del DOM clonando el template HTML,
 * asigna su texto, prioridad y registra el evento de borrado.
 *
 * @param {Tarea} tarea - Objeto tarea a renderizar.
 * @param {string} tarea.id - Identificador único usado para el borrado.
 * @param {string} tarea.text - Texto descriptivo que se muestra en la UI.
 * @param {string} tarea.prioridad - Nivel de prioridad ("baja", "media" o "alta").
 *                                   Se añade como clase CSS al elemento de prioridad.
 *
 * @returns {void}
 *
 * @example
 * const tarea = { id: crypto.randomUUID(), text: "Estudiar Jest", prioridad: "alta" };
 * renderTask(tarea);
 * // → Nuevo elemento .deberes añadido a #taskList con texto y clase CSS "alta"
 */
function renderTask(tarea) {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".tarea-texto").textContent = tarea.text;
    clone.querySelector(".prioridad").textContent = tarea.prioridad;
    clone.querySelector(".prioridad").classList.add(tarea.prioridad);

    const tareaElemento = clone.querySelector(".deberes");
    tareaElemento.dataset.id = tarea.id;

    const deleteBtn = clone.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", function () {
        tareaElemento.remove();
        removeTaskFromArray(tarea.id);
    });

    taskList.appendChild(clone);
}
```

---

## Referencia rápida

| Función | Parámetros | Retorna | Efectos secundarios |
|---|---|---|---|
| `addTask()` | ninguno (lee `input.value`) | `void` | Modifica `tareas[]`, localStorage y DOM |
| `renderTask(tarea)` | `{Tarea}` objeto completo | `void` | Modifica el DOM, registra evento click |


```
Por què funciona?
 
Porque sin el ejemplo, el JSDoc generado varía mucho en completitud. El ejemplo fija el estándar exacto

```


# Prompt 5:
Este código tiene un bug: si añado dos tareas con el mismo texto
y elimino una, se eliminan las dos. Razona paso a paso:

1. ¿Qué debería hacer el código?
2. ¿Qué hace realmente?
3. ¿En qué línea exacta está el error?
4. ¿Por qué ocurre?
5. ¿Cómo se corrige?

const removeTaskFromArray = (id) => {
    tareas = tareas.filter(task => task.id !== id);
    saveTasksToStorage();
};


# Este código tiene un bug: si añado dos tareas con el mismo texto
y elimino una, se eliminan las dos. Razona paso a paso:

1. ¿Qué debería hacer el código?
2. ¿Qué hace realmente?
3. ¿En qué línea exacta está el error?
4. ¿Por qué ocurre?
5. ¿Cómo se corrige?

const removeTaskFromArray = (id) => {
    tareas = tareas.filter(task => task.id !== id);
    saveTasksToStorage();
};

Respuesta:

## 1. ¿Qué debería hacer?

Eliminar del array `tareas` únicamente la tarea cuyo `id` coincide con el
argumento recibido, y persistir el resultado en localStorage.

---

## 2. ¿Qué hace realmente?

Exactamente eso. En el código actual **este bug no existe** — filtra por `id`
único, no por `text`.

---

## 3. ¿En qué línea exacta estaría el error?

```javascript
// Código real — esta línea es CORRECTA ✅
const removeTaskFromArray = (id) => {
    tareas = tareas.filter(task => task.id !== id); // ← filtra por id único
    saveTasksToStorage();
};
```

No hay línea con error. El bug no existe en esta versión.

---

## 4. ¿Por qué no ocurre?

Porque cada tarea se crea con `crypto.randomUUID()` en `addTask()`:

```javascript
const tarea = {
    id: crypto.randomUUID(), // ← id irrepetible por definición
    text: text,
    prioridad: prioridadSeleccionada
};
```

Y cuando el usuario pulsa eliminar, `renderTask` pasa ese `id` concreto:

```javascript
deleteBtn.addEventListener("click", function () {
    tareaElemento.remove();
    removeTaskFromArray(tarea.id); // ← id específico de esa tarea
});
```

Aunque existan 10 tareas con el texto `"Comprar leche"`, cada una tiene
un `id` distinto. El filtro siempre elimina exactamente una.

---

## 5. ¿Cómo se corregiría si usara texto?

```javascript
// ❌ Versión con bug — filtra por text
function removeTaskFromArray(text) {
    tareas = tareas.filter(task => task.text !== text);
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

// ✅ Tu versión actual — correcta
const removeTaskFromArray = (id) => {
    tareas = tareas.filter(task => task.id !== id);
    saveTasksToStorage();
};
```

---

## Conclusión

| Versión | Filtra por | ¿Tiene el bug? |
|---|---|---|
| Versión con bug | `text` | ❌ Sí — elimina todos los duplicados |
| **Tu código real** | `id` | ✅ No — elimina exactamente una tarea |



```
Por què funciona?

Forzar los pasos evita que la IA salte a una solución sin explicar el razonamiento. Muy útil para bugs sutiles.
```




#Prompt 6:

Mi app de tareas tiene toda la lógica en un solo archivo JS de 120 líneas.
Razona paso a paso si debería separarlo en módulos:

1. ¿Qué responsabilidades tiene actualmente el archivo?
2. ¿Qué problemas causa tenerlo todo junto?
3. ¿Cómo lo separarías en módulos?
4. ¿Qué gano y qué pierdo con esa separación?
5. Dame tu recomendación final con la estructura de carpetas.


## 1. ¿Qué responsabilidades tiene actualmente el archivo?

El archivo hace exactamente **cinco cosas distintas:**

```
app.js
├── Estado global        → let tareas[], prioridadSeleccionada
├── Persistencia         → saveTasksToStorage, loadTasksFromStorage,
│                          getTasksFromLocalStorage, normalizeTask
├── Renderizado DOM      → renderTask, filterTask
├── Lógica de negocio    → addTask, removeTaskFromArray, validarLongitudTarea
└── Eventos UI           → addEventListener x6 (botones, input, búsqueda)
```

Cinco responsabilidades en un solo archivo es la definición exacta del problema que los módulos resuelven.

---

## 2. ¿Qué problemas causa tenerlo todo junto?

**Dependencias implícitas.** `renderTask` depende de `template`, `taskList` y `removeTaskFromArray`, pero eso no está declarado en ningún sitio — hay que leer todo el archivo para saberlo.

**Tests imposibles sin mocks pesados.** Para testear `validarLongitudTarea` necesitas que exista el DOM entero porque todo está en el mismo scope. Lo viste en los tests generados — tuvimos que mockear `localStorage` globalmente.

**`getTasksFromLocalStorage` huérfana.** Esa función no se llama desde ningún sitio. En un archivo grande esto pasa desapercibido. En módulos, el linter te avisa de inmediato porque nadie la importa.

**Escala mal.** Si añades edición de tareas, etiquetas o fechas límite, el archivo crece sin control. No hay frontera natural donde cortar.

---

## 3. ¿Cómo separarlo en módulos?

Cuatro módulos, cada uno con una responsabilidad única:

```javascript
// storage.js — solo sabe hablar con localStorage
export function saveTasksToStorage(tareas) { ... }
export function loadTasksFromStorage() { ... }
export function normalizeTask(task) { ... }
```

```javascript
// tasks.js — lógica de negocio pura, sin tocar el DOM
import { saveTasksToStorage } from "./storage.js";

export let tareas = [];

export function addTaskToArray(text, prioridad) { ... }
export function removeTaskFromArray(id) { ... }
export function validarLongitudTarea(texto) { ... }
```

```javascript
// ui.js — solo renderiza y filtra, sin lógica de negocio
import { removeTaskFromArray } from "./tasks.js";

export function renderTask(tarea) { ... }
export function filterTask(tareas, searchText) { ... }
```

```javascript
// main.js — punto de entrada, solo conecta eventos
import { addTaskToArray, loadTasksFromStorage } from "./tasks.js";
import { renderTask, filterTask } from "./ui.js";

button.addEventListener("click", ...);
searchInput.addEventListener("input", ...);
```

---

## 4. ¿Qué ganas y qué pierdes?

| | Detalle |
|---|---|
| ✅ **Tests unitarios limpios** | `validarLongitudTarea` se testea importando solo `tasks.js`, sin DOM ni mocks |
| ✅ **Errores localizados** | Un bug en persistencia está en `storage.js`, no hay que buscar en 150 líneas |
| ✅ **Función huérfana visible** | El linter detecta que nadie importa `getTasksFromLocalStorage` |
| ✅ **Escala sin caos** | Añadir fechas límite = tocar `tasks.js` y `ui.js`, no reescribir todo |
| ❌ **Configuración inicial** | Necesitas `type="module"` en el HTML o un bundler como Vite |
| ❌ **Curva de entrada** | Para un proyecto de aprendizaje añade fricción al principio |
| ❌ **CORS en local** | Los módulos ES no funcionan abriendo el HTML directamente — necesitas un servidor local (`npx serve` o Live Server) |

---

## 5. Recomendación final

**Sí, sepáralo.** Tu app ya tiene la complejidad suficiente para justificarlo: 5 responsabilidades, dependencias implícitas y tests que requieren mocks globales son señales claras.

### Estructura de carpetas recomendada

```
task-app/
├── index.html
├── style.css
└── src/
    ├── main.js        ← punto de entrada, solo eventos
    ├── tasks.js       ← lógica de negocio pura
    ├── storage.js     ← localStorage
    └── ui.js          ← DOM y renderizado
```

### Único cambio necesario en el HTML

```html
<script type="module" src="src/main.js"></script>
```

---

> **Criterio para decidir cuándo modularizar:**
> cuando para entender una función tienes que leer el archivo entero,
> es hora de separar. Tu app ya cruzó ese umbral.


```
Por què funciona?
Porque el razonamiento estructurado evita respuestas genéricas. Obliga a llegar a una recomendación concreta y justificada.
```

#Prompt 7

Refactoriza esta función siguiendo estas restricciones estrictas:
- Máximo 8 líneas
- Sin comentarios inline, el código debe ser autoexplicativo
- Usa arrow functions
- Usa desestructuración donde sea posible
- No cambies el comportamiento externo

function filterTask() {
    const searchText = searchInput.value.toLowerCase();
    const todasLasTareas = taskList.querySelectorAll(".deberes");
    todasLasTareas.forEach(function(tarea) {
        const textoTarea = tarea.querySelector("h2").textContent.toLowerCase();
        if (textoTarea.includes(searchText)) {
            tarea.style.display = "flex";
        } else {
            tarea.style.display = "none";
        }
    });
}


Respuesta:
# ♻️ Refactorización — `filterTask`

> **Restricciones aplicadas:** máximo 8 líneas, sin comentarios, arrow functions,
> desestructuración donde sea posible, comportamiento externo idéntico.

---

## Código original

```javascript
function filterTask() {
    const searchText = searchInput.value.toLowerCase();
    const todasLasTareas = taskList.querySelectorAll(".deberes");

    todasLasTareas.forEach(function(tarea) {
        const textoTarea = tarea.querySelector("h2").textContent.toLowerCase();

        if (textoTarea.includes(searchText)) {
            tarea.style.display = "flex";
        } else {
            tarea.style.display = "none";
        }
    });
}
```

---

## Código refactorizado

```javascript
const filterTask = () => {
    const searchText = searchInput.value.toLowerCase();

    taskList.querySelectorAll(".deberes").forEach((tarea) => {
        const textoTarea = tarea.querySelector("h2").textContent.toLowerCase();
        tarea.style.display = textoTarea.includes(searchText) ? "flex" : "none";
    });
};
```

---

## Cambios aplicados

| Original | Refactorizado | Por qué |
|---|---|---|
| `function filterTask()` | `const filterTask = () =>` | Arrow function, consistente con el resto del código |
| `const todasLasTareas = taskList.querySelectorAll(...)` | Inline en el `.forEach` | Variable intermedia innecesaria |
| `if/else` de 4 líneas | Operador ternario | Reduce líneas sin perder claridad |
| `function(tarea)` anónima | `(tarea) =>` | Arrow function |

---

## Verificación de restricciones

| Restricción | Cumplida | Detalle |
|---|---|---|
| Máximo 8 líneas | ✅ | 6 líneas |
| Sin comentarios inline | ✅ | Cero comentarios |
| Arrow functions | ✅ | `const filterTask = () =>` y `(tarea) =>` |
| Desestructuración | ⚠️ | `tarea` es un nodo DOM — forzarla empeoraría la legibilidad |
| Comportamiento externo igual | ✅ | Idéntico al original |

> **Nota sobre desestructuración:** en esta función no hay objetos o arrays
> de los que desestructurar de forma natural. Forzar `const { style } = tarea`
> entraría en conflicto con la restricción de código autoexplicativo.

```
## Por què funciona?
Porque las restricciones eliminan el margen de interpretación. Sin ellas, "refactorizar" puede significar cosas muy diferentes.
´´´


#Prompt 8
Añade a esta app de tareas la funcionalidad de marcar tareas como 
completadas. Restricciones:
- Solo Vanilla JS, sin librerías
- Usa el array `tareas` existente añadiendo la propiedad `completada: boolean`
- Persiste el estado en localStorage igual que las demás propiedades
- Al marcar como completada, añade la clase CSS "completada" al elemento
- No rompas el código existente de añadir y eliminar tareas

Respuesta:
# ✅ Nueva funcionalidad — Marcar tareas como completadas

> **Stack:** Vanilla JS
> **Restricciones:** sin librerías, usa `tareas[]` existente, persiste en localStorage,
> clase CSS `"completada"`, no rompe `addTask` ni `removeTaskFromArray`

---

## 1. Actualizar `normalizeTask`

Añade `completada` a la normalización para que las tareas antiguas del
localStorage sean compatibles con la nueva propiedad:

```javascript
function normalizeTask(task) {
    const id = typeof task?.id === "string" && task.id.trim()
        ? task.id
        : crypto.randomUUID();
    return {
        id,
        text: String(task?.text ?? ""),
        prioridad: String(task?.prioridad ?? "media"),
        completada: Boolean(task?.completada ?? false), // ← nuevo
    };
}
```

---

## 2. Actualizar `addTask`

Añade `completada: false` al crear una tarea nueva:

```javascript
function addTask() {
    const text = input.value.trim();
    const mensajeError = document.getElementById("mensaje-error-longitud");

    if (!validarLongitudTarea(text)) {
        if (mensajeError) mensajeError.style.display = "block";
        return;
    } else {
        if (mensajeError) mensajeError.style.display = "none";
    }

    /** @type {Tarea} */
    const tarea = {
        id: crypto.randomUUID(),
        text,
        prioridad: prioridadSeleccionada,
        completada: false, // ← nuevo
    };

    tareas.push(tarea);
    saveTasksToStorage();
    renderTask(tarea);
    input.value = "";
}
```

---

## 3. Nueva función `toggleCompletada`

Función pura de lógica de negocio — invierte el estado `completada` de
la tarea y persiste:

```javascript
/**
 * Alterna el estado `completada` de una tarea y persiste en localStorage.
 *
 * @param {string} id - Id de la tarea a alternar.
 * @returns {void}
 */
const toggleCompletada = (id) => {
    tareas = tareas.map(task =>
        task.id === id ? { ...task, completada: !task.completada } : task
    );
    saveTasksToStorage();
};
```

---

## 4. Actualizar `renderTask`

Aplica la clase CSS si la tarea ya viene marcada (por ejemplo, al cargar
desde localStorage), y registra el evento click para alternar:

```javascript
function renderTask(tarea) {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".tarea-texto").textContent = tarea.text;
    clone.querySelector(".prioridad").textContent = tarea.prioridad;
    clone.querySelector(".prioridad").classList.add(tarea.prioridad);

    const tareaElemento = clone.querySelector(".deberes");
    tareaElemento.dataset.id = tarea.id;

    // ← nuevo: restaura estado visual al cargar desde localStorage
    if (tarea.completada) tareaElemento.classList.add("completada");

    // ← nuevo: botón o área para marcar como completada
    const completeBtn = clone.querySelector(".completeBtn");
    completeBtn.addEventListener("click", () => {
        tareaElemento.classList.toggle("completada");
        toggleCompletada(tarea.id);
    });

    const deleteBtn = clone.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", () => {
        tareaElemento.remove();
        removeTaskFromArray(tarea.id);
    });

    taskList.appendChild(clone);
}
```

---

## 5. Actualizar el template HTML

Añade el botón `.completeBtn` dentro del template existente:

```html
<template id="tarea-template">
    <li class="deberes">
        <h2 class="tarea-texto"></h2>
        <span class="prioridad"></span>
        <button class="completeBtn">✓</button>  <!-- ← nuevo -->
        <button class="deleteBtn">✗</button>
    </li>
</template>
```

---

## 6. CSS necesario

```css
.deberes.completada {
    opacity: 0.6;
    text-decoration: line-through;
}

.completeBtn {
    /* estilos a tu gusto */
    cursor: pointer;
}
```

---

## Resumen de cambios

| Archivo | Cambio | Por qué |
|---|---|---|
| `normalizeTask` | Añade `completada: false` como fallback | Compatibilidad con tareas antiguas en localStorage |
| `addTask` | Añade `completada: false` al crear | Toda tarea nueva nace sin completar |
| `toggleCompletada` | Función nueva | Lógica de negocio separada del DOM |
| `renderTask` | Clase CSS + evento click | Sincroniza estado visual con estado en memoria |
| Template HTML | Botón `.completeBtn` | Punto de entrada del usuario |
| CSS | Clase `.completada` | Feedback visual |

---

## Flujo completo

```
Usuario pulsa .completeBtn
        ↓
tareaElemento.classList.toggle("completada")   ← actualiza DOM
        ↓
toggleCompletada(tarea.id)                     ← actualiza tareas[]
        ↓
saveTasksToStorage()                           ← persiste en localStorage
        ↓
Al recargar → loadTasksFromStorage()
           → normalizeTask lee completada:true
           → renderTask aplica clase CSS
```

```
Por què funciona?
Porque las restricciones evitan que la IA reescriba todo desde cero o introduzca dependencias que no quieres.

```

# Prompt 9:

Genera el README.md para esta app de tareas. Restricciones:
- Máximo 200 palabras
- Secciones: Descripción, Funcionalidades, Cómo usarlo, Tecnologías
- Tono técnico pero accesible para developers junior
- Incluye un bloque de código mostrando la estructura del objeto tarea
- En español

El proyecto es una app de gestión de tareas con prioridades, 
búsqueda en tiempo real y persistencia en localStorage.


Respuesta:

# 📝 App de Tareas

App de gestión de tareas construida con Vanilla JS. Permite añadir, eliminar
y buscar tareas con niveles de prioridad, manteniendo los datos persistidos
en localStorage sin necesidad de backend.

---

## Funcionalidades

- Añadir tareas con prioridad: `baja`, `media` o `alta`
- Eliminar tareas individualmente por `id` único
- Búsqueda en tiempo real sobre el texto de la tarea
- Persistencia automática en localStorage
- Validación mínima de longitud al crear una tarea

---

## Cómo usarlo

1. Clona el repositorio
2. Abre `index.html` en el navegador (no requiere servidor)
3. Escribe una tarea, selecciona prioridad y pulsa **Añadir**

---

## Estructura del objeto tarea

```javascript
/** @type {Tarea} */
const tarea = {
    id: "uuid-generado-con-crypto",  // identificador único
    text: "Comprar leche",           // texto descriptivo
    prioridad: "alta",               // "baja" | "media" | "alta"
};
```

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 `<template>` | Renderizado de tareas en el DOM |
| Vanilla JS (ES6+) | Lógica completa sin librerías |
| localStorage | Persistencia entre sesiones |
| CSS3 | Estilos y clases de prioridad |

```
Por qué funciona?
Porque sin restricciones de longitud y estructura, los README generados suelen ser excesivamente largos y genéricos.

```

#Prompt 10
Explica esta función para incluirla en la documentación técnica del proyecto.
Restricciones:

Público: desarrolladores junior que se incorporan al equipo
Máximo 80 palabras
Estructura: qué hace → cómo funciona → cuándo usarla
Sin jerga avanzada
Incluye un ejemplo de llamada en una línea

```
function renderTask(tarea) {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".tarea-texto").textContent = tarea.text;
    clone.querySelector(".prioridad").textContent = tarea.prioridad;
    clone.querySelector(".prioridad").classList.add(tarea.prioridad);

    const tareaElemento = clone.querySelector(".deberes");
    tareaElemento.dataset.id = tarea.id;

    const deleteBtn = clone.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", function () {
        tareaElemento.remove();
        removeTaskFromArray(tarea.id);
    });

    taskList.appendChild(clone);
}
```


Respuesta:
---

## Qué hace

Toma una tarea del array `tareas` y la convierte en un elemento visible
en la pantalla, con su texto, nivel de prioridad y botón de borrado.

## Cómo funciona

Copia el template HTML que existe en el `index.html`, rellena sus campos
con los datos de la tarea, registra el botón de borrado y lo añade a la lista.
Nunca modifica el array directamente — solo pinta lo que ya existe en memoria.

## Cuándo usarla

Llámala cada vez que necesites mostrar una tarea: al crearla con `addTask`
o al cargar las tareas guardadas con `loadTasksFromStorage`.

```javascript
renderTask({ id: "abc123", text: "Comprar leche", prioridad: "alta" });
```

> ⚠️ Nunca llames a `renderTask` dos veces con la misma tarea
> — se pintaría duplicada en pantalla sin error visible.

```
Por què funciona?
Porque definir el público objetivo cambia completamente el nivel de la explicación. Sin esa restricción la IA asume un nivel intermedio genérico.

```
