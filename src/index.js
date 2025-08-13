import "./style.css";
import dom from "./dom.js";
import eventHandler from "./event.js";
import storage from "./storage.js";
import projectManager from "./projectmanager.js";
import createTodo from "./todofactory.js";

storage.loadData();

dom.renderProjectList();
dom.renderTodos();

eventHandler();


