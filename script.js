// Nama Local Storage
let todoItems = [];

const form = document.querySelector(".js-form");
const list = document.querySelector(".js-todo-list");
const search = document.querySelector("#search-todos");
const filter = document.querySelector("#filter-todos");
const searchButton = document.querySelector(".search-button");

immediateLoadEventListener();

// Kumpulan Function
function immediateLoadEventListener() {
  search.addEventListener("keyup", searchTodo);
  filter.addEventListener("change", filterTodos);
  searchButton.addEventListener("click", toggleSearch);
  form.addEventListener("submit", submitTodo);
  list.addEventListener("click", completeAndDelete);
  document.addEventListener("DOMContentLoaded", getTodo);
}

function toggleSearch() {
  search.classList.toggle("d-none");
  search.focus();
}

function renderTodo(todo) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));

  const list = document.querySelector(".js-todo-list");
  const item = document.querySelector(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    item.remove();
    if (todoItems.length === 0) list.innerHTML = "";
    return;
  }

  const isChecked = todo.checked ? "completed" : "uncompleted";
  const node = document.createElement("li");
  node.setAttribute("class", `todo-item ${isChecked} list-group-item`);

  node.setAttribute("data-key", todo.id);
  node.innerHTML = `
    <input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
    <svg><use href="#delete-icon"></use></svg>
    </button>
  `;

  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}

function searchTodo(e) {
  const searchText = e.target.value.toLowerCase();

  const todo = document.querySelectorAll(".todo-item");

  todo.forEach((item) => {
    const itemText = item.innerText.toLowerCase();

    console.log(itemText);

    if (itemText.indexOf(searchText) !== -1) {
      item.setAttribute("style", "display: flex;");
    } else {
      item.setAttribute("style", "display: none;");
    }
  });
}

function addTodo(text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  todoItems.push(todo);
  renderTodo(todo);
}

function toggleComplete(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
}

function deleteTodo(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  const todo = {
    deleted: true,
    ...todoItems[index],
  };

  console.log(todo);
  todoItems = todoItems.filter((item) => item.id !== Number(key));
  console.log(todoItems);
  renderTodo(todo);
}

function filterTodos(e) {
  const todos = list.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

function submitTodo(e) {
  e.preventDefault();
  const input = document.querySelector(".js-todo-input");

  const text = input.value.trim();
  if (text !== "") {
    addTodo(text);
    input.value = "";
    input.focus();
  }
}

function completeAndDelete(e) {
  if (e.target.classList.contains("js-tick")) {
    const itemKey = e.target.parentElement.dataset.key;
    toggleComplete(itemKey);
  }

  if (e.target.classList.contains("js-delete-todo")) {
    const itemKey = e.target.parentElement.dataset.key;
    console.log(itemKey);
    deleteTodo(itemKey);
  }
}

function getTodo() {
  const todos = localStorage.getItem("todoItems");
  if (todos) {
    todoItems = JSON.parse(todos);
    todoItems.forEach((todo) => {
      renderTodo(todo);
    });
  }
}
