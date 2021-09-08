async function getTodos() {
    const response = await fetch('https://localhost:5001/todos');

    return response.json();
}

async function deleteTodo(id) {
    const url = 'https://localhost:5001/todos/' + id;
    console.log(url);
    const response = await fetch(url, {
        method: "DELETE",
    });
    return response;
}

async function changeTodoState(newState, id) {
    const url = 'https://localhost:5001/todos/' + id + '/status';
    console.log(url);
    const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({
            isDone: newState,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
    return response.json();
}