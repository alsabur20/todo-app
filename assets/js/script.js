document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");

let currentFilter = "all"; // State to track the current filter

// Load tasks from local storage and display them based on the filter
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks(tasks); // Render all tasks on initial load
}

// Render tasks based on the current filter
function renderTasks(tasks) {
    taskList.innerHTML = "";
    const filteredTasks = tasks.filter((task) => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach((task) => addTaskToDOM(task));
    updateTaskCount(); // Update the task count on initial load
}

// Add a task
addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = { id: Date.now(), text: taskText, completed: false };
        saveTask(task);
        taskInput.value = "";
        loadTasks(); // Refresh task list after adding a new task
    }
});

// Save a task to local storage
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task completion in local storage
function updateTask(id) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const task = tasks.find((task) => task.id === id);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks(tasks); // Refresh task list after update
    }
}

// Delete task from local storage
function deleteTask(id) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const filteredTasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
    renderTasks(filteredTasks); // Refresh task list after deletion
}

// Add a task to the DOM
function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.className =
        "list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center";
    li.innerHTML = `
    <span class="flex-grow-1 ${
        task.completed ? "text-decoration-line-through" : ""
    } text-break pe-3">
      ${task.text}
    </span>
    <div class="d-flex mt-2 mt-sm-0">
      <button class="btn btn-sm btn-outline-secondary me-2 complete-btn">
        <i class="${
            !task.completed ? "fa fa-check" : "fa fa-times"
        }" aria-hidden="true"></i>
      </button>
      <button class="btn btn-sm btn-danger delete-btn">
        <i class="fa fa-trash"></i>
      </button>
    </div>
  `;

    // Mark task as complete
    li.querySelector(".complete-btn").addEventListener("click", () => {
        const taskText = li.querySelector("span");
        const icon = li.querySelector(".complete-btn i");

        // Toggle the task completion status in the DOM
        taskText.classList.toggle("text-decoration-line-through");

        // Toggle the icon based on completion status
        if (taskText.classList.contains("text-decoration-line-through")) {
            icon.classList.replace("fa-check", "fa-times");
        } else {
            icon.classList.replace("fa-times", "fa-check");
        }

        // Update the task completion status in local storage
        updateTask(task.id);
    });

    // Delete task
    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        deleteTask(task.id);
    });

    taskList.appendChild(li);
}

// Function to update the displayed task count
function updateTaskCount() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskCountNumber.textContent = tasks.length;
}

// Function to reset filter button styles
function resetFilterButtons() {
    const filterButtons = document.querySelectorAll(
        "#allTasksBtn, #activeTasksBtn, #completedTasksBtn"
    );
    filterButtons.forEach((button) => {
        button.classList.remove("active-filter");
    });
}

// Filter tasks based on the selected filter
document.getElementById("allTasksBtn").addEventListener("click", () => {
    currentFilter = "all";
    resetFilterButtons(); // Reset styles before setting the new active
    document.getElementById("allTasksBtn").classList.add("active-filter"); // Highlight active button
    loadTasks();
});

document.getElementById("activeTasksBtn").addEventListener("click", () => {
    currentFilter = "active";
    resetFilterButtons(); // Reset styles before setting the new active
    document.getElementById("activeTasksBtn").classList.add("active-filter"); // Highlight active button
    loadTasks();
});

document.getElementById("completedTasksBtn").addEventListener("click", () => {
    currentFilter = "completed";
    resetFilterButtons(); // Reset styles before setting the new active
    document.getElementById("completedTasksBtn").classList.add("active-filter"); // Highlight active button
    loadTasks();
});
