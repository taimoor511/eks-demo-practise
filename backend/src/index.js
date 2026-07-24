require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/config', (req, res) => res.json({ name: process.env.NAME || 'stranger' }));
app.use('/api/tasks', tasksRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
