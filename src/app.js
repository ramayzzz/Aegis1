const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.get('/api/v1/status', (req, res) => {
  res.json({ status: 'ok' });
});

// TODO: Add other routes here
const profileRoutes = require('./routes/profiles');
app.use('/api/v1/profiles', profileRoutes);

const taskRoutes = require('./routes/tasks');
app.use('/api/v1/tasks', taskRoutes);

const proxyRoutes = require('./routes/proxies');
app.use('/api/v1/proxies', proxyRoutes);

const jobRoutes = require('./routes/jobs');
app.use('/api/v1/jobs', jobRoutes);

const scheduledJobRoutes = require('./routes/scheduledJobs');
app.use('/api/v1/scheduled-jobs', scheduledJobRoutes);

const secretRoutes = require('./routes/secrets');
app.use('/api/v1/secrets', secretRoutes);

const settingRoutes = require('./routes/settings');
app.use('/api/v1/settings', settingRoutes);

const { start: startOrchestrator } = require('./services/jobOrchestrator');

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startOrchestrator(io);
});

module.exports = app;
