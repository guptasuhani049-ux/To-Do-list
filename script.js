
/* ==========================================================
   TODO LIST - DATA STRUCTURES MINI PROJECT
   Data Structures: Linked List, Stack, Queue, Binary Max-Heap
   ========================================================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const STORAGE_KEY = "todolist-mini-project-tasks";
const THEME_KEY = "todolist-mini-project-theme";

const taskForm = $("#taskForm");
const taskInput = $("#taskInput");
const taskDate = $("#taskDate");
const taskTime = $("#taskTime");
const taskPriority = $("#taskPriority");
const taskList = $("#taskList");
const emptyState = $("#emptyState");
const sortSelect = $("#sortSelect");

/* ==========================================================
   1. SINGLY LINKED LIST
   Each task is stored inside a node.
   ========================================================== */

class TaskNode {
  constructor(task) {
    this.task = task;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // Insert a task at the end of the list.
  append(task) {
    const node = new TaskNode(task);

    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }

    this.length++;
    return node;
  }

  // Insert a new task at the beginning.
  prepend(task) {
    const node = new TaskNode(task);

    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head = node;
    }

    this.length++;
    return node;
  }

  // Find a task by its unique ID.
  find(id) {
    let current = this.head;

    while (current !== null) {
      if (current.task.id === id) {
        return current.task;
      }

      current = current.next;
    }

    return null;
  }

  // Delete a task by ID.
  delete(id) {
    if (this.head === null) return false;

    if (this.head.task.id === id) {
      this.head = this.head.next;
      this.length--;

      if (this.head === null) {
        this.tail = null;
      }

      return true;
    }

    let current = this.head;

    while (current.next !== null) {
      if (current.next.task.id === id) {
        const removed = current.next;

        current.next = removed.next;

        if (removed === this.tail) {
          this.tail = current;
        }

        this.length--;
        return true;
      }

      current = current.next;
    }

    return false;
  }

  // Update a task using its ID.
  update(id, updatedProperties) {
    const task = this.find(id);

    if (task === null) return false;

    Object.assign(task, updatedProperties);
    return true;
  }

  // Traverse the linked list and return its tasks.
  toArray() {
    const result = [];
    let current = this.head;

    while (current !== null) {
      result.push(current.task);
      current = current.next;
    }

    return result;
  }

  // Search tasks by name or ID.
  search(query) {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return this.toArray();

    const results = [];
    let current = this.head;

    while (current !== null) {
      const task = current.task;

      if (
        task.title.toLowerCase().includes(normalized) ||
        task.id.toLowerCase().includes(normalized)
      ) {
        results.push(task);
      }

      current = current.next;
    }

    return results;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
}

/* ==========================================================
   2. STACK
   LIFO = Last In, First Out.
   Used to undo task operations.
   ========================================================== */

class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1] ?? null;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}

/* ==========================================================
   3. QUEUE
   FIFO = First In, First Out.
   Used to process pending tasks in arrival order.
   ========================================================== */

class Queue {
  constructor() {
    this.items = [];
    this.frontIndex = 0;
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    if (this.isEmpty()) return null;

    const item = this.items[this.frontIndex];
    this.frontIndex++;

    // Periodically remove processed entries.
    if (
      this.frontIndex > 50 &&
      this.frontIndex >= this.items.length / 2
    ) {
      this.items = this.items.slice(this.frontIndex);
      this.frontIndex = 0;
    }

    return item;
  }

  peek() {
    return this.isEmpty() ? null : this.items[this.frontIndex];
  }

  isEmpty() {
    return this.frontIndex >= this.items.length;
  }

  size() {
    return this.items.length - this.frontIndex;
  }

  clear() {
    this.items = [];
    this.frontIndex = 0;
  }

  toArray() {
    return this.items.slice(this.frontIndex);
  }
}

/* ==========================================================
   4. PRIORITY QUEUE USING A BINARY MAX-HEAP
   High priority = 3, Medium = 2, Low = 1.
   Higher priority tasks are returned first.
   ========================================================== */

class PriorityQueue {
  constructor() {
    this.heap = [];
    this.priorityValue = {
      High: 3,
      Medium: 2,
      Low: 1
    };
  }

  compare(a, b) {
    const priorityDifference =
      this.priorityValue[a.priority] -
      this.priorityValue[b.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    // Earlier-created tasks come first when priorities tie.
    return (b.createdAt || 0) - (a.createdAt || 0);
  }

  enqueue(task) {
    this.heap.push(task);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);

      if (
        this.compare(this.heap[index], this.heap[parent]) <= 0
      ) {
        break;
      }

      [this.heap[index], this.heap[parent]] =
        [this.heap[parent], this.heap[index]];

      index = parent;
    }
  }

  dequeue() {
    if (this.heap.length === 0) return null;

    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const highestPriority = this.heap[0];

    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);

    return highestPriority;
  }

  bubbleDown(index) {
    const size = this.heap.length;

    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let highest = index;

      if (
        left < size &&
        this.compare(this.heap[left], this.heap[highest]) > 0
      ) {
        highest = left;
      }

      if (
        right < size &&
        this.compare(this.heap[right], this.heap[highest]) > 0
      ) {
        highest = right;
      }

      if (highest === index) break;

      [this.heap[index], this.heap[highest]] =
        [this.heap[highest], this.heap[index]];

      index = highest;
    }
  }

  peek() {
    return this.heap[0] ?? null;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  size() {
    return this.heap.length;
  }

  // Return tasks in priority order without modifying this heap.
  sortedTasks() {
    const copy = new PriorityQueue();

    this.heap.forEach(task => copy.enqueue(task));

    const result = [];

    while (!copy.isEmpty()) {
      result.push(copy.dequeue());
    }

    return result;
  }
}

/* ==========================================================
   INITIALIZATION AND PERSISTENCE
   ========================================================== */

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createSampleTasks() {
  const today = localDateString();
  const tomorrowDate = new Date();

  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const tomorrow = localDateString(tomorrowDate);
  const now = Date.now();

  return [
    {
      id: "sample-1",
      title: "Complete DSA Assignment",
      date: today,
      time: "19:00",
      priority: "High",
      completed: false,
      createdAt: now - 6000
    },
    {
      id: "sample-2",
      title: "Study DBMS Notes",
      date: tomorrow,
      time: "10:00",
      priority: "Medium",
      completed: false,
      createdAt: now - 5000
    },
    {
      id: "sample-3",
      title: "Build ToDo List Mini Project",
      date: today,
      time: "17:00",
      priority: "Low",
      completed: true,
      createdAt: now - 4000
    },
    {
      id: "sample-4",
      title: "Read UHV Chapter 1",
      date: today,
      time: "20:00",
      priority: "Medium",
      completed: false,
      createdAt: now - 3000
    },
    {
      id: "sample-5",
      title: "Prepare for DSDCO Quiz",
      date: tomorrow,
      time: "11:00",
      priority: "High",
      completed: false,
      createdAt: now - 2000
    },
    {
      id: "sample-6",
      title: "Workout",
      date: today,
      time: "18:00",
      priority: "Low",
      completed: true,
      createdAt: now - 1000
    }
  ];
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed.filter(task =>
          task &&
          typeof task.id === "string" &&
          typeof task.title === "string" &&
          ["High", "Medium", "Low"].includes(task.priority) &&
          typeof task.completed === "boolean"
        );
      }
    }
  } catch (error) {
    console.warn("Could not load saved tasks:", error);
  }

  return createSampleTasks();
}

const taskListDS = new LinkedList();
const undoStack = new Stack();

let tasks = loadTasks();

tasks.forEach(task => taskListDS.append(task));

let currentFilter = "all";
let currentView = "home";
let searchQuery = "";
let toastTimeout;

function saveTasks() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(taskListDS.toArray())
    );
  } catch (error) {
    console.error("Could not save tasks:", error);
    showToast("Could not save tasks in this browser.");
  }
}

function syncTasks() {
  tasks = taskListDS.toArray();
  saveTasks();
}

function rememberState() {
  // The stack stores snapshots before a change.
  undoStack.push(JSON.stringify(taskListDS.toArray()));

  // Avoid unlimited memory use.
  if (undoStack.size() > 50) {
    undoStack.items.shift();
  }

  updateDSControls();
}

function undoLastOperation() {
  if (undoStack.isEmpty()) {
    showToast("Nothing to undo yet.");
    return;
  }

  const previousState = undoStack.pop();

  try {
    const restoredTasks = JSON.parse(previousState);

    taskListDS.clear();
    restoredTasks.forEach(task => taskListDS.append(task));

    syncTasks();
    render();

    showToast("Last operation undone! ↶");
  } catch (error) {
    console.error("Undo failed:", error);
    showToast("Could not undo this operation.");
  }

  updateDSControls();
}

/* ==========================================================
   SAFE HTML AND NOTIFICATIONS
   ========================================================== */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function showToast(message) {
  const toast = $("#toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

/* ==========================================================
   TASK FORMATTING
   ========================================================== */

function formatTaskDate(dateString) {
  if (!dateString) return "No due date";

  const date = new Date(`${dateString}T12:00:00`);
  const today = localDateString();

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  if (dateString === today) return "Today";

  if (dateString === localDateString(tomorrowDate)) {
    return "Tomorrow";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function formatTaskTime(timeString) {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

/* ==========================================================
   SEARCH, FILTERING AND SORTING
   ========================================================== */

function getVisibleTasks() {
  let visible = taskListDS.search(searchQuery);

  if (currentView === "today") {
    visible = visible.filter(
      task => task.date === localDateString()
    );
  } else if (
    currentView === "completed" ||
    currentFilter === "completed"
  ) {
    visible = visible.filter(task => task.completed);
  } else if (currentFilter === "pending") {
    visible = visible.filter(task => !task.completed);
  }

  if (sortSelect.value === "priority") {
    const heap = new PriorityQueue();

    visible
      .filter(task => !task.completed)
      .forEach(task => heap.enqueue(task));

    const sortedPending = heap.sortedTasks();

    const completed = visible.filter(task => task.completed);

    visible = [...sortedPending, ...completed];
  } else if (sortSelect.value === "date") {
    visible.sort((a, b) => {
      if (a.completed !== b.completed) {
        return Number(a.completed) - Number(b.completed);
      }

      const dateA =
        `${a.date || "9999-12-31"}T${a.time || "23:59"}`;

      const dateB =
        `${b.date || "9999-12-31"}T${b.time || "23:59"}`;

      return dateA.localeCompare(dateB);
    });
  } else if (sortSelect.value === "newest") {
    visible.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sortSelect.value === "alphabetical") {
    visible.sort((a, b) => a.title.localeCompare(b.title));
  }

  return visible;
}

/* ==========================================================
   RENDER TASK CARDS
   ========================================================== */

function renderTasks() {
  const visibleTasks = getVisibleTasks();

  taskList.innerHTML = visibleTasks.map(task => {
    const priorityClass = task.priority.toLowerCase();

    const dateLabel = formatTaskDate(task.date);
    const timeLabel = formatTaskTime(task.time);

    const dateTimeLabel = timeLabel
      ? `${dateLabel}, ${timeLabel}`
      : dateLabel;

    return `
      <article
        class="task-card ${task.completed ? "is-completed" : ""}"
        data-task-id="${escapeHTML(task.id)}"
      >
        <input
          class="task-check"
          type="checkbox"
          data-action="toggle"
          aria-label="Toggle task completion"
          ${task.completed ? "checked" : ""}
        />

        <div class="task-main">
          <div class="task-title">${escapeHTML(task.title)}</div>

          <div class="task-meta">
            <span class="calendar-symbol">▦</span>
            <span>${escapeHTML(dateTimeLabel)}</span>
          </div>

          <div class="task-badges">
            <span class="priority ${priorityClass}">
              ${escapeHTML(task.priority)}
            </span>

            ${task.completed
              ? '<span class="task-status">COMPLETED</span>'
              : ""}
          </div>
        </div>

        <div class="task-actions">
          <button
            class="icon-button"
            data-action="edit"
            aria-label="Edit task"
            title="Edit task"
          >✎</button>

          <button
            class="icon-button delete"
            data-action="delete"
            aria-label="Delete task"
            title="Delete task"
          >♜</button>
        </div>
      </article>
    `;
  }).join("");

  const isEmpty = visibleTasks.length === 0;

  emptyState.classList.toggle("hidden", !isEmpty);
  taskList.classList.toggle("hidden", isEmpty);

  updateStatistics();
  updateViewHeading();
}

function updateStatistics() {
  const allTasks = taskListDS.toArray();

  const total = allTasks.length;
  const completed = allTasks.filter(task => task.completed).length;
  const pending = total - completed;

  const high = allTasks.filter(
    task => task.priority === "High" && !task.completed
  ).length;

  const percent = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  $("#allCount").textContent = total;
  $("#pendingCount").textContent = pending;
  $("#completedCount").textContent = completed;

  $("#totalStat").textContent = total;
  $("#completedStat").textContent = completed;
  $("#pendingStat").textContent = pending;
  $("#highStat").textContent = high;

  $("#progressPercent").textContent = `${percent}%`;
  $("#progressFill").style.width = `${percent}%`;

  $("#footerProgress").textContent =
    total === 0
      ? "Your next achievement starts with one task ✨"
      : completed === total
        ? "Amazing! You've completed every task! 🎉"
        : `${completed} of ${total} tasks completed. Keep going! ✨`;

  $("#emptyTitle").textContent =
    currentView === "today"
      ? "No tasks for today!"
      : currentFilter === "completed" || currentView === "completed"
        ? "Nothing completed yet!"
        : currentFilter === "pending"
          ? "No pending tasks!"
          : "Nothing here yet!";

  $("#emptyMessage").textContent =
    "Add a task or change your filter to see your tasks.";
}

function updateViewHeading() {
  const titles = {
    home: "Your Tasks",
    all: "All Tasks",
    today: "Today's Tasks",
    completed: "Completed Tasks",
    settings: "Settings"
  };

  const heading = $("#viewHeading");

  heading.textContent = titles[currentView] || "Your Tasks";
  heading.style.display = currentView === "home" ? "none" : "block";
}

function updateNavigation() {
  $$(".nav-item").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.view === currentView
    );
  });
}

function updateFilterButtons() {
  $$(".filter-tab").forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.filter === currentFilter
    );
  });
}

function updateDSControls() {
  const undoButton = $("#undoButton");

  if (undoButton) {
    undoButton.disabled = undoStack.isEmpty();
    undoButton.style.opacity = undoStack.isEmpty() ? ".5" : "1";
  }

  const processButton = $("#processButton");

  if (processButton) {
    const pendingCount = taskListDS
      .toArray()
      .filter(task => !task.completed).length;

    processButton.disabled = pendingCount === 0;
    processButton.style.opacity = pendingCount === 0 ? ".5" : "1";
  }

  const info = $("#dsInfo");

  if (info) {
    info.textContent =
      `Linked List: ${taskListDS.length} nodes | ` +
      `Undo Stack: ${undoStack.size()} saved states`;
  }
}

function render() {
  renderTasks();
  updateFilterButtons();
  updateDSControls();
}

/* ==========================================================
   ADD TASK
   ========================================================== */

function addTask(event) {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) {
    showToast("Please enter a task name first.");
    taskInput.focus();
    return;
  }

  const task = {
    id: window.crypto && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    date: taskDate.value,
    time: taskTime.value,
    priority: taskPriority.value,
    completed: false,
    createdAt: Date.now()
  };

  rememberState();

  // Actual Linked List insertion.
  taskListDS.append(task);

  syncTasks();

  taskInput.value = "";
  taskDate.value = localDateString();
  taskTime.value = "";
  taskPriority.value = "Medium";

  currentView = "home";
  currentFilter = "all";
  searchQuery = "";

  if ($("#taskSearch")) {
    $("#taskSearch").value = "";
  }

  updateNavigation();
  render();

  showToast("Task added to the Linked List! ✨");
  taskInput.focus();
}

/* ==========================================================
   COMPLETE / UPDATE / DELETE TASKS
   ========================================================== */

function toggleTask(id) {
  const task = taskListDS.find(id);

  if (!task) return;

  rememberState();

  taskListDS.update(id, {
    completed: !task.completed
  });

  syncTasks();
  render();

  showToast(
    task.completed
      ? "Task completed! 🎉"
      : "Task marked as pending."
  );
}

function editTask(id) {
  const task = taskListDS.find(id);

  if (!task) return;

  const newTitle = prompt("Edit task name:", task.title);

  if (newTitle === null) return;

  if (!newTitle.trim()) {
    showToast("Task name cannot be empty.");
    return;
  }

  const newDate = prompt(
    "Due date (YYYY-MM-DD). Leave blank for none:",
    task.date || ""
  );

  if (newDate === null) return;

  const dateValue = newDate.trim();

  if (dateValue) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      showToast("Use the date format YYYY-MM-DD.");
      return;
    }

    const parsedDate = new Date(`${dateValue}T12:00:00`);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      localDateString(parsedDate) !== dateValue
    ) {
      showToast("Please enter a valid calendar date.");
      return;
    }
  }

  const newPriority = prompt(
    "Priority: High, Medium, or Low",
    task.priority
  );

  if (newPriority === null) return;

  const priorities = {
    high: "High",
    medium: "Medium",
    low: "Low"
  };

  const normalizedPriority = priorities[newPriority.trim().toLowerCase()];

  if (!normalizedPriority) {
    showToast("Priority must be High, Medium, or Low.");
    return;
  }

  rememberState();

  // Actual Linked List update.
  taskListDS.update(id, {
    title: newTitle.trim(),
    date: dateValue,
    priority: normalizedPriority
  });

  syncTasks();
  render();

  showToast("Task updated successfully!");
}

function deleteTask(id) {
  const task = taskListDS.find(id);

  if (!task) return;

  if (!confirm(`Delete "${task.title}"?`)) return;

  rememberState();

  // Actual Linked List deletion.
  taskListDS.delete(id);

  syncTasks();
  render();

  showToast("Task removed from the Linked List.");
}

/* ==========================================================
   QUEUE: PROCESS NEXT PENDING TASK
   ========================================================== */

function processNextTask() {
  const queue = new Queue();

  // Tasks enter the queue in their original arrival order.
  taskListDS.toArray()
    .filter(task => !task.completed)
    .sort((a, b) => a.createdAt - b.createdAt)
    .forEach(task => queue.enqueue(task.id));

  if (queue.isEmpty()) {
    showToast("There are no pending tasks to process.");
    return;
  }

  // FIFO: remove the earliest-arriving pending task.
  const nextId = queue.dequeue();
  const task = taskListDS.find(nextId);

  if (!task) return;

  rememberState();

  taskListDS.update(nextId, {
    completed: true
  });

  syncTasks();
  render();

  showToast(`Queue processed: "${task.title}" ✓`);
}

/* ==========================================================
   CLEAR COMPLETED TASKS
   ========================================================== */

function clearCompletedTasks() {
  const completed = taskListDS
    .toArray()
    .filter(task => task.completed);

  if (completed.length === 0) {
    showToast("There are no completed tasks to clear.");
    return;
  }

  if (!confirm(`Delete all ${completed.length} completed task(s)?`)) {
    return;
  }

  rememberState();

  completed.forEach(task => {
    taskListDS.delete(task.id);
  });

  syncTasks();
  render();

  showToast("Completed tasks cleared.");
}

/* ==========================================================
   NAVIGATION AND FILTERS
   ========================================================== */

function setView(view) {
  currentView = view;

  currentFilter = view === "completed" ? "completed" : "all";

  if (view === "settings") {
    currentView = "home";
    showToast("Use the theme toggle to change appearance.");
  }

  updateNavigation();
  render();
}

function setFilter(filter) {
  currentFilter = filter;

  if (currentView === "completed" && filter !== "completed") {
    currentView = "home";
    updateNavigation();
  }

  render();
}

/* ==========================================================
   SEARCH BAR
   ========================================================== */

function searchTasks() {
  searchQuery = $("#taskSearch").value;
  render();
}

/* ==========================================================
   THEME AND GREETING
   ========================================================== */

function updateGreeting() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
        ? "Good Afternoon"
        : "Good Evening";

  $("#greeting").textContent = `${greeting}! 👋`;
}

function loadTheme() {
  try {
    if (localStorage.getItem(THEME_KEY) === "dark") {
      document.body.classList.add("dark");
    }
  } catch (error) {
    console.warn("Could not load theme:", error);
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");

  try {
    localStorage.setItem(
      THEME_KEY,
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  } catch (error) {
    console.warn("Could not save theme:", error);
  }
}

/* ==========================================================
   ADD DSA CONTROLS TO THE EXISTING INTERFACE
   No index.html changes required.
   ========================================================== */

function addDSControls() {
  const toolbar = $(".task-toolbar");

  if (toolbar) {
    const controls = document.createElement("div");

    controls.className = "ds-controls";
    controls.style.cssText = [
      "display:flex",
      "align-items:center",
      "gap:8px",
      "flex-wrap:wrap",
      "width:100%",
      "margin-top:4px"
    ].join(";");

    controls.innerHTML = `
      <input
        id="taskSearch"
        type="search"
        placeholder="Search tasks by name or ID..."
        aria-label="Search tasks"
        style="
          flex:1;
          min-width:170px;
          padding:10px 13px;
          border:1px solid var(--border);
          border-radius:12px;
          background:var(--card);
          color:var(--text);
        "
      />

      <button id="undoButton" type="button"
        style="
          border:0;
          padding:10px 14px;
          border-radius:12px;
          background:var(--purple-soft);
          color:var(--purple-dark);
          font-weight:800;
        "
      >↶ Undo</button>

      <button id="processButton" type="button"
        style="
          border:0;
          padding:10px 14px;
          border-radius:12px;
          background:var(--purple);
          color:white;
          font-weight:800;
        "
      >Process Next →</button>
    `;

    toolbar.appendChild(controls);
  }

  const footer = $(".list-footer");

  if (footer) {
    const info = document.createElement("div");

    info.id = "dsInfo";
    info.style.cssText = [
      "width:100%",
      "font-size:11px",
      "color:var(--muted)",
      "padding-top:4px"
    ].join(";");

    footer.appendChild(info);
  }

  $("#taskSearch")?.addEventListener("input", searchTasks);
  $("#undoButton")?.addEventListener("click", undoLastOperation);
  $("#processButton")?.addEventListener("click", processNextTask);
}

/* ==========================================================
   EVENT LISTENERS
   ========================================================== */

taskForm.addEventListener("submit", addTask);

taskList.addEventListener("change", event => {
  if (!event.target.matches('[data-action="toggle"]')) return;

  const card = event.target.closest("[data-task-id]");

  if (card) toggleTask(card.dataset.taskId);
});

taskList.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");

  if (!button) return;

  const card = button.closest("[data-task-id]");

  if (!card) return;

  const id = card.dataset.taskId;

  if (button.dataset.action === "edit") editTask(id);
  if (button.dataset.action === "delete") deleteTask(id);
});

$$(".filter-tab").forEach(button => {
  button.addEventListener("click", () => {
    setFilter(button.dataset.filter);
  });
});

$$(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    setView(button.dataset.view);
  });
});

sortSelect.addEventListener("change", render);

$("#themeToggle").addEventListener("click", toggleTheme);

$("#profileButton").addEventListener("click", () => {
  showToast("Welcome to your productivity dashboard! 💜");
});

$("#clearCompleted").addEventListener("click", clearCompletedTasks);

/* ==========================================================
   START APPLICATION
   ========================================================== */

addDSControls();
loadTheme();
updateGreeting();
taskDate.value = localDateString();
updateNavigation();
render();

console.log("======================================");
console.log("TODO LIST - DSA MINI PROJECT");
console.log("======================================");
console.log("Linked List initialized:", taskListDS.length, "tasks");
console.log("Stack initialized:", undoStack.size(), "saved states");
console.log("Queue class: Ready");
console.log("Priority Queue (Max-Heap): Ready");
console.log("Search operation: Ready");
console.log("======================================");
