const STORAGE_KEY = "tasks";
const statuses = ["todo", "doing", "done"];

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  statuses.forEach(function (status) {
    const list = document.getElementById(status);
    list.innerHTML = "";

    tasks
      .filter(function (task) { return task.status === status; })
      .forEach(function (task) { list.appendChild(createCard(task)); });
  });
}

function makeButton(text, onClick, disabled) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  return button;
}

function createCard(task) {
  const card = document.createElement("div");
  card.className = "card";
  card.draggable = true;

  const title = document.createElement("p");
  title.textContent = task.title;

  const index = statuses.indexOf(task.status);
  const buttons = document.createElement("div");
  buttons.className = "buttons";
  buttons.appendChild(makeButton("←", function () { moveTask(task.id, -1); }, index === 0));
  buttons.appendChild(makeButton("→", function () { moveTask(task.id, 1); }, index === statuses.length - 1));
  buttons.appendChild(makeButton("Delete", function () { deleteTask(task.id); }, false));

  card.appendChild(title);
  card.appendChild(buttons);

  card.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", String(task.id));
    card.classList.add("dragging");
  });
  card.addEventListener("dragend", function () {
    card.classList.remove("dragging");
  });

  return card;
}


document.getElementById("taskForm").addEventListener("submit", function (event) {
  event.preventDefault();               // page refresh hou deu nako
  const input = document.getElementById("taskInput");
  const title = input.value.trim();
  if (title === "") return;

  tasks.push({ id: Date.now(), title: title, status: "todo" });
  input.value = "";
  saveTasks();
  renderTasks();
});

function setStatus(id, status) {
  tasks.forEach(function (task) {
    if (task.id === id) task.status = status;
  });
  saveTasks();
  renderTasks();
}

function moveTask(id, direction) {
  const task = tasks.find(function (t) { return t.id === id; });
  const newIndex = statuses.indexOf(task.status) + direction;
  if (newIndex >= 0 && newIndex < statuses.length) {
    setStatus(id, statuses[newIndex]);
  }
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) { return task.id !== id; });
  saveTasks();
  renderTasks();
}


document.querySelectorAll(".column").forEach(function (column) {
  column.addEventListener("dragover", function (event) {
    event.preventDefault();             // drop allow karayla he lagta
    column.classList.add("over");
  });

  column.addEventListener("dragleave", function () {
    column.classList.remove("over");
  });

  column.addEventListener("drop", function (event) {
    event.preventDefault();
    column.classList.remove("over");
    const id = Number(event.dataTransfer.getData("text/plain"));
    setStatus(id, column.dataset.status);
  });
});



renderTasks();