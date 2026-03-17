//Variables globales
const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn")
const taskList = document.getElementById("taskList");
const prioridadBtns = document.querySelectorAll(".prioridad-btn");
const searchInput = document.getElementById("searchInput");
const template = document.getElementById("tarea-template");


/**
 * @typedef {Object} Tarea
 * @property {string} id - Identificador único de la tarea.
 * @property {string} text - Texto descriptivo de la tarea.
 * @property {string} prioridad - Nivel de prioridad asignado a la tarea
 *                                (por ejemplo: "baja", "media" o "alta").
 */

/** @type {Tarea[]} */
let tareas = [];
let prioridadSeleccionada = "media"; //Valor por defecto

/**
 * Persiste el arreglo `tareas` en localStorage.
 *
 * @returns {void}
 */
function saveTasksToStorage() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

/**
 * Normaliza tareas cargadas (por ejemplo, versiones antiguas sin `id`).
 *
 * @param {any} task
 * @returns {Tarea}
 */
function normalizeTask(task) {
    const id = typeof task?.id === "string" && task.id.trim() ? task.id : crypto.randomUUID();
    return {
        id,
        text: String(task?.text ?? ""),
        prioridad: String(task?.prioridad ?? "media"),
    };
}


//Cada vez que el usuario escribe, filtramos.   

searchInput.addEventListener("input", filterTask);

/**
 * Filtra las tareas visibles en la lista según el texto introducido
 * en el campo de búsqueda, mostrando solo las que coinciden parcial
 * o totalmente con el término buscado.
 */
function filterTask() {
    const searchText = searchInput.value.trim().toLowerCase();
    const tareasDOM = taskList.querySelectorAll(".deberes");

    tareasDOM.forEach((tarea) => {
        const tituloTarea = tarea.querySelector("h2");
        if (!tituloTarea) return;

        const textoTarea = tituloTarea.textContent.trim().toLowerCase();
        const contieneBusqueda = textoTarea.includes(searchText);

        tarea.style.display = contieneBusqueda ? "flex" : "none";
    });
}



//Agregamos eventos a los botones de prioridad
prioridadBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        prioridadBtns.forEach(b => b.classList.remove("activo"));
        btn.classList.add("activo");
        prioridadSeleccionada = btn.dataset.prioridad;
    });
});

// Marcamos la prioridad por defecto ("media") en la UI
prioridadBtns.forEach((btn) => {
    if (btn.dataset.prioridad === prioridadSeleccionada) btn.classList.add("activo");
});


//Agregamos el evento al boton añadir tarea

button.addEventListener("click", addTask);
/**
 * Crea una nueva tarea a partir del input, valida longitud, actualiza el estado
 * en memoria, persiste en localStorage y renderiza en el DOM.
 *
 * @returns {void}
 */

/**
 * Valida que el texto de la tarea tenga una longitud mínima.
 *
 * @param {string} texto Texto ingresado por el usuario.
 * @returns {boolean} `true` si cumple la longitud mínima; si no, `false`.
 */
function validarLongitudTarea(texto) {
    return texto.trim().length >= 3;
}

/**
 * Crea la tarea leyendo el input y muestra/oculta el mensaje de error de longitud.
 *
 * @returns {void}
 */
function addTask(){
    const text = input.value;
    const mensajeError = document.getElementById("mensaje-error-longitud");

    if(!validarLongitudTarea(text)){
        if(mensajeError) mensajeError.style.display = "block";
        return;
    } else {
        if(mensajeError) mensajeError.style.display = "none";
    }

    /** @type {Tarea} */
    const tarea = { id: crypto.randomUUID(), text: text, prioridad: prioridadSeleccionada };

    tareas.push(tarea);

    saveTasksToStorage();

    renderTask(tarea);

    input.value = "";
}




    

    
//Cargar tareas desde localStorage al iniciar la aplicación
/**
 * Carga las tareas desde localStorage y las renderiza al iniciar la app.
 *
 * @returns {void}
 */
function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem("tareas");
    if (!storedTasks) return;

    try {
        const parsed = JSON.parse(storedTasks);
        if (!Array.isArray(parsed)) throw new Error("Formato inválido");

        /** @type {Tarea[]} */
        const normalized = parsed.map(normalizeTask);
        tareas = normalized;
        saveTasksToStorage(); // actualiza storage si faltaban ids

        tareas.forEach((task) => {
            renderTask(task);
        });
    } catch {
        tareas = [];
        saveTasksToStorage();
    }
}

loadTasksFromStorage();

    //Crear una tarea en el HTML
    /**
     * Renderiza una tarea en la lista del DOM utilizando el template HTML,
     * configurando su texto, prioridad y el comportamiento del botón de borrado.
     *
     * @param {Tarea} tarea - Tarea a renderizar.
     * @returns {void}
     */
    function renderTask(tarea){
        const clone = template.content.cloneNode(true);

        clone.querySelector(".tarea-texto").textContent = tarea.text;
        clone.querySelector(".prioridad").textContent = tarea.prioridad;
        clone.querySelector(".prioridad").classList.add(tarea.prioridad);

        const tareaElemento = clone.querySelector(".deberes");
        tareaElemento.dataset.id = tarea.id;

        const deleteBtn = clone.querySelector(".deleteBtn");
        deleteBtn.addEventListener("click", function(){
            tareaElemento.remove();
            removeTaskFromArray(tarea.id);
        });

        taskList.appendChild(clone);
    }

       

    

    /**
     * Elimina del arreglo de tareas la tarea cuyo texto coincide con el
     * proporcionado y actualiza la información persistida en localStorage.
     *
     * @param {string} id - Id de la tarea a eliminar.
     * @returns {void}
     */
    const removeTaskFromArray = (id) => {
        tareas = tareas.filter(task => task.id !== id);
        saveTasksToStorage();
    };



//Función que obtiene todas las tareas del localStorage
/**
 * Obtiene el arreglo de tareas persistido en localStorage y lo
 * devuelve como una lista tipada de objetos `Tarea`.
 *
 * @returns {Tarea[]} Lista de tareas almacenadas o un arreglo vacío si no hay datos.
 */
function getTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem("tareas");
    if (!storedTasks) return [];

    try {
        const parsed = JSON.parse(storedTasks);
        if (!Array.isArray(parsed)) return [];
        return parsed.map(normalizeTask);
    } catch {
        return [];
    }
}


