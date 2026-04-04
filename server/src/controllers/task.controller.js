const taskService = require('../services/task.service');

/**
 * Devuelve todas las tareas.
 */
function obtenerTodas(req, res) {
    const tareas = taskService.obtenerTodas();
    res.status(200).json(tareas);
}

/**
 * Crea una nueva tarea.
 */
function crearTarea(req, res) {
    const { text, prioridad } = req.body;

    // Validación
    if (!text || typeof text !== 'string' || text.trim().length < 3) {
        return res.status(400).json({ 
            error: 'El texto es obligatorio y debe tener al menos 3 caracteres.' 
        });
    }

    const prioridadesValidas = ['alta', 'media', 'baja'];
    if (!prioridad || !prioridadesValidas.includes(prioridad)) {
        return res.status(400).json({ 
            error: 'La prioridad debe ser alta, media o baja.' 
        });
    }

    const tarea = taskService.crearTarea({ text: text.trim(), prioridad });
    res.status(201).json(tarea);
}

/**
 * Elimina una tarea por su id.
 */
function eliminarTarea(req, res) {
    const { id } = req.params;

    try {
        taskService.eliminarTarea(id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Tarea no encontrada.' });
        }
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

module.exports = { obtenerTodas, crearTarea, eliminarTarea };