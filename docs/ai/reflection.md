# Reflexión del proyecto

## ¿Qué fue lo más difícil?

Para mì, más allá de lo que podrìa ser un poco la lógica de progamación, fue la migración a Tailwind, fue lo que más me costó. Al principio no entendía
por qué las clases `dark:` no funcionaban cuando JavaScript añadía clases
dinámicamente. Aprendí que Tailwind y JS tienen que coordinarse bien y que
no puedes mezclar los dos sistemas sin pensar en cómo interactúan.

## ¿Qué aprendiste que no sabías antes?

- Cómo funciona el event loop y por qué `setTimeout` con `var` da problemas
- La diferencia real entre `let`, `const` y `var` con hoisting
- Cómo usar `crypto.randomUUID()` para identificadores únicos
- Que `normalizeTask` es un patrón muy útil para datos que vienen de fuentes
  externas como localStorage
- Cómo funciona el Model Context Protocol y para qué sirve

## ¿Qué harías diferente si empezaras de nuevo?

Empezaría con Tailwind desde el principio en vez de migrar al final.

También definiría la estructura del objeto tarea desde el principio con
todos los campos (`id`, `text`, `prioridad`, `completed`, `createdAt`)
en vez de añadirlos poco a poco.

## ¿Qué parte te gustó más?

El modo oscuro. Ver cómo con solo añadir la clase `dark` al `html`.

## ¿Cómo usaría la IA de forma diferente en el próximo proyecto?

Aprendí que la IA es muy útil para depurar bugs y explicar conceptos,
pero que entender el código antes de copiarlo es fundamental. Hubo momentos
en los que copié código sin entenderlo del todo y eso me causó problemas
después cuando tenía que modificarlo.

En el próximo proyecto usaré la IA más para aprender y menos para copiar,
y le haré preguntas más específicas con ejemplos de mi propio código
en vez de preguntas genéricas.