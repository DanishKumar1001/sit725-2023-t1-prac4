$(document).ready(() => {
    // Fetch all todos and display them
    fetchTodos();

    // Add event listener to form submission
    $('#todo-form').submit((e) => {
        e.preventDefault();
        const title = $('#todo-input').val();
        addTodo(title);
    });

    // Function to fetch all todos
    function fetchTodos() {
        $.get('/api/todos', (todos) => {
            $('#todo-list').empty();
            todos.forEach(todo => {
                $('#todo-list').append(`<li data-id="${todo._id}">${todo.title} <button class="update-btn">Update</button> <button class="delete-btn">Delete</button></li>`);
            });
        });
    }

    // Function to add a new todo
    function addTodo(title) {
        $.post('/api/todos', { title }, (todo) => {
            $('#todo-input').val('');
            fetchTodos();
        });
    }

    // Event listener for update button
    $('#todo-list').on('click', '.update-btn', function() {
        const id = $(this).parent().data('id');
        const newTitle = prompt('Enter new title for the todo:');
        if (newTitle !== null && newTitle.trim() !== '') {
            updateTodo(id, newTitle);
        }
    });

    // Function to update a todo
    function updateTodo(id, title) {
        $.ajax({
            url: `/api/todos/${id}`,
            type: 'PUT',
            data: { title },
            success: () => {
                fetchTodos();
            }
        });
    }

    // Event listener for delete button
    $('#todo-list').on('click', '.delete-btn', function() {
        const id = $(this).parent().data('id');
        deleteTodo(id);
    });

    // Function to delete a todo
    function deleteTodo(id) {
        $.ajax({
            url: `/api/todos/${id}`,
            type: 'DELETE',
            success: () => {
                fetchTodos();
            }
        });
    }
});
