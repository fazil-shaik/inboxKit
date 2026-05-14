# Real-Time Shared Grid App

A fast, highly interactive real-time grid application where multiple users can claim blocks concurrently. Built with a focus on modern aesthetics, glassmorphism UI, and real-time multiplayer synchronization.

## 🚀 Features

- **Real-Time Synchronization**: Every block claimed is instantly broadcasted to all connected users.
- **Interactive Grid**: A 40x40 interactive map with smooth panning and zooming.
- **Leaderboard**: Live ranking of the top players based on the number of blocks claimed.
- **Premium UI**: Dark mode, glassmorphism overlays, and micro-animations for an engaging experience.
- **Cooldown System**: Built-in rate limiting to prevent click spamming.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Vanilla CSS, `react-zoom-pan-pinch`, `lucide-react`.
- **Backend**: Node.js, Express, Socket.io.
- **State Management**: Fast, in-memory Map structure for instant validation and broadcasting.

## 📦 Project Structure

The project is organized as a monorepo with two main directories:

- `/client` - The Vite React frontend application.
- `/server` - The Node.js and Socket.io backend server.

## 🏃‍♂️ How to Run Locally

### 1. Start the Backend Server

```bash
cd server
npm install
npm start
```
The Socket.io server will start on `http://localhost:3001`.

### 2. Start the Frontend Client

Open a new terminal window:

```bash
cd client
npm install
npm run dev
```
The Vite development server will start on `http://localhost:5173`. Open this in your browser.

## 🌐 Deployment

- **Frontend (Vercel)**: The `/client` directory is deployed to Vercel. 
- **Backend (Render)**: The `/server` directory is deployed to Render.com using the included `render.yaml` blueprint file. This ensures the Socket.io WebSocket connections remain persistent and stateful.

*(Note: Standard Socket.io with in-memory state cannot be hosted on Vercel due to its Serverless Function architecture, which is why the backend is hosted on Render).*
