# 🛠️ Herramientas del desarrollo backend

## Postman

Postman es una aplicación que permite hacer peticiones HTTP a una API sin necesidad de tener un frontend construido. Es la herramienta estándar para probar y documentar APIs REST.

**¿Para qué se usa?**
- Probar endpoints manualmente (GET, POST, PUT, DELETE)
- Forzar errores intencionados para verificar el manejo de excepciones
- Documentar colecciones de peticiones para que otros desarrolladores puedan usarlas
- Compartir colecciones de pruebas con el equipo

**Ejemplo de uso en TaskFlow:**
Durante el desarrollo se usó Postman para verificar que la API respondía correctamente antes de conectar el frontend.

---

## Axios

Axios es una librería de JavaScript para hacer peticiones HTTP desde el navegador o desde Node.js. Es una alternativa a `fetch` con algunas ventajas.

**¿Para qué se usa?**
- Hacer peticiones HTTP de forma más sencilla que con `fetch`
- Interceptar peticiones y respuestas para añadir cabeceras automáticamente
- Manejar errores de forma más clara
- Cancelar peticiones en curso

**Diferencia con fetch:**
```javascript
// Con fetch
const respuesta = await fetch('/api/tasks');
const datos = await respuesta.json();

// Con axios
const { data } = await axios.get('/api/tasks');
```

Axios convierte el JSON automáticamente y lanza errores cuando el servidor devuelve un código 4xx o 5xx, mientras que fetch requiere comprobarlo manualmente con `respuesta.ok`.

---

## Swagger

Swagger es una herramienta que genera documentación interactiva de una API REST automáticamente a partir del código. Permite a cualquier desarrollador explorar y probar los endpoints desde el navegador sin necesidad de Postman.

**¿Para qué se usa?**
- Documentar APIs de forma estándar (OpenAPI Specification)
- Generar una interfaz visual donde probar los endpoints
- Facilitar la colaboración entre equipos de frontend y backend
- Mantener la documentación siempre actualizada con el código

**Ejemplo de endpoint documentado con Swagger:**
```yaml
/api/v1/tasks:
  get:
    summary: Obtener todas las tareas
    responses:
      200:
        description: Lista de tareas
  post:
    summary: Crear una nueva tarea
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              text:
                type: string
              prioridad:
                type: string
                enum: [alta, media, baja]
```

---

## Sentry

Sentry es una plataforma de monitorización de errores en tiempo real. Cuando una aplicación en producción falla, Sentry captura el error automáticamente y lo envía a un panel donde el equipo puede analizarlo.

**¿Para qué se usa?**
- Detectar errores en producción que los usuarios no reportan
- Ver el stack trace completo de cada error
- Recibir alertas cuando algo falla
- Monitorizar el rendimiento de la aplicación

**¿Por qué es importante?**
Sin Sentry, solo sabes que algo falló cuando un usuario se queja. Con Sentry, sabes exactamente qué falló, cuándo, en qué línea de código y cuántos usuarios se vieron afectados.

**Ejemplo de integración en Node.js:**
```javascript
const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'tu-dsn-aqui' });

app.use(Sentry.Handlers.errorHandler());
```