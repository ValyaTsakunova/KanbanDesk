//TASKS LOAD
const toDoColumn = document.querySelector('.to_do');
const inProgressColumn = document.querySelector('.in_progress');
const doneColumn = document.querySelector('.done');

const arrayOfUsersFromJson = getFromStorage(STORAGE_KEY);

const createElement = (id, title, description, user, date) => {
    let taskContainerElement = document.createElement('div');
    taskContainerElement.classList.add('task-elem-container');

    let taskHeaderElement = document.createElement('div');
    taskHeaderElement.classList.add('task-elem-header');

    let newTaskElem = document.createElement('div');
    newTaskElem.classList.add('task-elem');
    newTaskElem.setAttribute('data-task-id', id);
    newTaskElem.setAttribute('draggable', 'true');

    let taskElemTitle = document.createElement('div');
    taskElemTitle.classList.add('task-elem-title');
    taskElemTitle.textContent = title;

    let cancelElement = document.createElement('div');
    cancelElement.classList.add('elem-cancel');
    let cancelImageElement = document.createElement('img');
    cancelImageElement.src = '/images/cancel.svg';
    cancelImageElement.alt = 'cancel';
    cancelElement.append(cancelImageElement);

    let taskElemDescription = document.createElement('div');
    taskElemDescription.classList.add('task-elem-description');
    taskElemDescription.textContent = description;

    let taskElemInfoName = document.createElement('div');
    taskElemInfoName.classList.add('info-name');
    taskElemInfoName.textContent = user;

    let taskElemInfoDate = document.createElement('div');
    taskElemInfoDate.classList.add('info-date');
    taskElemInfoDate.textContent = date;

    let taskElemInfo = document.createElement('div');
    taskElemInfo.classList.add('task-elem-info');
    taskElemInfo.append(taskElemInfoName, taskElemInfoDate)

    taskHeaderElement.append(taskElemTitle, cancelElement);
    taskContainerElement.append(taskHeaderElement, taskElemDescription, taskElemInfo);
    newTaskElem.append(taskContainerElement);
    return newTaskElem;
}

const addElem = () => {
    if (arrayOfUsersFromJson) {
        for (let userInfo of arrayOfUsersFromJson) {
            const {id, title, description, user, status, createdDate} = userInfo;
            const task = createElement(id, title, description, user, createdDate);
            if (status === TO_DO) {
                toDoColumn.append(task);
            } else if (status === IN_PROGRESS) {
                inProgressColumn.append(task);
            } else if (status === DONE) {
                doneColumn.append(task);
            }
        }
    }
}

addElem();