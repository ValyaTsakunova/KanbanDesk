const addDragAndDropEventListeners = () => {
    let dragColumns = document.querySelectorAll('.column-body');
    let dragElements = document.querySelectorAll('.task-elem');

    dragColumns.forEach(element => {
        element.addEventListener('drop', (event) => {
            drop(event);
        });

        element.addEventListener('dragover', (event) => {
            allowDrop(event);
        })
    });

    dragElements.forEach(element => {
        element.addEventListener('dragstart', (event) => {
            drag(event);
        })
    })
}

addDragAndDropEventListeners();

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("task_id", ev.target.getAttribute('data-task-id'));
}

function drop(ev) {
    ev.preventDefault();
    if (ev.target.dataset.id === 'in_progress') {
        let inProgressCount = document.getElementById('in_progress');
        if (inProgressCount.textContent < 7) {
            moveCard(ev);
        } else {
            exceedingTaskLimitPopup.style.display = DISPLAY_BLOCK;
        }
    } else {
        moveCard(ev);
    }
}

function moveCard(ev) {
    let data = ev.dataTransfer.getData("task_id");
    let card = document.querySelector(`[data-task-id="${data}"]`);
    ev.target.append(card);
    setNewStatus(ev)
}

function setNewStatus(ev) {
    let tasksFromLocalStorage = getFromStorage(STORAGE_KEY);

    if (ev.target.getAttribute('data-id') === 'done') {
        for (child of ev.target.children) {
            for (user of tasksFromLocalStorage) {
                if (child.getAttribute('data-task-id') == user.id) {
                    user.status = 'done';
                }
            }
        }
    }
    if (ev.target.getAttribute('data-id') === 'in_progress') {
        for (child of ev.target.children) {
            for (user of tasksFromLocalStorage) {
                if (child.getAttribute('data-task-id') == user.id) {
                    user.status = 'progress';
                }
            }
        }
    }
    if (ev.target.getAttribute('data-id') === 'to_do') {
        for (child of ev.target.children) {
            for (user of tasksFromLocalStorage) {
                if (child.getAttribute('data-task-id') == user.id) {
                    if (user.status === 'done') {
                        delete user.comments;
                    }
                    user.status = 'todo';
                }
            }
        }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksFromLocalStorage));
    addEditTaskEventListeners();
    countTasks();
}
