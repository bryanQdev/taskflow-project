# Comparativa entre Asistentes IA

## ¿Qué se documenta aquí?

Este documento recoge la comparativa entre **ChatGPT**(OpenAI) y **Claude**(Anthropic) aplicada al desarrollo de software. Se analizan tres dimensiones principales:

1. **Explicación de conceptos técnicos** - claridad, profundidad y calidad de los ejemplos.
2. **Detección de bugs** - capacidad para identificar y explicar errores en código JavaScript.
3. **Generación de código** - calidad, legibilidad y correción del código producido.




## 1. Explicación de conceptos técnicos

### Concepto 1: Closures

**Prompt utilizado:**
```
Explícame qué es un clousure en JavaScript con un ejemplo práctico y sencillo.

 ```

 **Respuesta ChatGPT:**
 Un closure es cuando una función puede seguir usando variables de la función donde fue creada, incluso desùés de que esa función haya terminado.
 Incluye dos ejemplos(saludo y contador) y un diagrama visual además de sugerir explicación de otros conceptos que muchos desarrolladores junior no entienden al principio.

 **Respuesta Claude:**
 Un closure es una función que recuerda las variables del entorno donde fue creada. Explica el concepto con un ejemplo de contador y describe sus usos principales: encapsular datos, crear funciones con estado y construir módulos.

 **Comparativa**

|  Criterio   |            ChatGPT               |        Claude            |
|-------------|----------------------------------|--------------------------|
| Claridad    | Muy clara, lenguaje sencillo.    | Clara y dirécta.         |
| Profundidad | Mayor- ejemplos + diagrama       | Más concisa              |
| Ejemplos    | Dos ejemplos prácticos           | Un ejemplo bien explicado|
| Extras      | Ofrece explicar otros argumentos | No                       |


**Conclusión**
Chatgpt fue más completo y didáctico en este concepto. Claude fue más directo pero menos profundo.


---



### Concepto 2: Event Loop

**Prompt utilizado:**
```
Explícame qué es un Event Loop en JavaScript con un ejemplo práctico y sencillo.

 ```

 **Respuesta ChatGPT:**
 El Event Loop en JavaScript es el mecanismo que permite que JavaScript maneje tareas asíncronas (como timers, peticiones HTTP o eventos) aunque el lenguaje sea de un solo hilo.
Explica el event loop con lenguaje muy simple. Usa una
analogía de "hacer varias cosas a la vez" y un ejemplo
con setTimeout mostrando el orden de ejecución. Menciona el caso cuando hay
los clicks y temporizadores pero sin profundizar en la
arquitectura interna.

 **Respuesta Claude:**
 El event loop es el mecanismo que permite a JavaScript hacer varias cosas "a la vez" aunque sea un lenguaje de un solo hilo.
Explica además las tres piezas clave (Call Stack, Web APIs y
Callback Queue) con un diagrama visual en texto. Incluye
dos ejemplos: setTimeout y fetch real contra una API.
Define la "regla de oro" del event loop al final.

 **Comparativa**

|  Criterio   |            ChatGPT               |                Claude              |
|-------------|----------------------------------|------------------------------------|
| Claridad    | Muy accesible                    | Claro, didáctico y estructurado    |
| Profundidad | Superficial                      | Explica la arquitectura completa   |
| Ejemplos    | Un ejemplo sencillo              | Dos ejemplos + un diagrama         |
| Extras      | Ofrece explicar otros argumentos |  Explica el fetch                  |


**Conclusión**
Claude fue esta vez más completo y didáctico en este concepto, se hizo entender muy bien.
ChatGPT fue mucho más superficial y eso evitó una comprensión clara de los argumentos.





### Concepto 3 : Hoisting

**Prompt utilizado:**
```
Explícame qué es el "Hoisting" en JavaScript con un ejemplo práctico y sencillo.

 ```

 **Respuesta ChatGPT:**
El Hoisting en JavaScript es un comportamiento del lenguaje donde las declaraciones de variables y funciones se “elevan” al inicio de su ámbito antes de ejecutar el código. Muestra como Javascript eleva las declaraciones con var, funciones y mecanismos. Menciona la Temporal Dead Zone de let y const. Incluye también una regla 
práctica para recordar al final: "Hoisting = JavaScript mueve las declaraciones al inicio del scope antes de ejecutar el código".


 **Respuesta Claude:**
El hoisting es el comportamiento de JavaScript de "elevar" las declaraciones de variables y funciones al inicio de su ámbito antes de ejecutar el código.
Explica además el comportamiento interno de Javascript, Incluye los casos con funciones y con variables (var, let y const) cada uno con su respectivo ejemplo.
Termina con un consejo práctico: usar let y const siempre.


 **Comparativa**

|  Criterio   |            ChatGPT        |                Claude                  |
|-------------|---------------------------|----------------------------------------|
| Claridad    | Muy accesible             | Claro, didáctico y estructurado        |
| Profundidad | Buena                     | Mayor - tabla comparativa              |
| Ejemplos    | Varios ejemplos           | Varios ejemplos                        |
| Extras      | Regla fácil para recordar | Consejo sobre buenas prácticas         |


**Conclusión**
Muy similares en este concepto, sin embargo cabe destacar que chatGPT es más fácil de leer al pincipio pero luego se queda corto en profundidad
a comparación de Claude aunque Claude no deja de ser igualmente más directo y conciso al inicio pero con los ejemplos prácticos y su recomendación
lo hizo más útil como referencia.
 



## 2. Detección de bugs

### Bug 1-Índice fuera de límites en bucle for

function sumarArray(numeros) {
  let total = 0;
  for (let i = 0; i <= numeros.length; i++) {
    total += numeros[i];
  }
  return total;
}

console.log(sumarArray([1, 2, 3, 4])); // debería dar 10


**Prompt utilizado**

```
Esta función me da problemas, detécta los errores  y explica por qué falla y cómo lo corrijo.

 ```

 **Comparativa**

|       Criterio      |             ChatGPT            |              Claude                   |
|---------------------|--------------------------------|---------------------------------------|
| ¿Detectó el bug?    |                Sí              |              Sí                       |
| Explicación         |  Tabla con índices paso a paso |  Descriptivo y preciso                |
| Profundidad         | Buena                          | Mayor — detecta 2 errores encadenados |
| Alternativa moderna |           for...of             |             reduce                    |



**Conclusión**

Ambos encontraron el bug, Claude fue más profundo al explicar el efecto en cadena del NaN.
ChatGPT fue más visual con la tabla de iteraciones.



### Bug 2- Error de sintaxis

function esMayorDeEdad(edad) {
  if (edad = 18) {
    return true;
  }
  return false;
}

console.log(esMayorDeEdad(15)); // debería dar false


**Prompt utilizado**

```
Esta función me da problemas, detécta los errores  y explica por qué falla y cómo lo corrijo.

 ```

 **Comparativa**

|       Criterio      |             ChatGPT            |              Claude                   |
|---------------------|--------------------------------|---------------------------------------|
| ¿Detectó el bug?    |                Sí              |              Sí                       |
| Explicación         |  paso a paso                   |  Descriptivo y preciso                |
| Profundidad         | Buena                          | Mayor, explica además  "=, ==, ==="   |
| Alternativa simple  |         sin usar  if           |             sin usar if               |



**Conclusión**

Ambos encontraron el bug, Claude fue más directo se supo dejar entender con menos texto de por medio.
ChatGPT fue más paso a paso pero sin tantas explicaciones, dejaba dudas.





### Bug 3 — var + closures + event loop en setTimeout

**Código con error:**
```
function saludarTodos(nombres) {
  for (var i = 0; i < nombres.length; i++) {
    setTimeout(function() {
      console.log("Hola " + nombres[i]);
    }, 1000);
  }
}
```

**Comparativa:**

|          Criterio              |              ChatGPT                 |                     Claude                          |
|--------------------------------|--------------------------------------|-----------------------------------------------------|
| ¿Detectó el bug?               |                 Sí                   |                     Sí                              |
| Explicación del porqué         |  Buena con tabla de iteraciones      |  Mejor — diagrama de ticks del event loop           |
| Soluciones ofrecidas           |     3 (let, variable, IIFE)          | 3 (let, for...of, forEach)                          |
| Conexión con conceptos previos | Menciona event loop superficialmente |  Conecta con hoisting y event loop explicados antes |

**Conclusión:**
Este fue el bug más complejo y ambos lo resolvieron bien.
Claude conectó mejor los conceptos (var + hoisting + event loop)
dando una explicación más coherente. ChatGPT añadió la
solución con IIFE que Claude no mencionó.

---




### Función 1.Generación de código

**Descripción 1**
Crea una función JavaScript que reciba un array de tareas,
donde cada tarea es un objeto con las propiedades "titulo"
y "completada". La función debe devolver solo las tareas
que no están completadas.


**Código ChatGPT:** 
```
javascript

function obtenerTareasPendientes(tareas) {
  return tareas.filter(function(tarea) {
    return tarea.completada === false;
  });
}

```

**Código Claude**
```
javascript

function obtenerTareasPendientes(tareas) {
  return tareas.filter(tarea => !tarea.completada);
}

```

**Comparativa:**

| Criterio            |              ChatGPT                |              Claude                |
|---------------------|-------------------------------------|------------------------------------|
| Código correcto     |  Sí                                 |  Sí                                |
| Legibilidad         |  Muy limpio                         |  breve y claro                     |
| Versiones ofrecidas |  3 versiones (function, arrow, for) |  Solo la solución principal        |
| Validaciones        |  No                                 |  Muestra versión con casos límite  |
| Ejemplo de uso      |  Básico                             |  Más completo con template literal |


**Conclusión:**
Ambos llegaron al mismo código final. ChatGPT fue más
didáctico mostrando tres formas distintas de resolverlo,
útil para aprender.




**Descripción 2**
Crea una función JavaScript que reciba un texto y devuelva
ese mismo texto con la primera letra de cada palabra en
mayúscula. Por ejemplo "hola mundo" debe devolver "Hola Mundo".

**Código ChatGPT:** 
```
javascript

function capitalizarTexto(texto) {
  const palabras = texto.split(" ");
  const resultado = [];

  for (let i = 0; i < palabras.length; i++) {
    const palabra = palabras[i];
    const nuevaPalabra =
      palabra.charAt(0).toUpperCase() + palabra.slice(1);

    resultado.push(nuevaPalabra);
  }

  return resultado.join(" ");
}

console.log(capitalizarTexto("hola mundo"));

```

**Código Claude**
```
javascript

function capitalizarPalabras(texto) {
  return texto
    .split(" ")
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(" ");
}

```

**Comparativa:**

| Criterio            |              ChatGPT                |              Claude                |
|---------------------|-------------------------------------|------------------------------------|
| Código correcto     |  Sí                                 |  Sí                                |
| Legibilidad         |  Muy limpio y detallado             |  directo al inicio, luego detallado|
| Validaciones        |  No                                 |  Maneja null y vacío               |
| Explicación         |  Paso a paso  y pautado             |   Conciso y menos pautado          |


**Conclusión:**
ChatGPT entrega una solución más pautada y extensa mientas Claude 
es más directo y conciso pero normaliza las
mayúsculas con .toLowerCase() y añade validaciones.
---



**Descripción 3**
Crea una función JavaScript que reciba un array de números y devuelva un objeto 
con tres propiedades: el número mayor, el número menor y la media de todos ellos.

**Código ChatGPT:**
```javascript
function analizarNumeros(numeros) {
  let mayor = numeros[0];
  let menor = numeros[0];
  let suma = 0;

  for (let i = 0; i < numeros.length; i++) {
    const num = numeros[i];

    if (num > mayor) {
      mayor = num;
    }

    if (num < menor) {
      menor = num;
    }

    suma += num;
  }

  const media = suma / numeros.length;

  return {
    mayor: mayor,
    menor: menor,
    media: media
  };
}

console.log(analizarNumeros([3, 7, 2, 9, 5]));
```

**Código Claude:**
```javascript
function analizarNumeros(numeros) {
  const mayor = Math.max(...numeros);
  const menor = Math.min(...numeros);
  const media = numeros.reduce((acc, num) => acc + num, 0) / numeros.length;

  return { mayor, menor, media };
}
```

**Comparativa:**

|   Criterio             |           ChatGPT               |                Claude            |
|------------------------|---------------------------------|----------------------------------|
| Código correcto        |             Sí                  |                 Sí               |
| Legibilidad            |  Muy limpio, paso a paso        |           Muy limpio             |
| Extra útil             |  Versión con for para aprender  |  Cómo redondear la media         |
| Explicación            |  Paso a paso  y pautado         | Conciso, usa libreria math       |

**Conclusión:**
ChatGPT hizo un còdigo con ciclos for e if,  ayuda a entender el proceso, sin embargo
Claudo usó métodos como reduce, Math.max y Math.min, asì que la solución fue más directa.

---

## Conclusión General — Generación de Código


**Impresión general:**
Claude tiende a generar código más robusto con
validaciones y casos límite. ChatGPT es más didáctico
mostrando varias versiones del mismo problema, lo cual
es útil para aprender. Sin embargo prefiero usar ambos
para poder aprender el concepto que desconozco.