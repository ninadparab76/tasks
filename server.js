const express = require('express');
const { setTimeout } = require('timers/promises');
const app = express();

// Middleware to parse form data and serve static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory database
let tasks = [
    { id: 1, text: "Learn HTML" },
    { id: 2, text: "Master HTMX" },
    { id: 3, text: "Learn JavaScript" }
];
let nextId = 4;

// Helper function to generate HTML for a single task
const renderTask = (task) => `
    <li id="task-${task.id}" class="box is-shadowless is-flex is-justify-content-space-between is-align-items-center p-3 mb-2" style="border-radius: 4px; border: 1px solid var(--bulma-border-weak);">
    <span class="is-size-6">${task.text}</span>
    <button 
        class="button is-danger is-small is-outlined"
        hx-delete="/tasks/${task.id}" 
        hx-target="#task-${task.id}" 
        hx-swap="outerHTML swap:300ms"> Delete
    </button>
</li>
`;


// Route 1: Get all tasks (Used on page load)
app.get('/tasks', async (req, res) => {

    await setTimeout(10000);

    const tasksHTML = tasks.map(renderTask).join('');
    res.send(tasksHTML);
});

// Route 2: Add a new task
app.post('/tasks', (req, res) => {
    const newTask = { id: nextId++, text: req.body.task };
    tasks.push(newTask);
    res.send(renderTask(newTask)); // Send back ONLY the new task's HTML
});

// Route 3: Delete a task
app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
    res.send(''); // Sending an empty string removes the element from the DOM
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));