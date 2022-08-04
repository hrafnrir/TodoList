'use strict';

class TodoList {
    storage = new Store();
    model = new Model(this.storage);
    template = new Template();
    view = new View(this.template);
    controller = new Controller(this.model, this.view);
};

const todoList = new TodoList();

function setView() {
    todoList.controller.setView();
    todoList.controller.addListeners();
    todoList.controller.addFilters();
};

window.addEventListener('load', setView);