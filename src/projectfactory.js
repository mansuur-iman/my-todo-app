import storage from "./storage.js"; // ✅ Import storage

export default function createProject(name) {
  const todos = [];

  function addTodo(todo) {
    todos.push(todo);
    storage.saveData(); // ✅ Save after adding a todo
  }

  function removeTodo(id) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      storage.saveData(); // ✅ Save after removing a todo
    }
  }

  function getTodo() {
    return todos;
  }

  return { name, addTodo, removeTodo, getTodo };
};

  
