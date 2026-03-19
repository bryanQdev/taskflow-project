# Experimentos — IA vs Sin IA

> Comparativa personal de resolución de problemas JavaScript con y sin asistencia de IA.

---

# Experimentos con IA en programación

## Metodología

---

## Bloque 1: Problemas genéricos

---

### Experimento 1 — Sumar números de un array



#### Sin IA

**Tiempo:** 10 minutos

**Mi solución:**
```javascript
function sumarArray(numeros) {
  let total = 0;

  for (let i = 0; i < numeros.length; i++) {
    total += numeros[i];
  }

  return total;
}
```

**Dificultades encontradas:**
- Dudé con el bucle `for`
- No recordaba bien cómo acumular valores

---

#### Con IA

**Prompt usado:**
```
sumar numeros de un array en javascript
```

**Tiempo:** 1 minuto

**Código generado:**
```javascript
const sumarArray = arr => arr.reduce((acc, num) => acc + num, 0);
```

---

#### Comparativa

| Dimensión      | Sin IA | Con IA |
|----------------|--------|--------|
| Tiempo         | 10 min | 1 min  |
| Calidad        | Media  | Alta   |
| Comprensión    | Alta   | Media  |

**Conclusión:**
Sin IA entendí mejor el proceso. La IA fue más rápida pero usó `reduce`, que no domino.

---

### Experimento 2 — Filtrar números pares



#### Sin IA

**Tiempo:** 12 minutos

**Mi solución:**
```javascript
function pares(arr) {
  let resultado = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
      resultado.push(arr[i]);
    }
  }

  return resultado;
}
```

**Dificultades encontradas:**
- Recordar el operador `%`
- Manejar arrays

---

#### Con IA

**Prompt usado:**
```
filtrar numeros pares javascript
```

**Tiempo:** 1 minuto

**Código generado:**
```javascript
const pares = arr => arr.filter(num => num % 2 === 0);
```

---

#### Comparativa

| Dimensión      | Sin IA | Con IA |
|----------------|--------|--------|
| Tiempo         | 12 min | 1 min  |
| Calidad        | Media  | Alta   |
| Comprensión    | Alta   | Media  |

**Conclusión:**
El código de la IA es más corto, pero el mío es más fácil de entender para mí.

---

### Experimento 3 — Invertir string



#### Sin IA

**Tiempo:** 15 minutos

**Mi solución:**
```javascript
function invertir(texto) {
  let resultado = "";

  for (let i = texto.length - 1; i >= 0; i--) {
    resultado += texto[i];
  }

  return resultado;
}
```

**Dificultades encontradas:**
- Manejar índices al revés
- Errores de lógica al principio

---

#### Con IA

**Prompt usado:**
```
invertir string javascript
```

**Tiempo:** 1 minuto

**Código generado:**
```javascript
const invertir = str => str.split("").reverse().join("");
```

---

#### Comparativa

| Dimensión      | Sin IA | Con IA |
|----------------|--------|--------|
| Tiempo         | 15 min | 1 min  |
| Calidad        | Media  | Alta   |
| Comprensión    | Alta   | Media  |

**Conclusión:**
La IA es más eficiente, pero sin IA entendí mejor cómo funcionan los bucles.



### Experimento 4 — Fix bug eliminación de tareas



#### Sin IA

**Tiempo:** 25 minutos

**Mi solución:**
```javascript
const removeTaskFromArray = (id) => {
  tareas = tareas.filter(task => task.id !== id);
  saveTasksToStorage();
};
```

**Dificultades encontradas:**
- Antes usaba texto y eliminaba tareas incorrectas
- No entendía por qué pasaba el bug

---

#### Con IA

**Prompt usado:**
```
porque eliminar elementos por texto da errores usar id javascript
```

**Tiempo:** 3 minutos

**Código generado:**
```javascript
const removeTaskFromArray = (id) => {
  tareas = tareas.filter(task => task.id !== id);
  saveTasksToStorage();
};
```

---

#### Comparativa

| Dimensión   | Sin IA | Con IA |
|-------------|--------|--------|
| Tiempo      | 25 min | 3 min  |
| Calidad     | Media  | Alta   |
| Comprensión | Media  | Alta   |

**Conclusión:**
La IA me ayudó a entender el problema. La solución es usar `id` en vez de texto.

---

### Experimento 5 — Validación de longitud



#### Sin IA

**Tiempo:** 15 minutos

**Mi solución:**
```javascript
function validarLongitudTarea(texto) {
  return texto.trim().length >= 3;
}
```

**Dificultades encontradas:**
- No conocía bien `trim()`
- Dudé con la condición

---

#### Con IA

**Prompt usado:**
```
validar longitud string javascript minimo caracteres
```

**Tiempo:** 2 minutos

**Código generado:**
```javascript
const validarLongitudTarea = texto => texto.trim().length >= 3;
```

---

#### Comparativa

| Dimensión   | Sin IA | Con IA |
|-------------|--------|--------|
| Tiempo      | 15 min | 2 min  |
| Calidad     | Media  | Alta   |
| Comprensión | Alta   | Alta   |

**Conclusión:**
Aquí la IA no aportó mucho. Ya entendía el problema.

---

### Experimento 6 — Filtrar tareas (búsqueda)



#### Sin IA

**Tiempo:** 30 minutos

**Mi solución:**
```javascript
function filterTask() {
  const searchText = searchInput.value.trim().toLowerCase();
  const tareasDOM = taskList.querySelectorAll(".deberes");

  tareasDOM.forEach((tarea) => {
    const tituloTarea = tarea.querySelector("h2");
    const textoTarea = tituloTarea.textContent.toLowerCase();

    if (textoTarea.includes(searchText)) {
      tarea.style.display = "flex";
    } else {
      tarea.style.display = "none";
    }
  });
}
```

**Dificultades encontradas:**
- Manipular el DOM
- Entender `includes`

---

#### Con IA

**Prompt usado:**
```
filtrar lista en tiempo real javascript DOM
```

**Tiempo:** 4 minutos

**Código generado:**
```javascript
function filterTask() {
  const searchText = searchInput.value.toLowerCase();

  document.querySelectorAll(".deberes").forEach(tarea => {
    const texto = tarea.textContent.toLowerCase();
    tarea.style.display = texto.includes(searchText) ? "flex" : "none";
  });
}
```

---

#### Comparativa

| Dimensión   | Sin IA | Con IA |
|-------------|--------|--------|
| Tiempo      | 30 min | 4 min  |
| Calidad     | Media  | Alta   |
| Comprensión | Media  | Media  |

**Conclusión:**
La IA simplifica mucho el código, pero sin IA aprendí más sobre el DOM.
