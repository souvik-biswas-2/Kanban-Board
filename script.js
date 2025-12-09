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