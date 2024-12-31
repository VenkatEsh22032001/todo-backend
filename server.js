const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://3.81.228.191:3000' }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
    .then(() => console.log('DB connected!'))
    .catch(err => console.log(err));

// Create Mongoose Schema and Model
const todoSchema = new mongoose.Schema({
    title: { required: true, type: String },
    description: String,
});

const todoModel = mongoose.model('Todo', todoSchema);

// Create a new Todo
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    if (!title || typeof title !== 'string') {
        return res.status(400).json({ message: 'Title is required and must be a string' });
    }
    try {
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Get all Todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Update a Todo
app.put('/todos/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(updatedTodo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Delete a Todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Start the Server
const port = 5000;
app.listen(port, () => {
    console.log('Server is listening to port ' + port);
});
