import projectManager from "./projectmanager.js";
import { showTodoForm } from "./event.js";
import storage from "./storage.js";
import {  isToday, 
  isTomorrow, 
  formatDistanceToNow, 
  format, 
  differenceInDays } from "date-fns";

function renderProjectList() {
  const projectList = document.getElementById("project-list");
  projectList.innerHTML = "";

  projectManager.getAllProjects().forEach(project => {
    const btn = document.createElement("button");
    btn.classList.add("projects");
    btn.textContent = project.name;

    const svgContainer = document.createElement("div");
    svgContainer.classList.add("svg-container");
    svgContainer.innerHTML = `
      <svg class="delete-project" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>trash-can-outline</title>
        <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17
                 A2,2 0 0,0 19,19V6H20V4H15V3H9
                 M7,6H17V19H7V6
                 M9,8V17H11V8H9
                 M13,8V17H15V8H13Z" />
      </svg>
    `;

    const deleteProject = svgContainer.querySelector(".delete-project");
    deleteProject.addEventListener("click", (e) => {
      e.stopPropagation();
      projectManager.deleteProject(project.name);
      storage.saveData();
      renderProjectList();
      renderTodos();
    });

    btn.appendChild(svgContainer);
    btn.addEventListener("click", () => {
      projectManager.setCurrentProject(project.name);
      localStorage.setItem("currentProjectName", project.name); // ✅ remember selection
      renderTodos();
    });

    projectList.appendChild(btn);
  });

  const current1 = projectManager.getCurrentProject();
  document.getElementById("project-title").textContent = current1 ? current1.name : "No Project Selected";
}

function renderTodos() {

  const current1 = projectManager.getCurrentProject();
  document.getElementById("project-title").textContent = current1 ? current1.name : "No Project Selected";

  const current = projectManager.getCurrentProject();
  const container = document.getElementById("todo-list");
  container.innerHTML = "";

  if (!current) {
    container.textContent = "No Project Selected";
    return;
  }

  current.getTodo().forEach(todo => {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    if (todo.completed) todoDiv.classList.add("completed");

    // LEFT SIDE
    const leftDiv = document.createElement("div");
    leftDiv.classList.add("todo-left");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox")
    checkbox.checked = todo.completed;

    const textWrapper = document.createElement("div");
    textWrapper.classList.add("todo-texts");

    const title = document.createElement("h3");
    title.textContent = todo.title;

    const desc = document.createElement("p");
    desc.textContent = todo.description;

    const due = document.createElement("p");
    const dueDateObj = new Date(todo.dueDate);
    const daysDiff = Math.abs(differenceInDays(dueDateObj, new Date()));
    let friendlyDate;
    if(daysDiff<= 30){
      if(isToday(dueDateObj)){
        friendlyDate = "Today";
       }else if(isTomorrow(dueDateObj)){
        friendlyDate = "Tommorrow";
       }else{
        friendlyDate = formatDistanceToNow(dueDateObj, {addSuffix: true});
       }
    }else{
      friendlyDate = format(dueDateObj, "MMM dd, yyyy");
    }
  
    due.innerHTML = `<strong>Due:</strong> ${friendlyDate}`;
    

    textWrapper.appendChild(title);
    textWrapper.appendChild(desc);
    textWrapper.appendChild(due);

    // Checkbox toggle
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      storage.saveData();
      todoDiv.classList.toggle("completed", todo.completed);
    });

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(textWrapper);

    // RIGHT SIDE (ACTIONS)
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("todo-actions");

    const editBtn = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    editBtn.setAttribute("class", "edit-svg");
    editBtn.setAttribute("viewBox", "0 0 24 24");
    editBtn.innerHTML = `
      <path d="M10 21H5C3.89 21 3 20.11 3 19
               V5C3 3.89 3.89 3 5 3H19
               C20.11 3 21 3.89 21 5V10.33
               M7 9H17V7H7V9
               M7 17H12.11L14 15.12V15H7V17
               M7 13H16.12L17 12.12V11H7V13Z" />`;
    editBtn.addEventListener("click", () => {
      showTodoForm(todo);
    });

    const deleteBtn = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    deleteBtn.setAttribute("class", "delete");
    deleteBtn.setAttribute("viewBox", "0 0 24 24");
    deleteBtn.innerHTML = `
      <path d="M9,3V4H4V6H5V19
               A2,2 0 0,0 7,21H17
               A2,2 0 0,0 19,19V6H20V4
               H15V3H9M7,6H17V19H7V6
               M9,8V17H11V8H9
               M13,8V17H15V8H13Z" />`;
    deleteBtn.addEventListener("click", () => {
      current.removeTodo(todo.id);
      storage.saveData();
      renderTodos();
    });

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    // ASSEMBLE
    todoDiv.appendChild(leftDiv);
    todoDiv.appendChild(actionsDiv);
    container.appendChild(todoDiv);
  });
}

export default { renderProjectList, renderTodos };

