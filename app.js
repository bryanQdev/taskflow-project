//Variables globales
const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn")
const taskList = document.getElementById("taskList");
const prioridadBtns = document.querySelectorAll(".prioridad-btn");
const searchInput = document.getElementById("searchInput");


let tareas = [];
let prioridadSeleccionada = "media"; //Valor por defecto


//Cada vez que el usuario escribe, filtramos.

searchInput.addEventListener("input", filterTask);
function filterTask(){
    //Tomamos el texto escrito en minuscula
    const searchText= searchInput.value.toLowerCase();

    //Tomamos todas las tareas del DOM
    const todasLasTareas = taskList.querySelectorAll(".deberes");

    //Recorremos cada tarea y verificamos si el texto de la tarea incluye el texto de busqueda
    todasLasTareas.forEach(function(tarea){
        //Tomamos el texto  del h2 de esa tarea en minuscula
        const textoTarea = tarea.querySelector("h2").textContent.toLowerCase();
        
        //Si el texto de la tarea incluye el texto de lo que se buscò, lo mostramos
            if(textoTarea.includes(searchText)){
                tarea.style.display= "flex";
            } else{
                //Si no, lo ocultamos
                tarea.style.display = "none";
            }
        } );
    };



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
function addTask(){
    const text = input.value;
    if(text.trim()==="") return;

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
    function renderTask(text, prioridad){
        const tareaElemento = document.createElement("div");

        tareaElemento.classList.add("deberes");

        tareaElemento.innerHTML = `
        <h2>${text}</h2>
        
        <span class="prioridad ${prioridad}">${prioridad}</span>
        <button class= "deleteBtn">Eliminar</button>
        `;

        const deleteBtn = tareaElemento.querySelector(".deleteBtn");

        deleteBtn.addEventListener("click", function(){
            tareaElemento.remove();

            removeTaskFromArray(text);

        });
        taskList.appendChild(tareaElemento)

    }


    function removeTaskFromArray(text){

        tareas = tareas.filter(function(task){
            return task.text !== text;
        });

        localStorage.setItem("tareas",JSON.stringify(tareas));
    }



