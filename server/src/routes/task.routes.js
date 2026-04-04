const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

// GET /api/v1/tasks → obtener todas las tareas
router.get('/', taskController.obtenerTodas);

// POST /api/v1/tasks → crear una tarea nueva
router.post('/', taskController.crearTarea);

// DELETE /api/v1/tasks/:id → eliminar una tarea por id
router.delete('/:id', taskController.eliminarTarea);

module.exports = router;