const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');

const taskColumns = [todo, progress, done];

// Storage key for localStorage
const STORAGE_KEY = 'kanban_tasks';

// ===== STORAGE FUNCTIONS =====

// Save all tasks to localStorage
function saveTasks() {
    const tasks = [];
    
    taskColumns.forEach(column => {
        const columnId = column.id;
        const columnTasks = column.querySelectorAll('.task');
        
        columnTasks.forEach(task => {
            const title = task.querySelector('h3').textContent;
            const description = task.querySelector('p').textContent;
            
            tasks.push({
                id: task.id,
                title: title,
                description: description,
                column: columnId
            });
        });
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Load all tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    
    if (!savedTasks) return;
    
    const tasks = JSON.parse(savedTasks);
    
    tasks.forEach(taskData => {
        const column = document.querySelector(`#${taskData.column}`);
        
        if (column) {
            const div = document.createElement('div');
            div.classList.add('task');
            div.setAttribute('draggable', 'true');
            div.id = taskData.id;
            
            div.innerHTML = `
                <h3>${taskData.title}</h3>
                <p>${taskData.description}</p>
                <button class="delete-btn">Delete</button>
            `;
            
            column.appendChild(div);
            
            // Attach listeners
            attachDeleteListener(div);
            attachDragListener(div);
            updateTaskCount(column);
        }
    });
}

// ===== UTILITY FUNCTIONS =====

function updateTaskCount(column) {
    const taskCount = column.querySelectorAll('.task').length;
    const countDisplay = column.querySelector('.heading .right');
    countDisplay.textContent = `Count: ${taskCount}`;
}

function deleteTask(taskElement) {
    const column = taskElement.closest('.task-column');
    taskElement.remove();
    if (column) {
        updateTaskCount(column);
        saveTasks();
    }
}

function attachDeleteListener(taskElement) {
    const deleteButton = taskElement.querySelector('.delete-btn');
    if (deleteButton) {
        deleteButton.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteTask(taskElement);
        });
    }
}

function attachDragListener(taskElement) {
    taskElement.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", taskElement.id);
        taskElement.classList.add('is-dragging');
    });

    taskElement.addEventListener("dragend", (e) => {
        taskElement.classList.remove('is-dragging');
    });
}

// ===== LOAD TASKS ON PAGE LOAD =====

loadTasks();

// ===== DRAG AND DROP =====

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
            saveTasks();
        }
    });
});

// ===== MODAL AND ADD TASK =====

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
    
    const taskIndex = Date.now();
    div.id = `task-${taskIndex}`;

    div.innerHTML = `
        <h3>${taskTitle}</h3>
        <p>${taskDesc}</p>
        <button class="delete-btn">Delete</button>
    `;

    todo.appendChild(div);

    attachDeleteListener(div);
    attachDragListener(div);

    updateTaskCount(todo);
    
    // Save to localStorage
    saveTasks();
    
    document.querySelector("#task-title").value = "";
    document.querySelector("#task-desc").value = "";
    modal.classList.remove("active");
});
