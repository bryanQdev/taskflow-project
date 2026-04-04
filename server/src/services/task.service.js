const { randomUUID } = require('crypto');

// Array en memoria que simula una base de datos
let tasks = [];

/**
 * Devuelve todas las tareas.
 * @returns {Array} Lista de tareas
 */
function obtenerTodas() {
    return tasks;
}

/**
 * Crea una nueva tarea y la añade al array.
 * @param {Object} data - Datos de la tarea
 * @param {string} data.text - Texto de la tarea
 * @param {string} data.prioridad - Prioridad de la tarea
 * @returns {Object} La tarea creada
 */
function crearTarea(data) {
    const tarea = {
        id: randomUUID(),
        text: data.text,
        prioridad: data.prioridad,
        completed: false,
        createdAt: new Date().toISOString(),
    };

    tasks.push(tarea);
    return tarea;
}

/**
 * Elimina una tarea por su id.
 * @param {string} id - Id de la tarea a eliminar
 * @returns {void}
 */
function eliminarTarea(id) {
    const existe = tasks.find(t => t.id === id);

    if (!existe) {
        throw new Error('NOT_FOUND');
    }

    tasks = tasks.filter(t => t.id !== id);
}

module.exports = { obtenerTodas, crearTarea, eliminarTarea };