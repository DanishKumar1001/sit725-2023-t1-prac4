const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Todo = require('./models/todo');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo_db', { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
// Create a todo
app.post('/api/todos', async (req, res) => {
    try {
        const { title } = req.body;
        const todo = new Todo({
            title
        });
        await todo.save();
        res.status(201).send(todo);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Read all todos
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.send(todos);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const todo = await Todo.findByIdAndUpdate(id, { title }, { new: true });
        res.send(todo);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
