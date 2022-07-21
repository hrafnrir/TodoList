'use strict';

function Store() {
    this.todoItems = [];
};

Store.prototype.initTodoItems = function(callback) {
    if (localStorage.getItem('todoItems')) {
        this.todoItems = JSON.parse(localStorage.getItem('todoItems'));
        let completedTodoItems = [];

        if (this.todoItems.find(item => item.isCompleted == true)) {
            completedTodoItems = this.todoItems.filter(item => item.isCompleted == true);
        };
        callback(this.todoItems, completedTodoItems);
    };
};

Store.prototype.saveTodoItems = function(parameter, element) {
    if (parameter === 'addTodoItem') {
        this.todoItems.push(element);
    };

    if (parameter === 'deleteTodoItem') {
        const i = this.todoItems.findIndex(item => item.id == element);
        this.todoItems.splice(i, 1);
    };

    if (parameter === 'deleteCompletedItems') {
        for (let one of element) {
            const i = this.todoItems.findIndex(item => item == one);
            this.todoItems.splice(i, 1);
        };
    };

    localStorage.setItem('todoItems', JSON.stringify(this.todoItems));
};