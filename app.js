//Variables globales
const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn")
const taskList = document.getElementById("taskList");
const prioridadBtns = document.querySelectorAll(".prioridad-btn");
const searchInput = document.getElementById("searchInput");


/**
 * @typedef {Object} Tarea
 * @property {string} text - Texto descriptivo de la tarea.
 * @property {string} prioridad - Nivel de prioridad asignado a la tarea
 *                                (por ejemplo: "baja", "media" o "alta").
 */

/** @type {Tarea[]} */
let tareas = [];
let prioridadSeleccionada = "media"; //Valor por defecto


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
prioridadBtns.forEach(function(btn){
    btn.addEventListener("click", function(){

        //Removemos "activo" de todos los botones

        prioridadBtns.forEach(function(b){
            b.classList.remove("activo");
        });

        //Agregamos "activo" al botón seleccionado
        btn.classList.add("activo");
        
        //Se lo damos al que seleccionamos

        prioridadSeleccionada= btn.dataset.prioridad;
    });
});


//Agregamos el evento al boton añadir tarea

button.addEventListener("click", addTask);
/**
 * Crea una nueva tarea a partir del texto del input,
 * la agrega al arreglo en memoria, la persiste en localStorage
 * y la renderiza en la lista del DOM.
*/

// Validamos la longitud del texto antes de crear la tarea
function validarLongitudTarea(texto) {
    return texto.trim().length >= 3;
}

// Modificamos addTask para mostrar/ocultar el mensaje de error
function addTask(){
    const text = input.value;
    const mensajeError = document.getElementById("mensaje-error-longitud");

    if(!validarLongitudTarea(text)){
        if(mensajeError) mensajeError.style.display = "block";
        return;
    } else {
        if(mensajeError) mensajeError.style.display = "none";
    }

    const tarea = {text: text, prioridad:prioridadSeleccionada};

    tareas.push(tarea);

    localStorage.setItem("tareas", JSON.stringify(tareas));

    renderTask(text,prioridadSeleccionada);

    input.value = "";
}




    

    
//Cargar tareas desde localStorage al iniciar la aplicación
    const storedTasks = localStorage.getItem("tareas");
    if(storedTasks){
        tareas = JSON.parse(storedTasks);
        tareas.forEach(function(task){

            renderTask(task.text, task.prioridad); //Prioridad por defecto al cargar tareas
            
        });
    }

    //Crear una tarea en el HTML
    /**
     * Renderiza una tarea en la lista del DOM utilizando el template HTML,
     * configurando su texto, prioridad y el comportamiento del botón de borrado.
     *
     * @param {string} text - Texto descriptivo de la tarea.
     * @param {string} prioridad - Nivel de prioridad asociado a la tarea.
     */
    function renderTask(text, prioridad){
        const template = document.getElementById("tarea-template");

        const clone = template.content.cloneNode(true);

        clone.querySelector(".tarea-texto").textContent = text;
        clone.querySelector(".prioridad").textContent = prioridad;
        clone.querySelector(".prioridad").classList.add(prioridad);


        const tareaElemento = clone.querySelector(".deberes");

        const deleteBtn = clone.querySelector(".deleteBtn");
        deleteBtn.addEventListener("click", function(){
            tareaElemento.remove();
            removeTaskFromArray(text);
        });

        taskList.appendChild(clone);

       

    }
    

    /**
     * Elimina del arreglo de tareas la tarea cuyo texto coincide con el
     * proporcionado y actualiza la información persistida en localStorage.
     *
     * @param {string} text - Texto de la tarea a eliminar.
     */
    function removeTaskFromArray(text){

        tareas = tareas.filter(function(task){
            return task.text !== text;
        });

        localStorage.setItem("tareas",JSON.stringify(tareas));
    }



//Funciòn que obtiene todas las tareas del localStorage
/**
 * Obtiene el arreglo de tareas persistido en localStorage y lo
 * devuelve como una lista tipada de objetos `Tarea`.
 *
 * @returns {Tarea[]} Lista de tareas almacenadas o un arreglo vacío si no hay datos.
 */
function getTasksFromLocalStorage(){
    const storedTasks = localStorage.getItem("tareas");
    if(storedTasks){
        /** @type {Tarea[]} */
        const parsed = JSON.parse(storedTasks);
        return parsed;
    }
    return [];
}


