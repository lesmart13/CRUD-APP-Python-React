import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Fetch all tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch('http://localhost:5000/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  // Create or Update task
  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description, completed: false };

    if (editingTask) {
      await fetch(`http://localhost:5000/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      setEditingTask(null);
    } else {
      await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
    }

    setTitle('');
    setDescription('');
    fetchTasks();
  };

  // Delete task
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE'
    });
    fetchTasks();
  };

  // Edit task
  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  // Toggle completed status
  const toggleComplete = async (task) => {
    await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, completed: !task.completed })
    });
    fetchTasks();
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
        />
        <button type="submit">{editingTask ? 'Update' : 'Add'} Task</button>
      </form>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
            />
            <div className="task-details">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;