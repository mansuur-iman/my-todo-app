import projectManager from "./projectmanager.js";
import createTodo from "./todofactory.js";
import dom from "./dom.js";
import storage from "./storage.js";

function showTodoForm(todo = null) {
  if (document.getElementById("todo-form-container")) return;

  const wrapper = document.createElement("div");
  wrapper.id = "todo-form-container";
  wrapper.classList.add("form-wrapper");

  const form = document.createElement("form");
  form.id = "todo-form";
  form.classList.add("todo-form");
  form.innerHTML = `
    <h3>${todo ? "Edit Todo" : "New Todo"}</h3>
    <input type="text" id="todo-title" placeholder="Title" value="${todo ? todo.title : ''}" required />
    <input type="text" id="todo-description" placeholder="Description" value="${todo ? todo.description : ''}" />
    <input type="text" id="todo-notes" placeholder="Notes" value="${todo ? todo.notes : ''}" />
    <input type="date" id="todo-date" value="${todo ? todo.dueDate : ''}" required />
    <select id="todo-priority">
      <option value="low" ${todo?.priority === "low" ? "selected" : ""}>Low</option>
      <option value="medium" ${!todo || todo.priority === "medium" ? "selected" : ""}>Medium</option>
      <option value="high" ${todo?.priority === "high" ? "selected" : ""}>High</option>
    </select>
    <div class="form-buttons">
      <button type="submit" class="save">${todo ? "Update" : "Save"}</button>
      <button type="button" id="cancel-todo-btn">Cancel</button>
    </div>
  `;

  wrapper.appendChild(form);
  document.getElementById("todo-list").prepend(wrapper);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const current = projectManager.getCurrentProject();
    if (!current) return;

    const title = document.getElementById("todo-title").value;
    const description = document.getElementById("todo-description").value;
    const notes = document.getElementById("todo-notes").value;
    const dueDate = document.getElementById("todo-date").value;
    const priority = document.getElementById("todo-priority").value;

    if (todo) {
      todo.title = title;
      todo.description = description;
      todo.notes = notes;
      todo.dueDate = dueDate;
      todo.priority = priority;
      storage.saveData();
    } else {
      const newTodo = createTodo(title, description, dueDate, priority, false, Date.now(), notes);
      current.addTodo(newTodo);
      storage.saveData();
    }

    dom.renderTodos();
    wrapper.remove();
  });

  form.querySelector("#cancel-todo-btn").addEventListener("click", () => {
    wrapper.remove();
  });
}

function eventHandler() {
  const addProjectBtn = document.getElementById("add-project-btn");
  const addTodoBtn = document.getElementById("add-todo-btn");
  const projectList = document.getElementById("project-list");
  const todoList = document.getElementById("todo-list");

  addProjectBtn.addEventListener("click", () => {
    if (document.getElementById("project-form")) return;

    const form = document.createElement("form");
    form.id = "project-form";
    form.innerHTML = `
      <input type="text" id="new-project-name" placeholder="Project Name" required />
      <div class="project-btns">
      <button type="submit" class="save-btn">Save</button>
      <button type="button" id="cancel-project-btn">Cancel</button>
      </div>
    `;
    projectList.appendChild(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("new-project-name").value.trim();
      if (name) {
        projectManager.createProjects(name);
        storage.saveData(); // save new project
        projectManager.setCurrentProject(name);
        dom.renderProjectList();
        dom.renderTodos();
        form.remove();
      }
    });

    form.querySelector("#cancel-project-btn").addEventListener("click", () => {
      form.remove();
    });
  });

  addTodoBtn.addEventListener("click", () => {
    showTodoForm();
  });

}

export default eventHandler;
export { showTodoForm };





  
