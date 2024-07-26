
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Define Task schema and model
const taskSchema = new mongoose.Schema({
    text: String,
    completed: Boolean
});
const Task = mongoose.model('Task', taskSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes

// Root route
// app.get('/', (req, res) => {  res.send('Welcome to the Task Manager API');});
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Task Manager API</h1>
        <p><a href="/tasks">View Tasks</a></p>
    `);
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
    }
});

app.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
});


// Connect to MongoDB
mongoose.connect('mongodb+srv://fakharraza51214:admin12345@restapi.kjwb7sg.mongodb.net/?retryWrites=true&w=majority&appName=RESTAPI'
)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
        console.log('Server running at http://localhost:5000/');
        });
    }
).catch((err) => {
    console.log('Failed to connect to MongoDB', err);
});