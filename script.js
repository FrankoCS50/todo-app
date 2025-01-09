(function () {
    // Get references to DOM elements
    const taskInput = document.getElementById('taskInput'); // Input for task text
    const addTaskButton = document.getElementById('addTask'); // Button to add task
    const taskList = document.getElementById('taskList'); // Task list (<ul>)
    let saveTimeout; // Variable for debouncing localStorage updates

    // Function to create a new <li> element for a task
    function createTaskElement(taskText, isCompleted = false) {
        const li = document.createElement('li'); // Create the <li> element
        const span = document.createElement('span'); // Create the <span> for the text
        span.textContent = taskText; // Set the text content of the span

        // If the task is completed, add the "completed" class
        li.classList.toggle('completed', isCompleted);

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
            li.classList.add('removing'); // Add a class for the fade-out animation
            setTimeout(() => {
                li.remove(); // Remove the <li> from the list after animation
                updateLocalStorage(); // Update localStorage
            }, 300); // Match this with the CSS transition duration
        });

        // Append the created elements to the <li>
        li.appendChild(span);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        return li; // Return the created <li> element
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        try {
            const savedTasks = JSON.parse(localStorage.getItem('tasks')) || []; // Get tasks from localStorage or an empty array
            savedTasks.forEach(task => { // Iterate over saved tasks
                taskList.appendChild(createTaskElement(task.text, task.completed)); // Create and append elements to the list
            });
        } catch (error) {
            console.error('Could not load tasks:', error); // Log any errors
        }
    }

    // Function to update localStorage with a debounce for performance
    function updateLocalStorage() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            const tasks = Array.from(taskList.children).map(li => ({
                text: li.querySelector('span').textContent, // Get the task text
                completed: li.classList.contains('completed') // Get the completion status
            }));
            localStorage.setItem('tasks', JSON.stringify(tasks)); // Save the array to localStorage
        }, 300); // Debounce delay
    }

    // Function to add a task (used by both button and Enter key)
    function addTask() {
        const taskText = taskInput.value.trim(); // Get the text from the input, trimming whitespace
        if (taskText) {
            // Check if task already exists
            const duplicateTask = Array.from(taskList.children).some(
                li => li.querySelector('span').textContent === taskText
            );
            if (!duplicateTask) {
                taskList.appendChild(createTaskElement(taskText)); // Create and add the task to the list
                taskInput.value = ''; // Reset the input field
                taskInput.focus(); // Refocus the input field
                updateLocalStorage(); // Update localStorage
            } else {
                alert('Task already exists!'); // Alert if duplicate task is detected
            }
        } else {
            alert('Task cannot be empty!'); // Alert if task is empty
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
})();