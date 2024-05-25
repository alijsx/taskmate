document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

  
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  
    tasks.forEach(task => addTaskToDOM(task));

    addTaskBtn.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const task = { id: Date.now(), text: taskText, completed: false };
            tasks.push(task);
            addTaskToDOM(task);
            saveTasks();
            taskInput.value = '';
        }
    });

    function addTaskToDOM(task) {
        const taskItem = document.createElement('div');
        taskItem.dataset.id = task.id;
        taskItem.classList.add('bg-gray-100', 'rounded', 'flex', 'items-center', 'justify-between');

        taskItem.innerHTML = `
            <input type="text" class="task-text px-3 py-2 text-xl flex-grow ${task.completed ? 'line-through' : ''}" value="${task.text}" ${task.completed ? 'readonly' : ''}>
            <button class="complete-task-btn text-green-500 hover:text-green-700 px-2">${task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>'}</button>
            <button class="edit-save-btn text-blue-500 hover:text-blue-700 px-2">${task.isEditing ? '<i class="fas fa-save"></i>' : '<i class="fas fa-edit"></i>'}</button>
            <button class="delete-btn text-red-500 hover:text-red-700 px-2"><i class="fas fa-trash-alt"></i></button>
        `;
        taskList.appendChild(taskItem);

        const taskTextElement = taskItem.querySelector('.task-text');
        const completeTaskBtn = taskItem.querySelector('.complete-task-btn');
        const editSaveBtn = taskItem.querySelector('.edit-save-btn');
        const deleteBtn = taskItem.querySelector('.delete-btn');

        completeTaskBtn.addEventListener('click', function() {
            task.completed = !task.completed;
            taskTextElement.classList.toggle('line-through');
            taskTextElement.readOnly = task.completed;
            completeTaskBtn.innerHTML = task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>';
            saveTasks();
        });

        editSaveBtn.addEventListener('click', function() {
            if (task.isEditing) {
                // Save task
                task.text = taskTextElement.value.trim();
                taskTextElement.readOnly = true;
                editSaveBtn.innerHTML = '<i class="fas fa-edit"></i>';
                task.isEditing = false;
                saveTasks();
            } else {
                // Start editing task
                taskTextElement.readOnly = false;
                editSaveBtn.innerHTML = '<i class="fas fa-save"></i>';
                task.isEditing = true;
            }
        });

        deleteBtn.addEventListener('click', function() {
            tasks.splice(tasks.findIndex(t => t.id === task.id), 1);
            taskItem.remove();
            saveTasks();
        });

        taskTextElement.addEventListener('blur', function() {
            if (task.isEditing) {
                // Save task on blur if it's being edited
                task.text = taskTextElement.value.trim();
                saveTasks();
            }
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
