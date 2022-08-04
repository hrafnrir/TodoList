class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }


    addListeners() {
        this.view.bind('newTodoItem', title => this.addNewTodoItem(title));
        this.view.bind('editTodoItem', (id, newTitle, title) => this.editTodoItem(id, newTitle, title));
        this.view.bind('changeTodoItemStatus', id => this.changeTodoItemStatus(id));
        this.view.bind('deleteTodoItem', id => this.deleteTodoItem(id));
        this.view.bind('deleteCompletedItems', () => this.deleteCompletedItems());
    }


    setView() {
        this.model.initTodoItems((items, completedItems) => this.view.addInitTodoItems(items, completedItems));
        
        this.updateTodoFooter();
    
        this.view.render('updateTotalNumber', this.model.filters.active.total);
        this.view.render('toggleClearBtn', this.model.filters.completed.total);
        this.view.render('checkActiveFilter', this.model.filters.active.total);
        this.view.render('checkCompletedFilter', this.model.filters.completed.total);
    }


    addNewTodoItem(title) {
        if (title.trim() === '') {
            return;
        };
    
        this.model.createTodoItem(title, item => this.view.addTodoItem(item));
        this.view.render('clearNewTodoInput');
    
        if (this.model.filters.completed.status === 'selected') {
            this.model.getFilterTodoItems('all', (filters, items) => this.view.addFilteredTodoItems(filters, items));
        };
    
        this.updateTodoFooter();
    
        this.view.render('updateTotalNumber', this.model.filters.active.total);
        this.view.render('checkActiveFilter', this.model.filters.active.total);
    }


    editTodoItem(id, newTitle, title) {
        if (newTitle.trim() === title) {
            this.view.editTodoItem_updateElements('add', id, title);
        } else if (newTitle.trim() === '') {
            this.deleteTodoItem(id);        
        } else {
            this.model.editTodoItem(id, newTitle, (id, newTitle) => this.view.editTodoItem_updateElements('add', id, newTitle));
        };
    }


    changeTodoItemStatus(id) {
        this.model.changeTodoItemStatus(id);
    
        if (this.model.filters.all.status === 'non-selected') {
            const parameter = this.model.filters.active.status === 'selected' ? 'active' : 'completed';
    
            this.model.getFilterTodoItems(parameter, (filters, items) => this.view.addFilteredTodoItems(filters, items));
    
            this.changeEmptyFilter(parameter);
        };
    
        this.view.render('updateTotalNumber', this.model.filters.active.total);
        this.view.render('toggleClearBtn', this.model.filters.completed.total);
        this.view.render('checkActiveFilter', this.model.filters.active.total);
        this.view.render('checkCompletedFilter', this.model.filters.completed.total);
    }


    deleteTodoItem(id) {
        this.model.deleteTodoItem(id, (id) => this.view.deleteTodoItem(id));
    
        this.updateTodoFooter();
    
        if (this.model.filters.active.status === 'selected') {
            this.changeEmptyFilter('active');
        } else if (this.model.filters.completed.status === 'selected') {
            this.changeEmptyFilter('completed');
        };
    
        this.view.render('updateTotalNumber', this.model.filters.active.total);
        this.view.render('toggleClearBtn', this.model.filters.completed.total);
        this.view.render('checkActiveFilter', this.model.filters.active.total);
        this.view.render('checkCompletedFilter', this.model.filters.completed.total);
    }


    deleteCompletedItems() {
        this.model.deleteCompletedItems((items) => this.view.deleteCompletedItems(items));
    
        this.updateTodoFooter();
    
        if (this.model.filters.completed.status === 'selected') {
            this.changeEmptyFilter('completed');
        };
    
        this.view.render('toggleClearBtn', this.model.filters.completed.total);
        this.view.render('checkCompletedFilter', this.model.filters.completed.total);
    }


    addFilters() {
        this.view.bind('filterAllItems', 
            parameter => this.model.getFilterTodoItems(parameter, (filters, items) => this.view.addFilteredTodoItems(filters, items)));
    
        this.view.filterActiveCompletedItems(
            parameter => parameter === 'active' ? this.model.filters.active.total : this.model.filters.completed.total, 
            parameter => this.model.getFilterTodoItems(parameter, (filters, items) => this.view.addFilteredTodoItems(filters, items)));
    }


    changeEmptyFilter(filter) {
        const number = (filter === 'active') ? this.model.filters.active.total : this.model.filters.completed.total;
        const parameter = (filter === 'active') ? this.model.filters.active.status : this.model.filters.completed.status;
    
        if (parameter === 'selected' && number === 0) {
            this.model.getFilterTodoItems('all', (filters, items) => this.view.addFilteredTodoItems(filters, items));
        };
    }
    

    updateTodoFooter() {
        const parameter = this.model.filters.all.total > 0 ? 'remove' : 'add';
        this.view.updateTodoFooter(parameter);
    }
};