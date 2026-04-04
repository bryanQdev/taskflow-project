# 📝 Mi App de Tareas

Una aplicación web para gestionar tareas diarias con persistencia de datos local.

## 🚀 Demo
ENLACE VERCEL: https://taskflow-project-henna.vercel.app/

## ✨ Funcionalidades

- ✅ Añadir tareas con validación de longitud mínima
- ✅ Eliminar tareas
- ✅ Marcar tareas como completadas
- ✅ Editar el título de una tarea existente
- ✅ Asignar prioridad (alta, media, baja)
- ✅ Filtro por estado (todas, pendientes, completadas)
- ✅ Búsqueda por texto en tiempo real
- ✅ Marcar todas las tareas como completadas
- ✅ Borrar todas las tareas completadas
- ✅ Panel de estadísticas en tiempo real
- ✅ Persistencia de datos con localStorage
- ✅ Modo oscuro con preferencia guardada

## 🛠️ Tecnologías

- HTML5
- CSS3
- Tailwind CSS (CDN)
- JavaScript (Vanilla)

## 📁 Estructura del proyecto

taskflow-project/
├── index.html
├── styles.css
├── app.js
└── docs/
    ├── ai/
    │   ├── prompt-engineering.md
    │   └── experiments.md
    └── design/

## 🧪 Testing manual

| Prueba | Resultado |
|---|---|
| App con lista vacía | ✅ Se muestra correctamente sin errores |
| Añadir tarea sin título | ✅ Muestra mensaje de error |
| Añadir tarea con menos de 3 caracteres | ✅ Muestra mensaje de error |
| Añadir tarea con título muy largo | ✅ Se añade y se muestra correctamente |
| Marcar varias tareas como completadas | ✅ Se actualiza el estado y las estadísticas |
| Eliminar varias tareas | ✅ Se eliminan correctamente |
| Recargar la página | ✅ Los datos persisten en localStorage |
| Filtro por pendientes | ✅ Muestra solo tareas no completadas |
| Filtro por completadas | ✅ Muestra solo tareas completadas |
| Búsqueda por texto | ✅ Filtra en tiempo real |
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