// variables
const todoForm = document.getElementById("todo-form");
const todoList = document.getElementById("todos");
const doneList = document.getElementById("dones");

const todoInput = document.getElementById("todo-input");
const todoDesc = document.getElementById("todo-input-desc");
const todoDiff = document.getElementById("todo-input-diff");

const editForm = document.getElementById("edit-modal")
const editInput = document.getElementById("edit-input");
const editDesc = document.getElementById("edit-input-desc");
const editDiff = document.getElementById("edit-input-diff");

var editTodoId;
var editTodoTitle;
var editTodoDesc;
var editTodoDiff;

function generateTodoItemHtml(todoItem) {
    return `
    <div class="border border-1 shadow-sm p-3 mb-3 rounded todo-item" data-id=${todoItem.id}>
        <h4 class="mb-3 input-name todo-title">${todoItem.title}</h4>
        <h6 class="mb-3 input-name todo-description">${todoItem.description}</h6>
        <h6 class="mb-3 input-name todo-difficulty">${todoItem.difficulty}</h6>
        <button type="button" class="btn btn-danger delete">Delete</button>
        <button type="button" class="btn btn-success">${todoItem.isDone ? "Move Back" : "Move to Done"}</button>
        <button type="button" class="btn btn-warning edit" data-bs-toggle="modal"
            data-bs-target="#edit-modal">Edit</button>
    </div>
    `;
}

window.onload = async() => {
    const todos = await getTodos();

    todos.forEach(todoItem => {
        if (todoItem.isDone == false) {
            todoList.innerHTML += generateTodoItemHtml(todoItem);
            return;
        } else {
            doneList.innerHTML += generateTodoItemHtml(todoItem);
        }
    })
};


todoForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    var todoItem = {
        title: todoInput.value,
        description: todoDesc.value,
        difficulty: todoDiff.value
    }

    if (todoInput.value.length > 0) {
        todoInput,
        todoDesc,
        todoDiff.classList.remove("is-invalid");
        await addTodo(todoItem);
        todoForm.reset();
        location.reload();
    }
    else {
        todoInput.classList.add("is-invalid");
    }
});

// Todo item card actions
document.addEventListener("click", async function(e) {
    if (e.target.matches(".delete")) {
        let deleteId = e.target.closest(".todo-item").attributes['data-id'].value;
        await deleteTodo(deleteId);
        location.reload(); // perkrauna puslapi
        //e.target.closest(".todo-item").remove(); // we do not delte this as we reload the page (query database) after each delete anyways
        return;
    }

    if (e.target.innerText == "Move to Done") {
        let newState = true;
        let completeId = e.target.closest(".todo-item").attributes['data-id'].value;
        await changeTodoState(newState, completeId);
        location.reload();
        //e.target.innerText = "Move back";
        //doneList.appendChild(card);
        return;
    }

    if (e.target.innerText == "Move Back") {
        let newState = false;
        let completeId = e.target.closest(".todo-item").attributes['data-id'].value;
        await changeTodoState(newState, completeId);
        location.reload();
        //e.target.innerText = "Move back";
        //doneList.appendChild(card);
        return;
    }

    if (e.target.matches(".edit")) {
        const todoItem = e.target.closest(".todo-item");
        editTodoId = todoItem.attributes['data-id'].value;
        editTodoTitle = todoItem.querySelector(".todo-title").innerText;
        editTodoDesc = todoItem.querySelector(".todo-description").innerText;
        editTodoDiff = todoItem.querySelector(".todo-difficulty").innerText;

        editInput.value = editTodoTitle;
        editDesc.value = editTodoDesc;
        editDiff.value = editTodoDiff;
    }
});

editForm.addEventListener("click", async function(e) {
    if (e.target.matches(".edit-submit")) {
        var editTodoItem = {
            title: editInput.value,
            description: editDesc.value,
            difficulty: editDiff.value
        };
        await editTodo(editTodoId, editTodoItem);
        location.reload();
    }

});