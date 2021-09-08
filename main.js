// variables
var todoForm = document.getElementById("todo-form");
var todoList = document.getElementById("todos");
var doneList = document.getElementById("dones");
var todoInput = document.getElementById("todo-input");
var editInput = document.getElementById('edit-input');

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
}

todoForm.addEventListener("submit", function(e) {
    e.preventDefault();

    if (todoInput.value.length > 0) {
        todoInput.classList.remove("is-invalid");
        var todoItem = `
        <div class="border border-1 shadow-sm p-3 mb-3 rounded todo-item">
            <h4 class="mb-3 input-name">${todoInput.value}</h4>
            <button type="button" class="btn btn-danger delete">Delete</button>
            <button type="button" class="btn btn-success move-todo">Move to Done</button>
            <button type="button" class="btn btn-warning edit" data-bs-toggle="modal"
                data-bs-target="#edit-modal">Edit</button>
        </div>
        `;
        todoList.innerHTML += todoItem;
        todoForm.reset();
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
});