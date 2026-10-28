// ----------------------------------------------------------------
// Simple To-Do App using plain JavaScript.
// Instead of a real database, we just keep all of our tasks in a
// plain JavaScript array (a list of objects) that lives in memory.
// NOTE: because nothing is saved to disk, all tasks will disappear
// if the page is refreshed. That's expected for this simple version.
// ----------------------------------------------------------------

// Our "database": just an array that holds task objects.
let tasks = [];

// Keeps track of the next id to give a new task (like an
// auto-incrementing id column in a real database).
let nextId = 1;

// ---------------------- CRUD functions ----------------------

// Create: adds a new task to the tasks array.
function createTask(name, details, dueDate) {
    const task = {
        id: nextId,
        name: name,
        details: details,
        dueDate: dueDate
    };
    nextId++;
    tasks.push(task);
    console.log(tasks)
    return task;
}

// Read: returns every task currently stored.
function getTasks() {
    return tasks;
}

// Read: finds and returns a single task by its id.
function getTaskById(id) {
    return tasks.find(task => task.id === id);
}

// Update: changes the fields of an existing task.
// "updates" is an object with the new values, e.g. { name: 'New name' }.
function updateTask(id, updates) {
    const task = getTaskById(id);
    if (!task) {
        return null;
    }
    Object.assign(task, updates);
    console.log(tasks)
    return task;
}

// Delete: removes a task from the tasks array.
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
console.log(tasks);
}

// ---------------------- Page/UI functions ----------------------

// Fills the dropdown list with the names of every saved task.
function populateTasksDropdown() {
    const dropdown = document.getElementById('taskDropdown');
    dropdown.innerHTML = '<option value="">Select a task</option>';
    getTasks().forEach(task => {
        const option = document.createElement('option');
        option.value = task.id;
        option.textContent = task.name;
        dropdown.appendChild(option);
    });
}

// Shows the details (and edit form) for whichever task is selected
// in the dropdown.
function displayTaskDetails() {
    const dropdown = document.getElementById('taskDropdown');
    const taskId = Number(dropdown.value);
    const detailsDiv = document.getElementById('taskDetails');

    if (!taskId) {
        detailsDiv.innerHTML = '';
        return;
    }

    const task = getTaskById(taskId);
    if (!task) {
        detailsDiv.innerHTML = '';
        return;
    }

    detailsDiv.innerHTML = `
        <h3>${task.name}</h3>
        <p>${task.details}</p>
        <p>Due Date: ${task.dueDate}</p>
        <button type="button" class="btn btn-danger" onclick="handleDelete(${task.id})">Delete</button>
        <button type="button" class="btn btn-secondary" onclick="showEditForm(${task.id})">Edit</button>

        <form id="editForm" class="mt-3 d-none">
            <label for="editName" class="form-label">Task Name:</label>
            <input type="text" class="form-control" id="editName" value="${task.name}" required><br>

            <label for="editDetails" class="form-label">Details</label>
            <textarea class="form-control" id="editDetails" required>${task.details}</textarea><br>

            <label for="editDueDate" class="form-label">Due Date</label>
            <input type="date" class="form-control" id="editDueDate" value="${task.dueDate}" required><br><br>

            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    `;

    // Attach the submit handler now that the form exists in the page.
    document.getElementById('editForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const updates = {
            name: document.getElementById('editName').value,
            details: document.getElementById('editDetails').value,
            dueDate: document.getElementById('editDueDate').value
        };
        updateTask(task.id, updates);
        populateTasksDropdown();
        dropdown.value = task.id;
        displayTaskDetails();
    });
}

// Reveals the edit form so the user can change the task's fields.
function showEditForm() {
    document.getElementById('editForm').classList.remove('d-none');
}

// Deletes the selected task and refreshes the page's lists.
function handleDelete(id) {
    deleteTask(id);
    populateTasksDropdown();
    document.getElementById('taskDetails').innerHTML = '';
}

// ---------------------- Start the app ----------------------

function init() {
    populateTasksDropdown();

    // Wire up the "create task" form.
    document.getElementById('taskForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const details = document.getElementById('details').value;
        const dueDate = document.getElementById('dueDate').value;

        createTask(name, details, dueDate);
        populateTasksDropdown();
        event.target.reset();
        alert('Task created successfully!');
    });

    // Wire up the dropdown so selecting a task shows its details.
    document.getElementById('taskDropdown').addEventListener('change', displayTaskDetails);
}

init();
