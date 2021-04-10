// Local storage key
const STORAGE_KEY = 'kanban';

// Column constants
const TO_DO = 'todo';
const IN_PROGRESS = 'progress';
const DONE = 'done';

// Display constants
const DISPLAY_NONE = 'none';
const DISPLAY_BLOCK = 'block';

// For date display
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

let taskDate = `${new Date().getDate()} ${months[new Date().getMonth()]}, ${new Date().getFullYear()}`;

// Web API to get users
const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

// Get information from localstorage
const getFromStorage = (STORAGE_KEY) => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
}

// Get/set user list from/to API
const getUserList = () => fetch(BASE_URL).then(res => res.json());

// count tasks
const countTasks = () => {
    let numberOfToDo = document.getElementById('to_do');
    let numberOfInProgress = document.getElementById('in_progress');
    let numberOfDone = document.getElementById('done');

    let tasksArray = getFromStorage(STORAGE_KEY);
    let numberOfTasksToDo = 0;
    let numberOfTasksInProgress = 0;
    let numberOfTasksDone = 0;

    if (tasksArray) {
        for (let task of tasksArray) {
            const {status} = task;
            if (status === TO_DO) {
                numberOfTasksToDo++;
            } else if (status === IN_PROGRESS) {
                numberOfTasksInProgress++;
            } else if (status === DONE) {
                numberOfTasksDone++;
            }
        }

        numberOfToDo.innerHTML = `${numberOfTasksToDo}`;
        numberOfInProgress.innerHTML = `${numberOfTasksInProgress}`;
        numberOfDone.innerHTML = `${numberOfTasksDone}`;
    }
}

countTasks();