import createProject from "./projectfactory.js";
import storage from "./storage.js"; // ✅ Import storage

function projectController() {
  const projects = [];
  let currentProject = null;

  function createProjects(name) {
    let project = createProject(name);
    projects.push(project);

    if (currentProject === null) {
      currentProject = project;
    }

    storage.saveData(); // ✅ Save after creating a project
  }

  function deleteProject(name) {
    const index = projects.findIndex((project) => project.name === name);
    if (index !== -1) {
      projects.splice(index, 1);
      if (currentProject && currentProject.name === name) {
        currentProject = projects.length > 0 ? projects[0] : null;
      }
      storage.saveData(); // ✅ Save after deleting a project
    }
  }

  function setCurrentProject(name) {
    let setCurrent = projects.find((project) => project.name === name);
    if (setCurrent !== currentProject) {
      currentProject = setCurrent;
      storage.saveData(); // ✅ Save when switching projects
    }
  }

  function getCurrentProject() {
    return currentProject;
  }

  function getAllProjects() {
    return projects;
  }

  return {
    createProjects,
    deleteProject,
    setCurrentProject,
    getCurrentProject,
    getAllProjects,
  };
}

const controller = projectController();
export default controller;


