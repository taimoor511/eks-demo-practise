import { useEffect, useState } from 'react';
import { getConfig, getTasks, createTask, updateTask, deleteTask } from './api';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    loadTasks();
    getConfig().then((config) => setName(config.name)).catch(() => {});
  }, []);

  async function loadTasks() {
    try {
      setTasks(await getTasks());
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createTask(title);
      setTitle('');
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(task) {
    await updateTask(task._id, { completed: !task.completed });
    loadTasks();
  }

  async function handleDelete(id) {
    await deleteTask(id);
    loadTasks();
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <p className="subtitle">React + Node.js + MongoDB microservice demo</p>
      {name && <p className="welcome">Welcome {name}</p>}

      <form onSubmit={handleAdd} className="task-form">
        <input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? 'completed' : ''}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task)}
              />
              <span>{task.title}</span>
            </label>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        ))}
        {tasks.length === 0 && <li className="empty">No tasks yet.</li>}
      </ul>
    </div>
  );
}
