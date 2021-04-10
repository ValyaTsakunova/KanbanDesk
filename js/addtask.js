// Selectors 
const addElementButton = document.querySelector('.add-element');
const toDoColumnBody = document.querySelector('.column-body');
const modalWindowCreateTask = document.querySelector('.createTask-elem');
const saveTaskButton = document.querySelector('#firstSave');
const createTaskTitleInput = document.querySelector('.createTask-title');
const taskDescriptionInput = document.querySelector('.createTask-elem-textarea');
const selectTags = document.querySelector('select');

// Check empty fields
function isValid(array) {
    return array.every(function (input) {
        return (input.value)
    })
}

// Add error class to empty fields
function styleEmptyFields(array) {
    if (!isValid(array)) {
        array.forEach(function (input) {
            if (!input.value) {
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
            input.onfocus = function () {
                if (input.classList.contains('error')) {
                    input.classList.remove('error');
                }
            }
        })
    }
}

// task-card constructor
class card {
    constructor(id, title, description, user, date) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.user = user;
        this.date = date;
        this.parent = toDoColumnBody;
    }

    render() {
        const element = document.createElement('div');
        element.classList.add('task-elem');
        element.setAttribute('data-task-id', this.id);
        element.setAttribute('draggable', 'true');
        element.innerHTML = `<div class="task-elem-container">
                                <div class="task-elem-header">
                                    <div class="task-elem-title">${this.title}</div>
                                    <div class="elem-cancel">
                                        <img src="/images/cancel.svg" alt="cancel">
                                    </div>
                                </div>
                                <div class="task-elem-description">${this.description}</div>
                                <div class="task-elem-info">
                                    <div class="info-name">${this.user}</div>
                                    <div class="info-date">${this.date}</div>
                                </div>
                             </div>`;

        this.parent.append(element);
    }
}

// Add tasks' values to LS
function addToLocalStorage(id, title, description, user, date) {
    let tasksArray = getFromStorage(STORAGE_KEY);
    let task = {
        id: id,
        createdDate: date,
        status: 'todo',
        user: user,
        title: title,
        description: description,
        comments: [],
    };
    if (tasksArray) {
        tasksArray.push(task);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksArray));

    } else {
        tasksArray = [];
        tasksArray.push(task);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksArray));
    }
}

// Listeners
addElementButton.addEventListener('click', function () {
    selectTags.innerHTML = '';
    modalWindowCreateTask.style.display = 'block';
    getUserList().then(user => {
        user.forEach(el => {
            selectTags.innerHTML += `<option>${el.username}</option>`;
        });
    })
})

saveTaskButton.addEventListener('click', addToDo);

function addToDo() {
    let inputArray = [];
    inputArray.push(createTaskTitleInput, taskDescriptionInput);
    isValid(inputArray);
    styleEmptyFields(inputArray);

    if (isValid(inputArray)) {
        const taskElement = new card(Math.floor(Math.random() * 100) + 1, createTaskTitleInput.value,
            taskDescriptionInput.value, selectTags.value, taskDate);
        taskElement.render();
        addToLocalStorage(taskElement.id, taskElement.title, taskElement.description, taskElement.user, taskElement.date);
        createTaskTitleInput.value = '';
        taskDescriptionInput.value = '';
        modalWindowCreateTask.style.display = 'none';
    }

    countTasks();
    addEditTaskEventListeners();
    addDragAndDropEventListeners();
}