const API_URL = 'https://taskflow-project-8luk.vercel.app/api/v1/tasks';

/**
 * Obtiene todas las tareas del servidor.
 * @returns {Promise<Array>} Lista de tareas
 */
async function getTasks(){
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error('Error al obtener las tareas');
    return respuesta.json();
}
/**
 * Crea una nueva tarea en el servidor.
 * @param {Object} tarea - Datos de la tarea.
 * @returns {Promise<Object>} Tarea creada
 */
async function createTask(tarea){
    const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(tarea),
    });
    if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.error);
    }
    return respuesta.json();
}
/**
 * Elimina una tarea del servidor por su id.
 * @param {string} id - ID de la tarea.
 * @returns {Promise<void>}
 */
async function deleteTask(id) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method:'DELETE',
    });
    if (!respuesta.ok) throw new Error('Error al eliminar la tarea')
}
