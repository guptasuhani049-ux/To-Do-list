
/* ==========================================================
   DSA VISUALIZER DASHBOARD
   Works with the existing script.js data structures.
   ========================================================== */

(() => {
  const style = document.createElement("style");

  style.textContent = `
    #dsaVisualizer {
      --viz-bg: var(--card, #ffffff);
      --viz-text: var(--text, #24213a);
      --viz-muted: var(--muted, #85839a);
      --viz-border: var(--border, #e7e4f1);
      margin: 28px 0;
      padding: 22px;
      color: var(--viz-text);
      background: var(--viz-bg);
      border: 1px solid var(--viz-border);
      border-radius: 22px;
      font-family: inherit;
    }

    #dsaVisualizer * {
      box-sizing: border-box;
    }

    #dsaVisualizer .viz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    #dsaVisualizer .viz-heading {
      margin: 0;
      font-size: 22px;
      font-weight: 850;
    }

    #dsaVisualizer .viz-subtitle {
      margin: 6px 0 0;
      color: var(--viz-muted);
      font-size: 13px;
      line-height: 1.6;
    }

    #dsaVisualizer .viz-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: #eee9ff;
      color: #6248d9;
      border-radius: 999px;
      padding: 8px 12px;
      font-size: 11px;
      font-weight: 800;
    }

    #dsaVisualizer .viz-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    #dsaVisualizer .viz-card {
      min-width: 0;
      padding: 17px;
      border: 1px solid var(--viz-border);
      border-radius: 17px;
      overflow: hidden;
    }

    #dsaVisualizer .viz-card h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 800;
    }

    #dsaVisualizer .viz-description {
      margin: 5px 0 16px;
      font-size: 12px;
      color: var(--viz-muted);
      line-height: 1.5;
    }

    #dsaVisualizer .viz-canvas {
      min-height: 115px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 9px;
      padding: 12px 0;
    }

    #dsaVisualizer .viz-node {
      position: relative;
      min-width: 75px;
      max-width: 150px;
      padding: 12px 10px;
      border-radius: 12px;
      border: 1px solid #dcd4ff;
      background: #f3f0ff;
      color: #5036bd;
      text-align: center;
      font-size: 12px;
      font-weight: 750;
      overflow-wrap: anywhere;
    }

    #dsaVisualizer .viz-node small {
      display: block;
      margin-top: 6px;
      color: #7665bb;
      font-size: 10px;
      font-weight: 600;
    }

    #dsaVisualizer .viz-arrow {
      color: #8b78e6;
      font-size: 21px;
      font-weight: 900;
    }

    #dsaVisualizer .viz-label {
      display: block;
      margin-bottom: 6px;
      color: var(--viz-muted);
      font-size: 10px;
      font-weight: 850;
      letter-spacing: .7px;
    }

    #dsaVisualizer .viz-stack {
      min-height: 135px;
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      justify-content: flex-start;
      gap: 6px;
      padding: 12px 0;
    }

    #dsaVisualizer .viz-stack-item {
      width: min(100%, 250px);
      padding: 9px 12px;
      border-radius: 9px;
      border: 1px solid #bce9d4;
      background: #e7f8ef;
      color: #176f4b;
      font-size: 11px;
      font-weight: 700;
      text-align: center;
      overflow-wrap: anywhere;
    }

    #dsaVisualizer .viz-empty {
      color: var(--viz-muted);
      font-size: 12px;
      text-align: center;
      padding: 18px 8px;
    }

    #dsaVisualizer .viz-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    #dsaVisualizer .viz-stat {
      padding: 7px 10px;
      border-radius: 9px;
      background: var(--viz-border);
      color: var(--viz-text);
      font-size: 11px;
      font-weight: 750;
    }

    #dsaVisualizer .viz-heap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      min-height: 135px;
    }

    #dsaVisualizer .viz-heap-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 9px;
      width: 100%;
    }

    #dsaVisualizer .viz-heap-node {
      width: 90px;
      min-height: 55px;
      padding: 8px 5px;
      border: 2px solid #f0d18c;
      border-radius: 13px;
      background: #fff5d9;
      color: #8c5a09;
      text-align: center;
      font-size: 11px;
      font-weight: 850;
      overflow-wrap: anywhere;
    }

    #dsaVisualizer .viz-heap-node small {
      display: block;
      margin-top: 4px;
      font-size: 10px;
      font-weight: 650;
    }

    #dsaVisualizer .viz-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    #dsaVisualizer .viz-button {
      padding: 9px 12px;
      border: 1px solid var(--viz-border);
      border-radius: 10px;
      background: var(--viz-bg);
      color: var(--viz-text);
      font: inherit;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
    }

    #dsaVisualizer .viz-button:hover {
      border-color: #a99af0;
    }

    #dsaVisualizer .viz-note {
      margin-top: 17px;
      padding: 12px 14px;
      border-radius: 12px;
      background: #f0edff;
      color: #5942bb;
      font-size: 12px;
      line-height: 1.7;
    }

    @media (max-width: 650px) {
      #dsaVisualizer {
        padding: 14px;
      }

      #dsaVisualizer .viz-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      #dsaVisualizer .viz-node {
        min-width: 58px;
        max-width: 105px;
        font-size: 10px;
      }

      #dsaVisualizer .viz-arrow {
        font-size: 15px;
      }
    }

    body.dark #dsaVisualizer {
      --viz-bg: #211f31;
      --viz-text: #f4f1ff;
      --viz-muted: #aaa5c0;
      --viz-border: #39354d;
    }

    body.dark #dsaVisualizer .viz-node {
      background: #30294c;
      border-color: #554786;
      color: #d9ceff;
    }

    body.dark #dsaVisualizer .viz-node small {
      color: #b9a9f5;
    }

    body.dark #dsaVisualizer .viz-stack-item {
      background: #1d3b32;
      border-color: #326d58;
      color: #a9f1d0;
    }

    body.dark #dsaVisualizer .viz-heap-node {
      background: #46391f;
      border-color: #79602d;
      color: #ffdf9c;
    }

    body.dark #dsaVisualizer .viz-note {
      background: #30294c;
      color: #d9ceff;
    }
  `;

  document.head.appendChild(style);

  const panel = document.createElement("section");

  panel.id = "dsaVisualizer";
  panel.innerHTML = `
    <div class="viz-header">
      <div>
        <h2 class="viz-heading">DSA Lab 🧠</h2>
        <p class="viz-subtitle">
          Explore how your tasks are stored and processed internally.
        </p>
      </div>

      <span class="viz-badge">● LIVE VISUALIZATION</span>
    </div>

    <div class="viz-grid">

      <article class="viz-card">
        <h3>🔗 Singly Linked List</h3>
        <p class="viz-description">
          Each node stores a task and points to the next node.
        </p>

        <div id="vizLinkedList" class="viz-canvas"></div>

        <div class="viz-stats">
          <span id="vizNodeCount" class="viz-stat">Nodes: 0</span>
          <span id="vizHead" class="viz-stat">HEAD: NULL</span>
          <span id="vizTail" class="viz-stat">TAIL: NULL</span>
        </div>
      </article>

      <article class="viz-card">
        <h3>📚 Undo Stack</h3>
        <p class="viz-description">
          LIFO: the most recently saved state is on top.
        </p>

        <div id="vizStack" class="viz-stack"></div>

        <div class="viz-stats">
          <span id="vizStackCount" class="viz-stat">States: 0</span>
          <span class="viz-stat">LIFO</span>
        </div>
      </article>

      <article class="viz-card">
        <h3>🚶 Task Processing Queue</h3>
        <p class="viz-description">
          FIFO: the earliest-created pending task is processed first.
        </p>

        <div id="vizQueue" class="viz-canvas"></div>

        <div class="viz-stats">
          <span id="vizQueueCount" class="viz-stat">Pending: 0</span>
          <span class="viz-stat">FIFO</span>
        </div>

        <div class="viz-actions">
          <button class="viz-button" id="vizProcess">
            Process Next →
          </button>
        </div>
      </article>

      <article class="viz-card">
        <h3>🏆 Priority Queue · Max-Heap</h3>
        <p class="viz-description">
          The heap root contains the highest-priority pending task.
        </p>

        <div id="vizHeap" class="viz-heap"></div>

        <div class="viz-stats">
          <span id="vizHeapCount" class="viz-stat">Heap size: 0</span>
          <span class="viz-stat">High → Medium → Low</span>
        </div>
      </article>

    </div>

    <div class="viz-note" id="vizExplanation" aria-live="polite">
      Your data structure visualizations will update as you use the task list.
    </div>

    <div class="viz-actions">
      <button class="viz-button" id="vizRefresh">
        ↻ Refresh Visualization
      </button>
      <button class="viz-button" id="vizResetMessage">
        Show DSA Explanation
      </button>
    </div>
  `;

  // Place the visualizer after the existing task area.
  const footer = document.querySelector(".list-footer");
  const toolbar = document.querySelector(".task-toolbar");
  const taskSection = document.querySelector("#taskList");

  if (footer && footer.parentElement) {
    footer.parentElement.insertAdjacentElement("afterend", panel);
  } else if (toolbar && toolbar.parentElement) {
    toolbar.parentElement.appendChild(panel);
  } else if (taskSection && taskSection.parentElement) {
    taskSection.parentElement.appendChild(panel);
  } else {
    document.body.appendChild(panel);
  }

  const explanation = $("#vizExplanation");

  function $(selector) {
    return panel.querySelector(selector);
  }

  function safeText(value, maxLength = 24) {
    const text = String(value ?? "");
    return text.length > maxLength
      ? text.slice(0, maxLength - 1) + "…"
      : text;
  }

  function makeEmpty(message) {
    return `<div class="viz-empty">${message}</div>`;
  }

  function drawLinkedList() {
    const container = $("#vizLinkedList");

    // Read the actual linked-list nodes.
    let current = taskListDS.head;
    let html = "";
    let count = 0;

    if (!current) {
      container.innerHTML = makeEmpty("HEAD → NULL");
    } else {
      while (current !== null && count < 12) {
        const task = current.task;

        if (count === 0) {
          html += `
            <span class="viz-label" style="width:100%;text-align:center">
              HEAD ↓
            </span>
          `;
        }

        html += `
          <div class="viz-node">
            ${escapeHTML(safeText(task.title, 22))}
            <small>${task.completed ? "✓ Done" : "○ Pending"}</small>
          </div>
        `;

        current = current.next;
        count++;

        if (current !== null) {
          html += `<span class="viz-arrow" aria-hidden="true">→</span>`;
        }
      }

      if (current !== null) {
        html += `<span class="viz-node">… more</span>`;
      }

      html += `<span class="viz-arrow">→ NULL</span>`;

      container.innerHTML = html;
    }

    $("#vizNodeCount").textContent = `Nodes: ${taskListDS.length}`;

    $("#vizHead").textContent = taskListDS.head
      ? `HEAD: ${safeText(taskListDS.head.task.title, 13)}`
      : "HEAD: NULL";

    $("#vizTail").textContent = taskListDS.tail
      ? `TAIL: ${safeText(taskListDS.tail.task.title, 13)}`
      : "TAIL: NULL";
  }

  function drawStack() {
    const stack = $("#vizStack");
    const items = undoStack.items;
    const recentItems = items.slice(-5);

    if (recentItems.length === 0) {
      stack.innerHTML = makeEmpty("Stack is empty");
    } else {
      stack.innerHTML = recentItems.map((snapshot, index) => {
        let label = "Saved state";

        try {
          const parsed = JSON.parse(snapshot);
          label = `${parsed.length} task(s) in saved state`;
        } catch {
          // Keep the default label if a snapshot is invalid.
        }

        const isTop = index === recentItems.length - 1;

        return `
          <div class="viz-stack-item">
            ${isTop ? "⬆ TOP · " : ""}${escapeHTML(label)}
          </div>
        `;
      }).join("");
    }

    $("#vizStackCount").textContent = `States: ${undoStack.size()}`;
  }

  function getPendingByArrival() {
    return taskListDS.toArray()
      .filter(task => !task.completed)
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  function drawQueue() {
    const queueContainer = $("#vizQueue");
    const pending = getPendingByArrival();
    const queue = new Queue();

    pending.forEach(task => queue.enqueue(task));

    const queuedTasks = queue.toArray();

    if (queuedTasks.length === 0) {
      queueContainer.innerHTML = makeEmpty("Queue is empty");
    } else {
      const shown = queuedTasks.slice(0, 5);

      let html = `
        <span class="viz-label">FRONT →</span>
      `;

      shown.forEach((task, index) => {
        html += `
          <div class="viz-node">
            ${escapeHTML(safeText(task.title, 18))}
            <small>${index === 0 ? "NEXT" : "Waiting"}</small>
          </div>
        `;

        if (index < shown.length - 1) {
          html += `<span class="viz-arrow">→</span>`;
        }
      });

      if (queuedTasks.length > shown.length) {
        html += `<span class="viz-node">+${queuedTasks.length - shown.length}</span>`;
      }

      html += `<span class="viz-label">← REAR</span>`;

      queueContainer.innerHTML = html;
    }

    $("#vizQueueCount").textContent = `Pending: ${queue.size()}`;
  }

  function drawHeap() {
    const container = $("#vizHeap");
    const heap = new PriorityQueue();

    taskListDS.toArray()
      .filter(task => !task.completed)
      .forEach(task => heap.enqueue(task));

    // Show the actual internal heap array, not a separately sorted list.
    const nodes = heap.heap;

    if (nodes.length === 0) {
      container.innerHTML = makeEmpty("No pending tasks in heap");
    } else {
      let html = "";
      let index = 0;
      let level = 0;

      while (index < nodes.length) {
        const countAtLevel = 2 ** level;
        const levelNodes = nodes.slice(index, index + countAtLevel);

        html += `<div class="viz-heap-row">`;

        levelNodes.forEach((task, localIndex) => {
          const actualIndex = index + localIndex;
          const label = actualIndex === 0 ? "ROOT" : `Node ${actualIndex}`;

          html += `
            <div class="viz-heap-node">
              ${escapeHTML(safeText(task.title, 17))}
              <small>${escapeHTML(task.priority)} · ${label}</small>
            </div>
          `;
        });

        html += `</div>`;

        index += countAtLevel;
        level++;
      }

      container.innerHTML = html;
    }

    $("#vizHeapCount").textContent = `Heap size: ${heap.size()}`;
  }

  function renderVisualizer() {
    drawLinkedList();
    drawStack();
    drawQueue();
    drawHeap();
  }

  // Wrap the existing render function so the visualizer updates
  // after task additions, edits, deletions, completions and undo.
  const originalRender = render;

  render = function (...args) {
    const result = originalRender.apply(this, args);
    renderVisualizer();
    return result;
  };

  $("#vizRefresh").addEventListener("click", () => {
    renderVisualizer();
    explanation.textContent =
      "Visualization refreshed from the current Linked List, Stack, Queue and Priority Queue.";
  });

  $("#vizProcess").addEventListener("click", () => {
    if (typeof processNextTask === "function") {
      processNextTask();
      explanation.textContent =
        "Queue uses FIFO: the earliest-created pending task is completed first.";
    }
  });

  $("#vizResetMessage").addEventListener("click", () => {
    explanation.textContent =
      "Linked List: sequential task nodes. Stack: LIFO undo history. " +
      "Queue: FIFO task processing. Priority Queue: a binary max-heap " +
      "that places the highest-priority pending task at its root.";
  });

  // The main script has already performed its initial render.
  renderVisualizer();
})();
