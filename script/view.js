'use strict';

function View(template) {
    this.template = template;

    this.$newTodoInput = document.querySelector('input[data-name="new-todo-input"]');
    this.$todoList = document.querySelector('ul[data-name="todo-list"]');
    this.$todoFooter = document.querySelector('footer[data-name="todo-footer"]');
    this.$pageFooter = document.querySelector('footer[data-name="page-footer"]');
    this.$totalNumber = document.querySelector('span[data-name="total-number"]');
    this.$clearBtn = document.querySelector('button[data-name="todo-clear-btn"]');
    this.$todoFilterAll = document.querySelector('li[data-name="filter-all"]');
    this.$todoFilterActive = document.querySelector('li[data-name="filter-active"]');
    this.$todoFilterCompleted = document.querySelector('li[data-name="filter-completed"]');
};


View.prototype.bind = function(event, handler) {

    if (event === 'newTodoItem') {
        this.$newTodoInput.addEventListener('keyup', event => {
            if (event.keyCode === 13) {
                handler(this.$newTodoInput.value);
            };
        });
    };

    if (event === 'editTodoItem') {
        this.$todoList.addEventListener('dblclick', event => {
            const target = event.target;
            if (target.getAttribute('data-name') === 'todo-item-label') {
                const id = target.getAttribute('data-id');
                const input = this.editTodoItem_updateElements('remove', id);

                this.editTodoItem_done(id, input, handler);
            };
        });
    };

    if (event === 'changeTodoItemStatus') {
        this.$todoList.addEventListener('click', event => {
            const target = event.target;
            if (target.getAttribute('data-name') === 'todo-item-checkbox') {
                const id = target.getAttribute('data-id');
                handler(id);
            };
        });
    };

    if (event === 'deleteTodoItem') {
        this.$todoList.addEventListener('click', event => {
            const target = event.target;
            if (target.getAttribute('data-name') === 'todo-item-delete-btn') {
                const id = target.getAttribute('data-id');
                handler(id);
            } else {
                return;
            };
        });
    };

    if (event === 'deleteCompletedItems') {
        this.$clearBtn.addEventListener('click', handler);
    };

    if (event === 'filterAllItems') {
        this.$todoFilterAll.addEventListener('click', event => {
            handler('all');
        });
    };
};


View.prototype.editTodoItem_done = function(id, input, handler) {
    const title = input.value;

    function enterClick(event) {
        if (event.keyCode === 13) {
            handler(id, input.value, title);
            input.removeEventListener('keyup', enterClick);
        };
    }

    input.addEventListener('keyup', enterClick);

    document.addEventListener('click', event => {
        const withinBoundaries = event.composedPath().includes(input);

        if (!withinBoundaries) {
            handler(id, input.value, title);
            input.removeEventListener('keyup', enterClick);
        };
    }, {once: true});
};


View.prototype.editTodoItem_updateElements = function(parameter, id, title) {
    const $todoItem = this.$todoList.querySelector(`li[data-id="${id}"]`);
    const $itemLabel = $todoItem.querySelector('label[data-name="todo-item-label"]');
    const $itemInput = $todoItem.querySelector('input[data-name="todo-item-input"]');
    const $itemCheckbox = $todoItem.querySelector('input[data-name="todo-item-checkbox"]');

    if (parameter === 'add') {
        $itemLabel.classList.remove('hidden-element');
        $itemCheckbox.classList.remove('hidden-element');
        $itemInput.classList.add('hidden-element');

        $itemLabel.textContent = title.trim();
    };

    if (parameter === 'remove') {
        $itemInput.value = $itemLabel.textContent;
        $itemLabel.textContent = '';

        $itemLabel.classList.add('hidden-element');
        $itemCheckbox.classList.add('hidden-element');
        $itemInput.classList.remove('hidden-element');
        $itemInput.focus();

        return $itemInput;
    };
};


View.prototype.createTodoItem = function(item) {
    const id = item.id;
    const title = item.title;
    const todoItem = this.template.addDefaultTodoItemTemplate(id, title);
    this.$todoList.insertAdjacentHTML('afterbegin', todoItem);
};


View.prototype.addInitTodoItems = function(items, completedTodoItems) {
    for (let item of items) {
        this.createTodoItem(item); 

        if (completedTodoItems.includes(item)) {
            const $todoItem = this.$todoList.querySelector(`li[data-id="${item.id}"]`);
            let $todoItemCheckbox = $todoItem.querySelector('input[data-name="todo-item-checkbox"]');
            $todoItemCheckbox.checked = 'true';
        };
    };
};


View.prototype.addTodoItem = function(item) {
    this.createTodoItem(item);
};


View.prototype.deleteTodoItem = function(id) {
    const $todoItem = this.$todoList.querySelector(`li[data-id="${id}"]`);
    this.$todoList.removeChild($todoItem);
};


View.prototype.deleteCompletedItems = function(items) {
    for (let one of items) {
        const $todoItem = this.$todoList.querySelector(`li[data-id="${one.id}"]`);
        this.$todoList.removeChild($todoItem);
    };
};


View.prototype.filterActiveCompletedItems = function(countItems, handler) {
     
    this.$todoFilterActive.addEventListener('click', event => {
        if (countItems('active') > 0) {
            handler('active');
        };
    });

    this.$todoFilterCompleted.addEventListener('click', event => {
        if (countItems('completed') > 0) {
            handler('completed');
        };
    });
};


View.prototype.addFilteredTodoItems = function(filters, items) {
    this.$todoList.querySelectorAll('li').forEach(item => item.classList.remove('hidden-element'));
    this.selectFilter(filters);

    if (items == null || items.length === 0) {
        return;
    } else {
        for (let item of items) {
            let $hiddenTodoItem = this.$todoList.querySelector(`li[data-id="${item}"]`);
            $hiddenTodoItem.classList.add('hidden-element');
        };
    };
    
};


View.prototype.selectFilter = function(filters) {
    this.$todoFilterAll.dataset.filterStatus = filters.all.status;
    this.$todoFilterActive.dataset.filterStatus = filters.active.status;
    this.$todoFilterCompleted.dataset.filterStatus = filters.completed.status;
};


View.prototype.updateTodoFooter = function(parameter) {
    if (parameter === 'remove') {
        this.$todoFooter.classList.remove('hidden-element');
        this.$todoList.classList.remove('hidden-element');
        this.$pageFooter.classList.remove('page-footer_without-items');
    } else {
        this.$todoFooter.classList.add('hidden-element');
        this.$todoList.classList.add('hidden-element');
        this.$pageFooter.classList.add('page-footer_without-items');
    };
};


View.prototype.render = function(parameter, value) {

    if (parameter === 'clearNewTodoInput') {
        this.$newTodoInput.value = '';
    };

    if (parameter === 'updateTotalNumber') {
        this.$totalNumber.textContent = value;
    };

    if (parameter === 'toggleClearBtn') {
        if (value > 0) {
            this.$clearBtn.classList.remove('hidden-element');
        } else {
            this.$clearBtn.classList.add('hidden-element');
        };
    };

    if (parameter === 'checkActiveFilter') {
        if (value > 0) {
            this.$todoFilterActive.classList.remove('todo-footer__filter_non-active');
        } else {
            this.$todoFilterActive.classList.add('todo-footer__filter_non-active');
        };
    };

    if (parameter === 'checkCompletedFilter') {
        if (value > 0) {
            this.$todoFilterCompleted.classList.remove('todo-footer__filter_non-active');
        } else {
            this.$todoFilterCompleted.classList.add('todo-footer__filter_non-active');
        };
    };
};