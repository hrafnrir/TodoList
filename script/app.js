const todoInput = document.querySelector('.todo-header__field');
const todoList = document.querySelector('.todo-list__list');
const todoFooter = document.querySelector('.todo__todo-footer');
const todoTotalNumber = document.querySelector('.total__number');
const footer = document.querySelector('.page-footer');
const todoClearBtn = document.querySelector('.todo-footer__clear-btn');

let todoItemLi;

const todoFilterAll = document.querySelector('li[data-name="all"]');
const todoFilterActive = document.querySelector('li[data-name="active"]');
const todoFilterCompleted = document.querySelector('li[data-name="completed"]');

let i = 0;
let n = 1;


// update items

let updateTodoItems = function() {
    todoItemLi = document.querySelectorAll('.list__item');
};


// save items in local storage

let saveTodoItems = function() {
    localStorage.setItem('todoItems', todoList.innerHTML);
};


// initial items from local storage

let initTodoItems = function() {
    const itemsFromLS = localStorage.getItem('todoItems');
    if (itemsFromLS) {
        todoList.innerHTML = itemsFromLS;

        if (document.querySelector('li[data-status="completed"]')) {
            let completedItems = document.querySelectorAll('li[data-status="completed"]');
            for (let m = 0; m < completedItems.length; m++) {
                let completedCheckbox = completedItems[m].querySelector('.list__item-checkbox');
                completedCheckbox.checked = 'true';
            };
        };

        let allItems = document.querySelectorAll('.list__item');
        let maxNumber = +allItems[0].getAttribute('data-group-number');
            
        for (let m = 1; m < allItems.length; m++) {
            let secondNumber = +allItems[m].getAttribute('data-group-number');
            if (maxNumber < secondNumber) {
                maxNumber = secondNumber;
            };
        };

        n = ++maxNumber;
    };
};


// get the number of items by status

let getNumberOfTodoItems = function(status) {
    let itemsByStatus = document.querySelectorAll(`li[data-status="${status}"]`);
    return itemsByStatus.length;
};


// get a list of filtered items

let getFilteredTodoItems = function(filter) {
    todoItemLi.forEach((item) => {
        item.classList.add('hidden-element');
    });

    let shownItems = document.querySelectorAll(`li[data-status="${filter}"]`);
    
    shownItems.forEach((item) => {
        item.classList.remove('hidden-element');
    });

    if (!filter) {
        todoItemLi.forEach((item) => {
            item.classList.remove('hidden-element');
        });
    };
};


// add todo filters

let addFilterByStatus = function() {
    this.dataset.filterStatus = 'selected';
    todoFilterAll.dataset.filterStatus = 'non-selected';

    if (this == todoFilterActive) {
        todoFilterCompleted.dataset.filterStatus = 'non-selected';
        getFilteredTodoItems('active');

    } else if (this == todoFilterCompleted) {
        todoFilterActive.dataset.filterStatus = 'non-selected';
        getFilteredTodoItems('completed');
    };
};

let addFilters = function() {
    todoFilterAll.addEventListener('click', event => {
        todoFilterAll.dataset.filterStatus = 'selected';
        todoFilterActive.dataset.filterStatus = 'non-selected';
        todoFilterCompleted.dataset.filterStatus = 'non-selected';

        getFilteredTodoItems();
    });

    if (document.querySelector('li[data-status="active"]')) {
        todoFilterActive.classList.remove('todo-footer__filter_non-active');
        todoFilterActive.addEventListener('click', addFilterByStatus);
    } else {
        todoFilterActive.classList.add('todo-footer__filter_non-active');
        todoFilterActive.removeEventListener('click', addFilterByStatus);
    };

    if (document.querySelector('li[data-status="completed"]')) {
        todoFilterCompleted.classList.remove('todo-footer__filter_non-active');
        todoClearBtn.classList.remove('hidden-element');

        todoFilterCompleted.addEventListener('click', addFilterByStatus);
    } else {
        todoFilterCompleted.classList.add('todo-footer__filter_non-active');
        todoClearBtn.classList.add('hidden-element');

        todoFilterCompleted.removeEventListener('click', addFilterByStatus);
    };
};


// remove todo footer if there are no items in the list

let removeTodoFooter = function() {
    let totalNumberOfTodoItems = document.querySelectorAll('.list__item').length;

    if (totalNumberOfTodoItems === 0) {
        todoList.classList.add('hidden-element');
        todoFooter.classList.add('hidden-element');
        footer.classList.add('page-footer_without-items');

    } else {
        todoList.classList.remove('hidden-element');
        todoFooter.classList.remove('hidden-element');
        footer.classList.remove('page-footer_without-items');

        addFilters();
    };
};


initTodoItems();
updateTodoItems();
i = getNumberOfTodoItems('active');
todoTotalNumber.textContent = i;
removeTodoFooter();


todoInput.addEventListener('keyup', event => {
    if (event.code === 'Enter') {

        if (todoInput.value.trim() === '') {
            return;
        };

        if (todoFilterCompleted.dataset.filterStatus === 'selected') {
            todoFilterCompleted.dataset.filterStatus = 'non-selected';
            todoFilterAll.dataset.filterStatus = 'selected';
    
            getFilteredTodoItems();
        };

        createTodoItem(todoInput.value.trim());
        todoInput.value = '';
    };
});


// create a new item

let createTodoItem = function(value) {

    let newTodoItemLi = document.createElement('li');
    newTodoItemLi.className = 'list__item';
    newTodoItemLi.setAttribute('data-status', 'active');
    newTodoItemLi.setAttribute('data-group-number', `${n}`);

    let newTodoItemCheckbox = document.createElement('input');
    newTodoItemCheckbox.className = 'list__item-checkbox';
    newTodoItemCheckbox.setAttribute('type', 'checkbox');
    newTodoItemCheckbox.setAttribute('data-group-number', `${n}`);

    let newTodoItemLabel = document.createElement('label');
    newTodoItemLabel.className = 'list__item-label';
    newTodoItemLabel.textContent = value;
    newTodoItemLabel.setAttribute('data-group-number', `${n}`);

    let newTodoItemInput = document.createElement('input');
    newTodoItemInput.classList.add('list__item-edit-input', 'hidden-element');
    newTodoItemInput.id = 'item-edit-input';
    newTodoItemInput.setAttribute('type', 'text');
    newTodoItemInput.setAttribute('data-group-number', `${n}`);

    let newTodoItemDeleteBtn = document.createElement('button');
    newTodoItemDeleteBtn.className = 'list__item-delete-btn';
    newTodoItemDeleteBtn.setAttribute('data-group-number', `${n}`);
    
    newTodoItemLi.append(newTodoItemCheckbox, newTodoItemLabel, newTodoItemInput, newTodoItemDeleteBtn);
    todoList.prepend(newTodoItemLi);

    n++;

    i = getNumberOfTodoItems('active');
    todoTotalNumber.textContent = i;

    updateTodoItems();
    saveTodoItems();
    removeTodoFooter();
};


// change item status to completed and back

todoList.addEventListener('click', event => {
    let target = event.target;
    if (!target.classList.contains('list__item-checkbox')) {
        return;
    } else {
        let index = target.dataset.groupNumber;
        changeTodoItemStatus(target, index);
    };
});


let changeTodoItemStatus = function(checkbox, index) {
    let li = document.querySelector(`li[data-group-number="${index}"]`);

    if (checkbox.checked == true) {
        if (document.querySelector('li[data-status="completed"]')) {
            let itemsCompleted = document.querySelectorAll('li[data-status="completed"]');
            itemsCompleted[0].before(li);

            li.dataset.status = 'completed';
        } else {
            li.dataset.status = 'completed';
            todoList.append(li);
        };

        i = getNumberOfTodoItems('active');
        todoTotalNumber.textContent = i;
    } else {
        li.dataset.status = 'active';
        todoList.prepend(li);

        i = getNumberOfTodoItems('active');
        todoTotalNumber.textContent = i;
    };

    saveTodoItems();
    addFilters();
};


// change the text content of the item

todoList.addEventListener('dblclick', event => {
    let target = event.target;
    if (!target.classList.contains('list__item-label')) {
        return;
    } else {
        let index = target.dataset.groupNumber;
        changeItem(target, index);
    };
});


let changeItem = function(label, index) {
    let allInputs = document.querySelectorAll(`input[data-group-number="${index}"]`);
    let input;
    let checkbox;

    for (let m = 0; m < allInputs.length; m++) {
        if (allInputs[m].classList.contains('list__item-edit-input')) {
            input = allInputs[m];
        } else {
            checkbox = allInputs[m];
        };
    };

    let previousValue = label.textContent;
    input.value = previousValue;
    label.textContent = '';
        
    label.classList.add('hidden-element');
    checkbox.classList.add('hidden-element');

    input.classList.remove('hidden-element');
    input.focus();

    let saveChanges = function() {
        if (input.value.trim() === previousValue || input.value.trim() === '') {
            label.textContent = previousValue;

            label.classList.remove('hidden-element');
            checkbox.classList.remove('hidden-element');

            input.classList.add('hidden-element');
        } else {
            label.textContent = input.value.trim();

            label.classList.remove('hidden-element');
            checkbox.classList.remove('hidden-element');

            input.classList.add('hidden-element');

            saveTodoItems();
        };
    };

    let enterClick = function(event) {
        if (event.code === 'Enter') {
            saveChanges();
            input.removeEventListener('keyup', enterClick);
        };
    };

    input.addEventListener('keyup', enterClick);

    document.addEventListener('click', event => {
        const withinBoundaries = event.composedPath().includes(input);
             
        if (!withinBoundaries) {
            saveChanges();
        };
    });
};


// check empty filter

let checkEmptyFilter = function() {
    if (todoFilterActive.dataset.filterStatus === 'selected' && !document.querySelector('li[data-status="active"]')) {
        todoFilterActive.dataset.filterStatus = 'non-selected';
        todoFilterAll.dataset.filterStatus = 'selected';

        getFilteredTodoItems();
    } else if (todoFilterCompleted.dataset.filterStatus === 'selected' && !document.querySelector('li[data-status="completed"]')) {
        todoFilterCompleted.dataset.filterStatus = 'non-selected';
        todoFilterAll.dataset.filterStatus = 'selected';

        getFilteredTodoItems();
    };
};


// delete one item

todoList.addEventListener('click', event => {
    let target = event.target;
    if (!target.classList.contains('list__item-delete-btn')) {
        return;
    } else {
        let index = target.dataset.groupNumber;
        deleteTodoItem(index);
    };
});

let deleteTodoItem = function(index) {
    let li = document.querySelector(`li[data-group-number="${index}"]`);

    li.dataset.status = 'deleted';
    todoList.removeChild(li);

    i = getNumberOfTodoItems('active');
    todoTotalNumber.textContent = i;

    updateTodoItems();
    removeTodoFooter();
    checkEmptyFilter();
    saveTodoItems();
};


// delete all completed items

todoClearBtn.addEventListener('click', event => {
    let todoCompletedItems = document.querySelectorAll('li[data-status="completed"]');
    
    todoCompletedItems.forEach((item) => {
        item.dataset.status = 'deleted';
        todoList.removeChild(item);
    });

    updateTodoItems()
    removeTodoFooter();
    checkEmptyFilter();
    saveTodoItems();
});