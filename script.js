const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');

const taskColumns = [todo, progress, done];

function updateTaskCount(column) {
    const taskCount = column.querySelectorAll('.task').length;
    
    const countDisplay = column.querySelector('.heading .right');

    countDisplay.textContent = `Count: ${taskCount}`;
}

taskColumns.forEach(updateTaskCount);

document.querySelectorAll('.task').forEach((task, index) => {
    
    if (!task.id) {
        task.id = `task-${index + 1}`; 
    }

    task.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.id); 

        e.currentTarget.classList.add('is-dragging'); 
        
    });

    task.addEventListener("dragend", (e) => {

        e.currentTarget.classList.remove('is-dragging');
        
    });
});


taskColumns.forEach(column => {
    
    column.addEventListener("dragover", (e) => {
        e.preventDefault(); 
    });

    
    column.addEventListener("dragenter", (e) => {
        column.classList.add("hover-over");
    });
    
    
    column.addEventListener("dragleave", (e) => {
        if (!column.contains(e.relatedTarget)) {
            column.classList.remove("hover-over");
        }
    });

    column.addEventListener("drop", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over");

        const data = e.dataTransfer.getData("text/plain");
        const draggedTask = document.getElementById(data);

        if (draggedTask) {
            
            const originalColumn = draggedTask.closest('.task-column'); 

            column.appendChild(draggedTask); 
            
            if (originalColumn && originalColumn !== column) {
                updateTaskCount(originalColumn);
            }
            updateTaskCount(column);
        }
    });
});


const toggleModalButton = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal .bg");
const addNewTask = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", (event) => {
    modal.classList.toggle("active");
});

modalBg.addEventListener("click", (event) => {
    modal.classList.remove("active");   
});

addNewTask.addEventListener("click", () => {
    const taskTitle = document.querySelector("#task-title").value;
    const taskDesc = document.querySelector("#task-desc").value;

    if (!taskTitle) {
        alert("Please enter a task title.");
        return;
    }

    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");
    
    const taskIndex = document.querySelectorAll('.task').length + 1;
    div.id = `task-${taskIndex}`;

    div.innerHTML = `
        <h3>${taskTitle}</h3>
        <p>${taskDesc}</p>
        <button class="delete-btn">Delete</button>
    `;

    todo.appendChild(div);

    div.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", div.id);
        div.classList.add('is-dragging');
    });

    div.addEventListener("dragend", (e) => {
        div.classList.remove('is-dragging');
    });

    updateTaskCount(todo);
    
    document.querySelector("#task-title").value = "";
    document.querySelector("#task-desc").value = "";
    modal.classList.remove("active");
});
