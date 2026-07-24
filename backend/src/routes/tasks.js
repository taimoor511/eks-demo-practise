const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

router.get('/', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const task = await Task.create({ title: title.trim() });
  res.status(201).json(task);
});

router.put('/:id', async (req, res) => {
  const { title, completed } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { ...(title !== undefined && { title }), ...(completed !== undefined && { completed }) },
    { new: true }
  );
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ success: true });
});

module.exports = router;
