//Variables globales
const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn")
const taskList = document.getElementById("taskList");
const prioridadBtns = document.querySelectorAll(".prioridad-btn");
const searchInput = document.getElementById("searchInput");
const template = document.getElementById("tarea-template");
let filtroActivo = "todas";

// Referencias a los estados de red
const estadoCargando = document.getElementById("estado-cargando");
const estadoError = document.getElementById("estado-error");
const estadoVacio = document.getElementById("estado-vacio");

/**
 * Muestra u oculta los estados de la UI según la situación de red.
 * @param {'cargando'|'error'|'vacio'|'normal'} estado
 */
function setEstado(estado) {
    estadoCargando.classList.add("hidden");
    estadoError.classList.add("hidden");
    estadoVacio.classList.add("hidden");

    if (estado === "cargando") estadoCargando.classList.remove("hidden");
    if (estado === "error") estadoError.classList.remove("hidden");
    if (estado === "vacio") estadoVacio.classList.remove("hidden");
}


/**
 * @typedef {Object} Tarea
 * @property {string} id - Identificador único de la tarea.
 * @property {string} text - Texto descriptivo de la tarea.
 * @property {string} prioridad - Nivel de prioridad asignado a la tarea
 *                                (por ejemplo: "baja", "media" o "alta").
 * @property {boolean} completed - Indica si la tarea está completada.
 * @property {string} createdAt - Fecha de creación en formato ISO 8601.
 */

/** @type {Tarea[]} */
let tareas = [];
let prioridadSeleccionada = "media"; //Valor por defecto






//Cada vez que el usuario escribe, filtramos.   

searchInput.addEventListener("input", filterTask);

// Botones de prioridad
prioridadBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        prioridadBtns.forEach(b => {
            b.classList.remove("bg-indigo-600", "text-white", "border-indigo-600");
            b.classList.add("bg-gray-100", "dark:bg-gray-700", "text-gray-400");
        });
        btn.classList.remove("bg-gray-100", "dark:bg-gray-700", "text-gray-400", "border-indigo-600");
        btn.classList.add("bg-indigo-600", "text-white", "border-indigo-600");
        prioridadSeleccionada = btn.dataset.prioridad;
    });
});

// Marcamos la prioridad por defecto ("media") en la UI
prioridadBtns.forEach(btn => {
    if (btn.dataset.prioridad === prioridadSeleccionada) {
        btn.classList.remove("bg-gray-100", "dark:bg-gray-700", "text-gray-400");
        btn.classList.add("bg-indigo-600", "text-white", "border-indigo-600");
    } else {
        btn.classList.add("bg-gray-100", "dark:bg-gray-700", "text-gray-400"); // ✅ inicializa inactivos
    }
});





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






//  Seleccionamos los botones de filtro
const filtroBtns = document.querySelectorAll(".filtro-btn");
filtroBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filtroBtns.forEach(b => {b.classList.remove("bg-indigo-600", "text-white", "border-indigo-600");
            b.classList.add("border-gray-200", "dark:border-gray-600","text-gray-800", "dark:text-gray-100");});

            btn.classList.remove("border-gray-200", "dark:border-gray-600","text-gray-800", "dark:text-gray-100");
            btn.classList.add("bg-indigo-600", "text-white", "border-indigo-600" );

        filtroActivo = btn.dataset.filtro;
        applyFilter();
    });
});


function applyFilter() {
    const tareasDOM = taskList.querySelectorAll(".deberes");

    tareasDOM.forEach(tareaElemento => {
        const id = tareaElemento.dataset.id;
        const tarea = tareas.find(t => t.id === id);
        if (!tarea) return;

        const visible =
            filtroActivo === "todas" ||
            (filtroActivo === "pendientes" && !tarea.completed) ||
            (filtroActivo === "completadas" && tarea.completed);

        tareaElemento.style.display = visible ? "flex" : "none";
    });
}


//Agregamos el evento al boton añadir tarea

button.addEventListener("click", addTask);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});
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


async function addTask(){
    const text = input.value;
    const mensajeError = document.getElementById("mensaje-error-longitud");

    if(!validarLongitudTarea(text)){
        if(mensajeError) mensajeError.style.display = "block";
        return;
    } else {
        if(mensajeError) mensajeError.style.display = "none";
    }

    try {
        const tarea = await createTask({
            text: text.trim(),
            prioridad: prioridadSeleccionada,
        });

        tareas.push(tarea);
        renderTask(tarea);
        input.value = "";
        updateStats();
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        alert(error.message);
    }
}

// Orden de prioridad para comparar
const ordenPrioridad = { alta: 1, media: 2, baja: 3 };
let ordenActivo = null;

const ordenBtns = document.querySelectorAll(".orden-btn");

ordenBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Si ya estaba activo, lo desactivamos
        if (ordenActivo === btn.dataset.orden) {
            ordenActivo = null;
            ordenBtns.forEach(b => {
                b.classList.remove("bg-indigo-600", "text-white", "border-indigo-600");
            });
            rerenderTareas();
            return;
        }

        ordenBtns.forEach(b => {
            b.classList.remove("bg-indigo-600", "text-white", "border-indigo-600");
        });
        btn.classList.add("bg-indigo-600", "text-white", "border-indigo-600");
        ordenActivo = btn.dataset.orden;
        rerenderTareas();
    });
});

/**
 * Limpia el DOM y vuelve a renderizar las tareas según el orden activo.
 *
 * @returns {void}
 */
function rerenderTareas() {
    taskList.innerHTML = "";

    let tareasOrdenadas = [...tareas];

    if (ordenActivo === "prioridad") {
        tareasOrdenadas.sort((a, b) => ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad]);
    } else if (ordenActivo === "fecha") {
        tareasOrdenadas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    tareasOrdenadas.forEach(tarea => renderTask(tarea));
    applyFilter();
}


    

    
// Carga las tareas desde el servidor al iniciar la aplicación
/**
 * Obtiene las tareas del servidor y las renderiza al iniciar la app.
 *
 * @returns {void}
 */
async function loadTasksFromStorage() {
    try {
        tareas = await getTasks();
        tareas.forEach(task => renderTask(task));
        updateStats();
    } catch (error) {
        console.error('Error al cargar las tareas:', error);
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
        if (tarea.completed) tareaElemento.classList.add("completada"); 


        const toggleBtn = clone.querySelector(".completeBtn"); 
toggleBtn.addEventListener("click", function () {
    toggleTask(tarea.id, tareaElemento);
});

const editBtn = clone.querySelector(".editBtn");
    editBtn.addEventListener("click", () => {
        editTask(tarea.id, tareaElemento);
    });

        const deleteBtn = clone.querySelector(".deleteBtn");
        deleteBtn.addEventListener("click", function(){
            tareaElemento.remove();
            removeTaskFromArray(tarea.id);

        });

        taskList.appendChild(clone);
    }

    /**
* Alterna el estado completed de una tarea y actualiza el DOM. *
 * @param {string} id - Id de la tarea a alternar.
 * @param {HTMLElement} tareaElemento - Elemento del DOM que representa la tarea.
 * @returns {void}
 */
function toggleTask(id, tareaElemento) {
    const tarea = tareas.find(task => task.id === id);
    if (!tarea) return;

    tarea.completed = !tarea.completed;
    tareaElemento.classList.toggle("completada", tarea.completed);
    
    applyFilter();
    updateStats();
}
/**
 * Permite editar el título de una tarea existente.
 * Reemplaza el h2 por un input, y al confirmar actualiza
 * el array y el DOM.
 *
 * @param {string} id - Id de la tarea a editar.
 * @param {HTMLElement} tareaElemento - Elemento del DOM que representa la tarea.
 * @returns {void}
 */
function editTask(id, tareaElemento) {
    const tarea = tareas.find(task => task.id === id);
    if (!tarea) return;

    const h2 = tareaElemento.querySelector(".tarea-texto");
    const textoActual = tarea.text;

    // Reemplazamos el h2 por un input
    const inputEdicion = document.createElement("input");
    inputEdicion.type = "text";
    inputEdicion.value = textoActual;
    inputEdicion.classList.add("input-edicion", "flex-1","dark:text-white", "dark:bg-gray-900");
    h2.replaceWith(inputEdicion);
    inputEdicion.focus();

    // Función que confirma el cambio
    function confirmarEdicion() {
        const nuevoTexto = inputEdicion.value.trim();

        if (nuevoTexto.length < 3) {
            inputEdicion.classList.add("input-edicion--error");
            return;
        }

        tarea.text = nuevoTexto;
        

        const nuevoH2 = document.createElement("h2");
        nuevoH2.classList.add("tarea-texto","flex-1", "text-base", "dark:text-gray-100", "font-medium","text-gray-800");
        nuevoH2.textContent = nuevoTexto;
        inputEdicion.replaceWith(nuevoH2);
        updateStats();
    }

    // Confirmamos al perder el foco o al pulsar Enter
    inputEdicion.addEventListener("blur", confirmarEdicion);
    inputEdicion.addEventListener("keydown", e => {
        if (e.key === "Enter") inputEdicion.blur();
        if (e.key === "Escape") {
            const nuevoH2 = document.createElement("h2");
            nuevoH2.classList.add("tarea-texto");
            nuevoH2.textContent = textoActual;
            inputEdicion.replaceWith(nuevoH2);
        }
    });
}


       

    

    /**
     * Elimina la tarea del servidor y del arreglo en memoria.
     *
     * @param {string} id - Id de la tarea a eliminar.
     * @returns {void}
     */
    const removeTaskFromArray = async (id) => {
        try {
            await deleteTask(id);
            tareas = tareas.filter(task => task.id !== id);
            updateStats();
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    };




/**
 * Actualiza el panel de estadísticas con los datos actuales del array tareas.
 *
 * @returns {void}
 */
function updateStats() {
    const total = tareas.length;
    const completadas = tareas.filter(t => t.completed).length;
    const pendientes = total - completadas;

    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-pendientes").textContent = pendientes;
    document.getElementById("stat-completadas").textContent = completadas;

    // Mostrar estado vacío si no hay tareas
    if (total === 0) {
        setEstado("vacio");
    } else {
        setEstado("normal");
    }
}

/**
 * Marca todas las tareas como completadas y actualiza el DOM.
 *
 * @returns {void}
 */
function completeAllTasks() {
    tareas.forEach(tarea => {
        tarea.completed = true;
        const tareaElemento = taskList.querySelector(`.deberes[data-id="${tarea.id}"]`);
        if (tareaElemento) tareaElemento.classList.add("completada");
    });
    applyFilter();
    updateStats();
}

document.getElementById("completeAllBtn").addEventListener("click", completeAllTasks);

/**
 * Elimina todas las tareas completadas del array y del DOM,
 * y actualiza localStorage.
 *
 * @returns {void}
 */
function deleteCompletedTasks() {
    tareas
        .filter(tarea => tarea.completed)
        .forEach(tarea => {
            const tareaElemento = taskList.querySelector(`.deberes[data-id="${tarea.id}"]`);
            if (tareaElemento) tareaElemento.remove();
        });

    tareas = tareas.filter(tarea => !tarea.completed);
    updateStats();
}

document.getElementById("deleteCompletedBtn").addEventListener("click", deleteCompletedTasks);


//Modo oscuro

const darkModeBtn = document.getElementById("darkModeBtn");

//Cargar preferencia guardada

if(localStorage.getItem("darkMode")==="true"){
    document.documentElement.classList.add("dark");
    darkModeBtn.textContent = "☀️ Modo claro";
}

darkModeBtn.addEventListener("click", () =>{
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", isDark);
    darkModeBtn.textContent = isDark ? "☀️ Modo claro" : "🌙 Modo oscuro";
});