const deleteAllTaskPopup = document.getElementById('delete_all_tasks');
const deleteTaskPopup = document.getElementById('delete_task');
const exceedingTaskLimitPopup = document.getElementById('exceeding_task_limit');

let removeTaskId = '';
let removeAllTaskId = '';

const addRemoveTaskEventListeners = () => {
    let tasks = document.querySelectorAll('.task-elem-header .elem-cancel img');

    tasks.forEach(task => {
        task.addEventListener('click', event => {
            deleteTaskPopup.style.display = DISPLAY_BLOCK;
            const taskElement = event.currentTarget.parentNode.parentNode.parentNode.parentElement;
            removeTaskId = taskElement.getAttribute('data-task-id');
        })
    })
}

addRemoveTaskEventListeners();

const addRemoveAllTaskEventListeners = () => {
    let removeButton = document.querySelectorAll('.remove');

    removeButton.forEach(button => {
        button.addEventListener('click', event => {
            deleteAllTaskPopup.style.display = DISPLAY_BLOCK;
            const parentColumn = event.currentTarget.parentElement;
            removeAllTaskId = parentColumn.getAttribute('data-column-id');
        });
    })
}

addRemoveAllTaskEventListeners();

document.getElementById('delete_all_tasks_confirm').addEventListener('click', () => {
    const column = document.querySelector(`[data-column-id='${removeAllTaskId}']`);
    const columnBody = column.parentElement;
    const columnBodyElements = columnBody.getElementsByClassName('column-body');
    const taskElements = columnBodyElements[0].getElementsByClassName('task-elem');
    const tasksFromLocalStorage = getFromStorage(STORAGE_KEY);
    const filteredTasks = tasksFromLocalStorage.filter(item => item.status !== removeAllTaskId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
    Array.from(taskElements).forEach(item => item.remove());
    countTasks();
    deleteAllTaskPopup.style.display = DISPLAY_NONE;
})

document.getElementById('delete_all_tasks_cancel').addEventListener('click', () => {
    deleteAllTaskPopup.style.display = DISPLAY_NONE;
})

document.getElementById('delete_task_confirm').addEventListener('click', () => {
    const tasksFromLocalStorage = getFromStorage(STORAGE_KEY);
    const filteredTasks = tasksFromLocalStorage.filter(item => item.id !== parseInt(removeTaskId));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
    document.querySelector(`[data-task-id='${removeTaskId}']`).remove();
    countTasks();
    deleteTaskPopup.style.display = DISPLAY_NONE;
})

document.getElementById('delete_task_cancel').addEventListener('click', () => {
    deleteTaskPopup.style.display = DISPLAY_NONE;
})

document.getElementById('exceeding_task_limit_cancel').addEventListener('click', () => {
    exceedingTaskLimitPopup.style.display = DISPLAY_NONE;
})

