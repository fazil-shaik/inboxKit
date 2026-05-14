const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: ["http://localhost:5173", "https://inbox-kit-xi.vercel.app", "https://inbox-kit-gxe4.vercel.app/"] }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.get('/', (req, res) => {
  res.send("Server working fine")
})

const PORT = process.env.PORT || 3001;
const GRID_SIZE = 40;
const COOLDOWN_MS = 500;

// State
// grid is a Map of `${x},${y}` -> { owner: socketId, color: string, timestamp: number }
const grid = new Map();
// users is a Map of socketId -> { id, name, color, blocks: number, lastClick: number }
const users = new Map();

// Generate random colors and names
const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b', '#f97316'];
const names = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function calculateLeaderboard() {
  const lb = Array.from(users.values())
    .sort((a, b) => b.blocks - a.blocks)
    .slice(0, 10);
  return lb;
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Assign color and name
  const color = getRandomElement(colors);
  const name = `${getRandomElement(names)} ${Math.floor(Math.random() * 1000)}`;

  users.set(socket.id, {
    id: socket.id,
    name,
    color,
    blocks: 0,
    lastClick: 0
  });

  // Send initial state to the connected user
  socket.emit('init', {
    grid: Array.from(grid.entries()),
    user: users.get(socket.id),
    gridSize: GRID_SIZE,
    leaderboard: calculateLeaderboard()
  });

  // Broadcast that a new user joined
  io.emit('leaderboard_update', calculateLeaderboard());

  socket.on('claim_block', ({ x, y }) => {
    const user = users.get(socket.id);
    if (!user) return;

    // Boundary check
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;

    const now = Date.now();
    if (now - user.lastClick < COOLDOWN_MS) {
      // Spamming, ignore or send error to client
      socket.emit('cooldown_error', { timeRemaining: COOLDOWN_MS - (now - user.lastClick) });
      return;
    }

    const cellId = `${x},${y}`;
    const previousOwner = grid.get(cellId)?.owner;

    // Check if the block is already owned by the same user
    if (previousOwner === socket.id) return;

    // Update block count for previous owner
    if (previousOwner && users.has(previousOwner)) {
      users.get(previousOwner).blocks--;
    }

    // Update new owner
    user.blocks++;
    user.lastClick = now;

    grid.set(cellId, { owner: socket.id, color: user.color, timestamp: now });

    // Broadcast the claim
    io.emit('block_claimed', {
      x,
      y,
      owner: socket.id,
      color: user.color
    });

    // Update leaderboard
    io.emit('leaderboard_update', calculateLeaderboard());
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    users.delete(socket.id);
    io.emit('leaderboard_update', calculateLeaderboard());
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
