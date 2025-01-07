// Get references to DOM elements
const taskInput = document.getElementById('taskInput'); // Input for task text
const addTaskButton = document.getElementById('addTask'); // Button to add task
const taskList = document.getElementById('taskList'); // Task list (<ul>)

// Function to create a new <li> element for a task
function createTaskElement(taskText, isCompleted = false) {
    const li = document.createElement('li'); // Create the <li> element
    const span = document.createElement('span'); // Create the <span> for the text
    span.textContent = taskText; // Set the text content of the span

    // If the task is completed, add the "completed" class
    if (isCompleted) {
        li.classList.add('completed');
    }

    // Create the "Complete" button
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.classList.add('complete-button'); // Add a class for styling
    completeButton.addEventListener('click', () => {
        li.classList.toggle('completed'); // Toggle the "completed" class
        updateLocalStorage(); // Update localStorage
    });

    // Create the "Delete" button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        li.remove(); // Remove the <li> from the list
        updateLocalStorage(); // Update localStorage
    });

    // Append the created elements to the <li>
    li.appendChild(span);
    li.appendChild(completeButton);
    li.appendChild(deleteButton);
    return li; // Return the created <li> element
}

// Function to load tasks from localStorage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || []; // Get tasks from localStorage or an empty array
    savedTasks.forEach(task => { // Iterate over saved tasks
        taskList.appendChild(createTaskElement(task.text, task.completed)); // Create and append elements to the list
    });
}

// Function to update localStorage
function updateLocalStorage() {
    const tasks = Array.from(taskList.children).map(li => ({ // Create an array of task objects
        text: li.querySelector('span').textContent, // Get the task text
        completed: li.classList.contains('completed') // Get the completion status
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save the array to localStorage
}

// Function to add a task (used by both button and Enter key)
function addTask() {
    const taskText = taskInput.value.trim(); // Get the text from the input, trimming whitespace
    if (taskText !== '') { // Check if the text is not empty
        taskList.appendChild(createTaskElement(taskText)); // Create and add the task to the list
        taskInput.value = ''; // Reset the input field
        updateLocalStorage(); // Update localStorage
    }
}

// Event listener for the "Add" button click
addTaskButton.addEventListener('click', addTask);

// Event listener for the "Enter" key in the input field
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { // Check if the "Enter" key was pressed
        event.preventDefault(); // Prevent form submission (if any)
        addTask(); // Call the function to add the task
    }
});

// Load tasks from localStorage when the document is loaded
document.addEventListener('DOMContentLoaded', loadTasks);