class Template {
    addDefaultTodoItemTemplate(id, title) {
        let template = 
            `<li class="list__item" data-name="todo-item-li" data-id="${id}">
                <input class="list__item-checkbox" data-name="todo-item-checkbox" type="checkbox" data-id="${id}">
                <label class="list__item-label" data-name="todo-item-label" data-id="${id}">${title}</label>
                <input class="list__item-edit-input hidden-element" data-name="todo-item-input" id="item-edit-input" type="text" data-id="${id}">
                <button class="list__item-delete-btn" data-name="todo-item-delete-btn" data-id="${id}"></button>
            </li>`;
        return template;
    }
};