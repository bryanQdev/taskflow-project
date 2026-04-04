# 📝 TaskFlow

Aplicación web para gestionar tareas diarias con backend en Node.js y API REST.

## 🚀 Demo
ENLACE VERCEL: https://taskflow-project-henna.vercel.app/

## ✨ Funcionalidades

- ✅ Añadir tareas con validación de longitud mínima
- ✅ Eliminar tareas
- ✅ Marcar tareas como completadas
- ✅ Editar el título de una tarea existente
- ✅ Asignar prioridad (alta, media, baja)
- ✅ Filtro por estado (todas, pendientes, completadas)
- ✅ Ordenar por prioridad o fecha
- ✅ Búsqueda por texto en tiempo real
- ✅ Marcar todas las tareas como completadas
- ✅ Borrar todas las tareas completadas
- ✅ Panel de estadísticas en tiempo real
- ✅ Gestión de estados de red (cargando, error, vacío)
- ✅ Modo oscuro con preferencia guardada

## 🛠️ Tecnologías

**Frontend**
- HTML5
- CSS3
- Tailwind CSS (CDN)
- JavaScript (Vanilla)

**Backend**
- Node.js
- Express
- cors
- dotenv
- nodemon

## 📁 Estructura del proyecto
```
taskflow-project/
├── index.html
├── styles.css
├── app.js
├── src/
│   └── api/
│       └── client.js       ← comunicación con el backend
├── server/
│   ├── .env
│   ├── package.json
│   └── src/
│       ├── index.js         ← punto de entrada del servidor
│       ├── config/
│       │   └── env.js       ← variables de entorno
│       ├── routes/
│       │   └── task.routes.js    ← define las URLs
│       ├── controllers/
│       │   └── task.controller.js ← gestiona las peticiones
│       └── services/
│           └── task.service.js   ← lógica de negocio
└── docs/
    ├── ai/
    │   ├── prompt-engineering.md
    │   └── experiments.md
    └── design/
```

## 🌐 API REST

Base URL: `http://localhost:3000/api/v1`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/tasks` | Obtener todas las tareas |
| POST | `/tasks` | Crear una nueva tarea |
| DELETE | `/tasks/:id` | Eliminar una tarea por id |

### Ejemplo de request POST
```json
{
  "text": "Comprar leche",
  "prioridad": "alta"
}
```

### Ejemplo de response
```json
{
  "id": "uuid",
  "text": "Comprar leche",
  "prioridad": "alta",
  "completed": false,
  "createdAt": "2026-04-02T09:40:24.427Z"
}
```

## 🏗️ Arquitectura por capas

El backend sigue el patrón de separación de responsabilidades:

- **Routes** — escucha las URLs y las redirige al controller correcto
- **Controllers** — recibe la petición, valida los datos y llama al service
- **Services** — contiene la lógica pura, sin saber nada de HTTP

## 🚀 Cómo ejecutar el proyecto en local
```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/taskflow-project

# 2. Instala las dependencias del backend
cd server
npm install

# 3. Crea el archivo .env dentro de server/
PORT=3000

# 4. Arranca el servidor
npm run dev

# 5. Abre index.html con Live Server
```

## 🧪 Testing manual

| Prueba | Resultado |
|---|---|
| App con lista vacía | ✅ Muestra mensaje de estado vacío |
| Añadir tarea sin título | ✅ Muestra mensaje de error |
| Añadir tarea con menos de 3 caracteres | ✅ Muestra mensaje de error |
| Añadir tarea con título muy largo | ✅ Se añade y se muestra correctamente |
| Marcar varias tareas como completadas | ✅ Se actualiza el estado y las estadísticas |
| Eliminar varias tareas | ✅ Se eliminan correctamente |
| Recargar la página | ✅ Los datos persisten en el servidor |
| Filtro por pendientes | ✅ Muestra solo tareas no completadas |
| Filtro por completadas | ✅ Muestra solo tareas completadas |
| Búsqueda por texto | ✅ Filtra en tiempo real |
| Servidor caído | ✅ Muestra mensaje de error de conexión |
| Modo oscuro | ✅ Cambia el tema y guarda la preferencia |

## ♿ Accesibilidad

- Todos los botones tienen texto descriptivo o `aria-label`
- La aplicación es navegable con teclado
- Los inputs tienen etiquetas `label` correctamente asociadas
- El contraste de colores cumple los estándares básicos de legibilidad
- El foco es visible al navegar con Tab

## 🔧 Estructura del objeto tarea
```javascript
{
  id: "uuid",           // Identificador único
  text: "Nombre",       // Texto de la tarea
  prioridad: "media",   // "alta" | "media" | "baja"
  completed: false,     // Estado de la tarea
  createdAt: "ISO date" // Fecha de creación
}
```