class View {
    $newTodoInput = document.querySelector('input[data-name="new-todo-input"]');
    $todoList = document.querySelector('ul[data-name="todo-list"]');
    $todoFooter = document.querySelector('footer[data-name="todo-footer"]');
    $pageFooter = document.querySelector('footer[data-name="page-footer"]');
    $totalNumber = document.querySelector('span[data-name="total-number"]');
    $clearBtn = document.querySelector('button[data-name="todo-clear-btn"]');
    $todoFilterAll = document.querySelector('li[data-name="filter-all"]');
    $todoFilterActive = document.querySelector('li[data-name="filter-active"]');
    $todoFilterCompleted = document.querySelector('li[data-name="filter-completed"]');

    constructor(template) {
        this.template = template;
    }


    bind(event, handler) {

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
    }


    editTodoItem_done(id, input, handler) {
        const title = input.value;
    
        function enterClick(event) {
            if (event.keyCode === 13) {
                handler(id, input.value, title);
                input.removeEventListener('keyup', enterClick);
                document.removeEventListener('click', clickWithinBoundaries);
            };
        };
    
        function clickWithinBoundaries(event) {
            const withinBoundaries = event.composedPath().includes(input);
    
            if (!withinBoundaries) {
                handler(id, input.value, title);
                input.removeEventListener('keyup', enterClick);
                document.removeEventListener('click', clickWithinBoundaries);
            };
        }
    
        input.addEventListener('keyup', enterClick);
        document.addEventListener('click', clickWithinBoundaries);
    }


    editTodoItem_updateElements(parameter, id, title) {
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
    }


    createTodoItem(item) {
        const id = item.id;
        const title = item.title;
        const todoItem = this.template.addDefaultTodoItemTemplate(id, title);
        this.$todoList.insertAdjacentHTML('afterbegin', todoItem);
    }


    addInitTodoItems(items, completedTodoItems) {
        for (let item of items) {
            this.createTodoItem(item); 
    
            if (completedTodoItems.includes(item)) {
                const $todoItem = this.$todoList.querySelector(`li[data-id="${item.id}"]`);
                let $todoItemCheckbox = $todoItem.querySelector('input[data-name="todo-item-checkbox"]');
                $todoItemCheckbox.checked = 'true';
            };
        };
    }


    addTodoItem(item) {
        this.createTodoItem(item);
    }


    deleteTodoItem(id) {
        const $todoItem = this.$todoList.querySelector(`li[data-id="${id}"]`);
        this.$todoList.removeChild($todoItem);
    }


    deleteCompletedItems(items) {
        for (let one of items) {
            const $todoItem = this.$todoList.querySelector(`li[data-id="${one.id}"]`);
            this.$todoList.removeChild($todoItem);
        };
    }


    filterActiveCompletedItems(countItems, handler) {
     
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
    }


    addFilteredTodoItems(filters, items) {
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
    }

    
    selectFilter(filters) {
        this.$todoFilterAll.dataset.filterStatus = filters.all.status;
        this.$todoFilterActive.dataset.filterStatus = filters.active.status;
        this.$todoFilterCompleted.dataset.filterStatus = filters.completed.status;
    }


    updateTodoFooter(parameter) {
        if (parameter === 'remove') {
            this.$todoFooter.classList.remove('hidden-element');
            this.$todoList.classList.remove('hidden-element');
            this.$pageFooter.classList.remove('page-footer_without-items');
        } else {
            this.$todoFooter.classList.add('hidden-element');
            this.$todoList.classList.add('hidden-element');
            this.$pageFooter.classList.add('page-footer_without-items');
        };
    }


    render(parameter, value) {

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
    }
};