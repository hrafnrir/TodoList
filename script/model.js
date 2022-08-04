class Model {
    filters = {
        all: {total: 0, status: 'selected'},
        active: {total: 0, status: 'non-selected'},
        completed: {total: 0, status: 'non-selected'}
    };

    constructor(storage) {
        this.storage = storage;
    }


    initTodoItems(callback) {
        this.storage.initTodoItems(callback);
    
        this.getFiltersTotal();
    }


    createTodoItem(title, callback) {
        let newTodoItem = {
            id: Date.now(),
            title: title.trim(),
            isCompleted: false,
        };
    
        this.filters.all.total++;
        this.filters.active.total++;
    
        this.storage.saveTodoItems('addTodoItem', newTodoItem);
        callback(newTodoItem);
    }


    editTodoItem(id, newTitle, callback) {
        this.storage.todoItems.find(item => item.id == id).title = newTitle;
    
        this.storage.saveTodoItems();
        callback(id, newTitle);
    }


    deleteTodoItem(id, callback) {
        this.storage.saveTodoItems('deleteTodoItem', id);
    
        this.getFiltersTotal();
        callback(id);
    }


    deleteCompletedItems(callback) {
        const completedItems = this.storage.todoItems.filter(item => item.isCompleted === true);
        this.storage.saveTodoItems('deleteCompletedItems', completedItems);
    
        this.filters.all.total -= completedItems.length;
        this.filters.completed.total -= completedItems.length;
    
        callback(completedItems);
    }


    changeTodoItemStatus(id) {
        const i = this.storage.todoItems.findIndex(item => item.id == id);
        if (!this.storage.todoItems[i].isCompleted) {
            this.storage.todoItems[i].isCompleted = true;
    
            this.filters.completed.total++;
            this.filters.active.total--;
        } else {
            this.storage.todoItems[i].isCompleted = false;
    
            this.filters.active.total++;
            this.filters.completed.total--;
        };
        this.storage.saveTodoItems();
    }


    getFilterTodoItems(parameter, callback) {
        if (parameter === 'all') {
            this.filters.all.status = 'selected';
            this.filters.active.status = 'non-selected';
            this.filters.completed.status = 'non-selected';
    
            callback(this.filters);
        } else {
            this.filters.all.status = 'non-selected';
            let value;
    
            if (parameter === 'active') {
                this.filters.active.status = 'selected';
                this.filters.completed.status = 'non-selected';
    
                value = true;
            } else {
                this.filters.active.status = 'non-selected';
                this.filters.completed.status = 'selected';
    
                value = false;
            };
            const items = this.storage.todoItems.filter(item => item.isCompleted == value).map(item => item.id);
            callback(this.filters, items);
        };
    }
    

    getFiltersTotal() {
        this.filters.all.total = this.storage.todoItems.length;
        this.filters.active.total = this.storage.todoItems.filter(item => item.isCompleted === false).length;
        this.filters.completed.total = this.filters.all.total - this.filters.active.total;
    }
};