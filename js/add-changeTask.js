// Selectors 
const addButton = document.querySelector('.add-element');
const modalCreateTask = document.querySelector('.createTask-elem');
const saveButton = document.querySelector('#firstSave');
const taskTitleInput = document.querySelector('.createTask-title');
const taskDescInput = document.querySelector('.createTask-elem-textarea');
const select = document.querySelector('select');
const titleError = document.createElement('span');
const editButton = document.querySelector('#edit');
const checkButton = document.querySelector('#submit');
const saveEditedTaskButton = document.querySelector('#secondSave');
const commentText = document.querySelector('.addCommentBlock-input');
const addCommentButton = document.querySelector('.addCommentBlock-button');
const selectUser = document.querySelector('.user-of-comment');
const commentContainer = document.querySelector('.createTask-addCommentBlock');
const taskTitle = document.querySelector('.task-title');
const taskDescription = document.querySelector('.task-elem-textarea');
const chooseUser = document.querySelector('.createTask-elem-chooseUser');
const columnToDo = document.querySelector('.to_do');
const cancelModal = document.getElementById('cancel_modal');

titleError.innerHTML = 'The title can not be longer than 27 symbols';
titleError.classList.add('error-text');

const setObjToStorage = (tasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

// Check empty fields
function isValid(array) {
    return array.every(function (input) {
        return (input.value && taskTitleInput.value.length < 27)
    })
}

// Add error class to empty fields
function styleEmptyFields(array) {
    if (!isValid(array)) {
        array.forEach(function (input) {
            if (!input.value) {
                input.classList.add('error');
            } else if (taskTitleInput.value.length > 27) {
                taskDescInput.before(titleError);
            } else {
                input.classList.remove('error');
            }
            input.onfocus = function () {
                if (input.classList.contains('error')) {
                    input.classList.remove('error');

                }
                taskTitleInput.onfocus = function () {
                    if (titleError) {
                        titleError.remove();
                    }
                }
            }
        })
    }
}

// task-card constructor
class taskCard {
    constructor(id, title, description, user, date) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.user = user;
        this.date = date;
    }

    render(column) {
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

        column.append(element);
    }
}

// Add tasks' values to LS
function addToLocalStorage(id, title, description, user, date) {
    let tasksArray = getFromStorage(STORAGE_KEY);
    let task = {
        id: id,
        createdDate: date,
        status: TO_DO,
        user: user,
        title: title,
        description: description,
        comments: []
    }
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
addButton.addEventListener('click', function () {
    modalCreateTask.style.display = DISPLAY_BLOCK;
    commentContainer.style.display = DISPLAY_NONE;
})

saveButton.addEventListener('click', addToDo);

function addToDo() {
    let inputArray = [];
    inputArray.push(taskTitleInput, taskDescInput);
    isValid(inputArray);
    styleEmptyFields(inputArray);
    if (isValid(inputArray)) {
        const taskElement = new taskCard(Math.floor(Math.random() * 100) + 1, taskTitleInput.value,
            taskDescInput.value, select.value, taskDate);
        taskElement.render(columnToDo);
        addToLocalStorage(taskElement.id, taskElement.title, taskElement.description, taskElement.user, taskElement.date);
        countTasks();

        taskTitleInput.value = '';
        taskDescInput.value = '';
        modalCreateTask.style.display = DISPLAY_NONE;
    }
    addRemoveTaskEventListeners();
}

/// edit task + add comment
const addEditTaskEventListeners = () => {
    let editedElement = document.querySelectorAll('.to_do .task-elem');
    editedElement.forEach(element => {
        element.addEventListener('click', event => {
            let targetTaskID = element.getAttribute('data-task-id');

            if (event.target.localName !== 'img') {
                openTask();
                addTaskDescFromLS(targetTaskID);
                addCommentsFromLS(targetTaskID);
            }

            editButton.addEventListener('click', makeTaskEditable);
            checkButton.addEventListener('click', showChangedTask);

            addCommentButton.addEventListener('click', function () {
                createComment(commentText.value, selectUser.value);
                addCommentToLocalStorage(targetTaskID, commentText.value, selectUser.value);
                commentText.value = '';
            })

            saveEditedTaskButton.addEventListener('click', () => {
                addTaskDecrToLocalStorage(targetTaskID, taskTitle.innerHTML, taskDescription.innerHTML);
                element.querySelector('.task-elem-title').innerHTML = taskTitle.innerHTML;
                element.querySelector('.task-elem-description').innerHTML = taskDescription.innerHTML;
                taskTitleInput.value = '';
                taskDescInput.value = '';
                saveChangedTask();
            })
        })
    })
}

addEditTaskEventListeners();

const setUsersToCommentDropDown = () => {
    getUserList().then(user => {
        user.forEach(el => {
            selectUser.innerHTML += `<option>${el.username}</option>`;
        });
    })
}

cancelModal.addEventListener('click', () => {
    modalCreateTask.style.display = DISPLAY_NONE;
})

// открытие модального окна при нажатии на карточку
function openTask() {
    const taskComments = document.querySelectorAll('.createTask-commentBlock');
    for (let comment of taskComments) {
        comment.remove();
    }

    setUsersToCommentDropDown();

    modalCreateTask.style.display = DISPLAY_BLOCK;
    saveButton.style.display = DISPLAY_NONE;
    editButton.style.display = DISPLAY_BLOCK;
    saveEditedTaskButton.style.display = DISPLAY_BLOCK;
    chooseUser.style.display = DISPLAY_NONE;
    taskTitleInput.style.display = DISPLAY_NONE;
    taskDescInput.style.display = DISPLAY_NONE;
    taskTitle.style.display = DISPLAY_BLOCK;
    taskDescription.style.display = DISPLAY_BLOCK;
    commentText.style.display = DISPLAY_BLOCK;

    document.querySelector('.createTask-addCommentBlock').style.display = DISPLAY_BLOCK;
    document.querySelector('.addBut-plus').style.display = DISPLAY_BLOCK;
    document.querySelector('.addCommentBLock-action').style.display = DISPLAY_BLOCK;
    document.querySelector('.addCommentBlock-button').style.display = DISPLAY_BLOCK;
    document.querySelector('.user-of-comment').style.display = DISPLAY_BLOCK;
}

// замена title и decr на инпуты для ввода нового названия и описания
function makeTaskEditable() {
    editButton.style.display = DISPLAY_NONE;
    checkButton.style.display = DISPLAY_BLOCK;
    taskTitleInput.style.display = DISPLAY_BLOCK;
    taskDescInput.style.display = DISPLAY_BLOCK;
    taskTitle.style.display = DISPLAY_NONE;
    taskDescription.style.display = DISPLAY_NONE;
}

// осохранение изменений карточки (моадльное окно остается открытым, отображаются новые значения title,desc)
function showChangedTask() {
    checkButton.style.display = DISPLAY_NONE;
    editButton.style.display = DISPLAY_BLOCK;
    taskTitleInput.style.display = DISPLAY_NONE;
    taskTitle.style.display = DISPLAY_BLOCK;
    taskDescInput.style.display = DISPLAY_NONE;
    taskDescription.style.display = DISPLAY_BLOCK;
    taskTitle.innerHTML = taskTitleInput.value;
    taskDescription.innerHTML = taskDescInput.value;
}

// закрытие модального окна при внесении изменений в карточку
function saveChangedTask() {
    modalCreateTask.style.display = DISPLAY_NONE;
    editButton.style.display = DISPLAY_NONE;
    checkButton.style.display = DISPLAY_NONE;
    saveEditedTaskButton.style.display = DISPLAY_NONE;
    taskTitleInput.innerHTML = '';
    taskDescInput.innerHTML = '';
    saveButton.style.display = DISPLAY_BLOCK;
    select.style.display = DISPLAY_BLOCK;
    saveEditedTaskButton.style.display = DISPLAY_NONE;
    taskTitleInput.style.display = DISPLAY_BLOCK;
    taskTitle.style.display = DISPLAY_NONE;
    taskDescInput.style.display = DISPLAY_BLOCK;
    taskDescription.style.display = DISPLAY_NONE;
    chooseUser.style.display = DISPLAY_BLOCK;
}

// создание комментария
function createComment(comment, user) {
    const commentElement = document.createElement('div');
    commentElement.classList.add('createTask-commentBlock');
    commentElement.innerHTML = `<div class="comment-container">
                                    <div class="comment-title">
                                        <span class="comment-name">${user}</span>
                                        <span class="comment-date"></span>
                                    </div>
                                    <div class="comment-description">${comment}</div>
                                </div>`
    commentContainer.prepend(commentElement);
}

// добавление описания карточки из ls
function addTaskDescFromLS(taskId) {
    let tasksArray = getFromStorage(STORAGE_KEY);
    if (tasksArray) {
        for (let task of tasksArray) {
            if (task.id == taskId) {
                taskTitle.innerHTML = task.title;
                taskDescription.innerHTML = task.description;
                taskTitleInput.value = task.title;
                taskDescInput.value = task.description;
            }
        }
    }
}

// добавление комментариев из ls
const addCommentsFromLS = (targetTaskId) => {
    let tasksArray = getFromStorage(STORAGE_KEY);
    let task = tasksArray.find(item => item.id == targetTaskId);
    if (task) {
        const {comments} = task;
        for (let item of comments) {
            createComment(item.comment, item.user);
        }
    }
}

// добавление комментариев в ls
const addCommentToLocalStorage = (taskId, newComment, user) => {
    let tasksArray = getFromStorage(STORAGE_KEY);
    let task = tasksArray.find(item => item.id == taskId);
    if (task) {
        const {comments} = task;
        comments.push({comment: newComment, user: user});
        setObjToStorage(tasksArray);
    }
}

// добавление нового описания карточки в ls
const addTaskDecrToLocalStorage = (taskId, taskTitle, taskDescription) => {
    let tasksArray = getFromStorage(STORAGE_KEY);
    let task = tasksArray.find(item => item.id == taskId);
    if (task) {
        task.title = taskTitle;
        task.description = taskDescription;
        setObjToStorage(tasksArray);
    }
}