import projectManager from "./projectmanager.js";
import createTodo from "./todofactory.js";

const STORAGE_KEY = "todoAppData";

function saveData() {
  const data = {
    projects: projectManager.getAllProjects().map(p => ({
      name: p.name,
      todos: p.getTodo().map(todo => ({
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
        completed: todo.completed, // ✅ save completed state
        id: todo.id,
        note: todo.note
      }))
    })),
    currentProject: projectManager.getCurrentProject()?.name || null
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (!stored || !stored.projects || stored.projects.length === 0) {
    // Create default project
    projectManager.createProjects("Default Project");
    projectManager.setCurrentProject("Default Project");
  
    // Array of default todos
    const defaultTodos = [
      createTodo(
        "Sample Task 1",
        "This is the first default todo",
        "2025-08-05",
        "Medium",
        false,
        Date.now(),
        "Some notes for task 1"
      ),
      createTodo(
        "Sample Task 2",
        "This is the second default todo",
        "2025-10-10",
        "High",
        false,
        Date.now() + 1,
        "Some notes for task 2"
      ),
      createTodo(
        "Sample Task 3",
        "This is the third default todo",
        "2025-08-15",
        "Low",
        false,
        Date.now() + 2,
        "Some notes for task 3"
      ),
      createTodo(
        "Sample Task 4",
        "This is the fourth default todo",
        "2025-05-15",
        "High",
        false,
        Date.now() + 2,
        "Some notes for task 4"
      )
    ];
  
    // Add them to the default project
    defaultTodos.forEach(todo => projectManager.getCurrentProject().addTodo(todo));
  
    saveData();
    return;
  }
  

  // Load projects and todos
  stored.projects.forEach(projectData => {
    projectManager.createProjects(projectData.name);
    const project = projectManager.getAllProjects().find(p => p.name === projectData.name);

    projectData.todos.forEach(todoData => {
      const todo = createTodo(
        todoData.title,
        todoData.description,
        todoData.dueDate,
        todoData.priority,
        todoData.completed, // ✅ restore completed state
        todoData.id,
        todoData.note
      );
      project.addTodo(todo);
    });
  });

  // Restore current project
  if (stored.currentProject) {
    projectManager.setCurrentProject(stored.currentProject);
  } else {
    const first = projectManager.getAllProjects()[0];
    if (first) {
      projectManager.setCurrentProject(first.name);
    }
  }
}

export default { saveData, loadData };
