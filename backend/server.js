const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/typing-test')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Socket.io Logic
const setupSocket = require('./socketHandler');
setupSocket(io);

// Routes (Placeholder)
app.get('/', (req, res) => {
  res.send('Monkeytype Clone API is running');
});

// Import Routes
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
