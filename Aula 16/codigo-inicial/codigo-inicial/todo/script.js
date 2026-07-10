const taskInput = document.querySelector("#task-input");
const addTaskBtn = document.querySelector("#add-task");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const clearCompletedBtn = document.querySelector("#clear-completed");
const filters = document.querySelectorAll(".filters button");
const template = document.getElementById("task-template");

let filter = "all";

const tasks = [
  {
    id: 1,
    title: "Tarefa 1",
    completed: false,
  },
  {
    id: 2,
    title: "Tarefa 2",
    completed: true,
  },
  {
    id: 3,
    title: "Tarefa 3",
    completed: false,
  },
];

/* 
<li>
  <input type="checkbox">
  <span></span>
  <div class="actions-group">
    <button class="edit">✏️</button>
    <button class="remove">🗑️</button>
  </div>
</li>
*/

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter ((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    const emptyMsg = document.createElement("li");
    emptyMsg.classList.add("empty-message");

    if (filter === "all") {
      emptyMsg.textContent = "Nenhuma tarefa foi adicionada";
    }else if (filter === "pending") {
      emptyMsg.textContent = "Nenhuma tarefa pendente.";
    }else if (filter === "completed") {
      emptyMsg.textContent = "Nenhuma tarefa completada.";
    }

    taskList.appendChild(emptyMsg);
    
  }

  filteredTasks.forEach((task) => {
    const taskElement = template.content.firstElementChild.cloneNode(true);
    
    const checkbox = taskElement.querySelector("input[type='checkbox']");
    const span = taskElement.querySelector("span");
    const editButton = taskElement.querySelector(".edit");
    const removeButton = taskElement.querySelector(".remove");

    if (task.completed) {
      taskElement.classList.add("completed");
    }

    checkbox.checked = task.completed;
    span.textContent = task.title;

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      taskElement.classList.toggle("completed");
      renderTasks();
    });

    editButton.addEventListener("click", () => {
      span.contentEditable = true;
      span.focus();

      span.addEventListener("blur", () => {
        span.contentEditable = false;
        task.title = span.textContent.trim();
      }, { once: true });
    });

    removeButton.addEventListener("click", () => {
      if (confirm("Deseja realmente excluir esta tarefa ?")) {
        const index = tasks.findIndex((t) => t.id === task.id);

        if (index !== -1) {
          tasks.splice(index, 1);
        }

        renderTasks();
      }
    })



    taskList.appendChild(taskElement);
  });

  updateCount();
}

function updateCount() {
  const pending = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${pending} tarefas pendentes`;
}

addTaskBtn.addEventListener("click", () => {
  const title = taskInput.value.trim();

  if (!title) return;

  const newTask = {
    id: Date.now(),
    title: title,
    completed: false,
  };

  tasks.push(newTask);

  taskInput.value = "";
  taskInput.focus();

  renderTasks();
});

taskInput.addEventListener("keypress", (event) => {
  const key = event.key;
  if (key === "Enter") {
    addTaskBtn.click();
  }
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    removeActive();
    button.classList.add("active");
    filter = button.dataset.filter;
    renderTasks()
    });
});


function removeActive () {
  filters.forEach((button) => {
      button.classList.remove("active");
  });
}

clearCompletedBtn.addEventListener("click", () => {
  const pendings = tasks.filter((task) => !task.completed);
  tasks.splice(0, tasks.length, ...pendings);
  renderTasks();
})

renderTasks();