require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

connectDB();

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173', 'https://task-manager-app-ruddy-mu.vercel.app', 'https://task-manager-rkgxel2tw-ayush13-6s-projects.vercel.app'] }));
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT || 5000}`);
});
