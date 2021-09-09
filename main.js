// variables
var todoForm = document.getElementById("todo-form");
var todoList = document.getElementById("todos");
var doneList = document.getElementById("dones");
var todoInput = document.getElementById("todo-input");
var todoDesc = document.getElementById("todo-input-desc");
var todoDiff = document.getElementById("todo-input-diff");

var editForm = document.getElementById("edit-modal")
var editInput = document.getElementById("edit-input");
var editDesc = document.getElementById("edit-input-desc");
var editDiff = document.getElementById("edit-input-diff");

var editTodoId;

window.onload = async() => {
    const todos = await getTodos();

    todos.forEach(todo => {
        if (todo.isDone == false) {
            var todoItem = `
    <div class="border border-1 shadow-sm p-3 mb-3 rounded todo-item" data-id=${todo.id}>
        <h4 class="mb-3 input-name">${todo.title}</h4>
        <h6 class="mb-3 input-name">${todo.description}</h6>
        <h6 class="mb-3 input-name">Difficulty: ${todo.difficulty}</h6>
        <button type="button" class="btn btn-danger delete">Delete</button>
        <button type="button" class="btn btn-success move-todo">Move to Done</button>
        <button type="button" class="btn btn-warning edit" data-bs-toggle="modal"
            data-bs-target="#edit-modal">Edit</button>
    </div>
    `;
            todoList.innerHTML += todoItem;
        } else if (todo.isDone == true) {
            var todoItem = `
  <div class="border border-1 shadow-sm p-3 mb-3 rounded todo-item" data-id=${todo.id}>
      <h4 class="mb-3 input-name">${todo.title}</h4>
      <h6 class="mb-3 input-name">${todo.description}</h6>
      <h6 class="mb-3 input-name">Difficulty: ${todo.difficulty}</h6>
      <button type="button" class="btn btn-danger delete">Delete</button>
      <button type="button" class="btn btn-success move-done">Move Back</button>
      <button type="button" class="btn btn-warning edit" data-bs-toggle="modal"
          data-bs-target="#edit-modal">Edit</button>
  </div>
  `;
            doneList.innerHTML += todoItem;
        }
    })
};


todoForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    if (todoInput.value.length > 0) {
        todoInput.classList.remove("is-invalid");
        todoDesc.classList.remove("is-invalid");
        todoDiff.classList.remove("is-invalid");
        // var todoItem = `
        // <div class="border border-1 shadow-sm p-3 mb-3 rounded todo-item">
        //     <h4 class="mb-3 input-name">${todoInput.value}</h4>
        //     <h6 class="mb-3 input-name">${todoDesc.value}</h6>
        //     <h6 class="mb-3 input-name">Difficulty: ${todoDiff.value}</h6>
        //     <button type="button" class="btn btn-danger delete">Delete</button>
        //     <button type="button" class="btn btn-success move-todo">Move to Done</button>
        //     <button type="button" class="btn btn-warning edit" data-bs-toggle="modal"
        //         data-bs-target="#edit-modal">Edit</button>
        // </div>
        // `;
        // HTML object does not contain the Guid that is generated in backend, but not retireved (to the GUI). Yet, as representation is ephemeral, ID gets populated on next reload. 
        // HOWEVER, if the card is moved (Move to Done) without page reload, method does not work! 
        await addTodo(todoInput.value, todoDesc.value, todoDiff.value);
        //todoList.innerHTML += todoItem;
        todoForm.reset();
        location.reload();
    } else {
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

    if (e.target.matches(".move-todo")) {
        //var card = e.target.closest(".todo-item");
        if (e.target.innerText == "Move to Done") {
            let newState = true;
            let completeId = e.target.closest(".todo-item").attributes['data-id'].value;
            await changeTodoState(newState, completeId);
            location.reload();
            //e.target.innerText = "Move back";
            //doneList.appendChild(card);
            return;
        }

        //e.target.innerText = "Move to Done";
        //todoList.appendChild(card);
    }

    if (e.target.matches(".move-done")) {
        //var card = e.target.closest(".todo-item");
        if (e.target.innerText == "Move Back") {
            let newState = false;
            let completeId = e.target.closest(".todo-item").attributes['data-id'].value;
            await changeTodoState(newState, completeId);
            location.reload();
            //e.target.innerText = "Move back";
            //doneList.appendChild(card);
            return;
        }

        //e.target.innerText = "Move Back";
        //todoList.appendChild(card);
    }

    if (e.target.matches(".edit")) {
        editTodoId = e.target.closest(".todo-item").attributes['data-id'].value;
        console.log(editTodoId);
        // if (e.target.matches(".edit-submit")) {
        //     console.log(editTodoId);
        //     await addTodo(editInput.value, editDesc.value, editDiff.value);
        //     //todoList.innerHTML += todoItem;
        //     //location.reload();
        // }
    }
});

editForm.addEventListener("click", async function(e) {
    if (e.target.matches(".edit-submit")) {
        console.log(editTodoId);
        await editTodo(editTodoId, editInput.value, editDesc.value, editDiff.value);
        //todoList.innerHTML += todoItem;
        location.reload();
    }

});