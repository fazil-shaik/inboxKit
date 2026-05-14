import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import Grid from './components/Grid';
import UI from './components/UI';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const SOCKET_URL = import.meta.env.PROD ? 'https://inboxkit-1dej.onrender.com/' : 'http://localhost:3001';
const socket = io(SOCKET_URL);

function App() {
  const [grid, setGrid] = useState(new Map());
  const [user, setUser] = useState(null);
  const [gridSize, setGridSize] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    socket.on('init', (data) => {
      setGrid(new Map(data.grid));
      setUser(data.user);
      setGridSize(data.gridSize);
      setLeaderboard(data.leaderboard);
    });

    socket.on('block_claimed', (data) => {
      setGrid((prev) => {
        const newGrid = new Map(prev);
        newGrid.set(`${data.x},${data.y}`, { owner: data.owner, color: data.color, timestamp: Date.now() });
        return newGrid;
      });
      // also optimistically update the user's score if it was them
      if (data.owner === socket.id) {
        setUser((prevUser) => {
          // This is handled by the server sending leaderboard, but local update feels faster.
          return prevUser;
        });
      }
    });

    socket.on('leaderboard_update', (lb) => {
      setLeaderboard(lb);
      // Update our own user score based on leaderboard
      const me = lb.find(u => u.id === socket.id);
      if (me) {
        setUser(prev => ({ ...prev, blocks: me.blocks }));
      }
    });

    socket.on('cooldown_error', (data) => {
      setErrorMsg(`Cooldown: wait ${data.timeRemaining}ms`);
      setTimeout(() => setErrorMsg(''), 1000);
    });

    return () => {
      socket.off('init');
      socket.off('block_claimed');
      socket.off('leaderboard_update');
      socket.off('cooldown_error');
    };
  }, []);

  const handleCellClick = useCallback((x, y) => {
    socket.emit('claim_block', { x, y });

    // Optimistic UI update
    setGrid((prev) => {
      const cellId = `${x},${y}`;
      const prevOwner = prev.get(cellId)?.owner;
      if (prevOwner === socket.id) return prev; // Already ours

      const newGrid = new Map(prev);
      newGrid.set(cellId, { owner: socket.id, color: user.color, timestamp: Date.now(), optimistic: true });
      return newGrid;
    });
  }, [user]);

  if (!user || !gridSize) return <div style={{ color: 'white', padding: '2rem', textAlign: 'center', width: '100%' }}><h2>Connecting to Real-Time Grid...</h2></div>;

  return (
    <>
      <UI user={user} leaderboard={leaderboard} errorMsg={errorMsg} />

      <div className="grid-container">
        <TransformWrapper
          initialScale={1}
          minScale={0.2}
          maxScale={4}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          panning={{ velocityMultiplier: 0.5 }}
        >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
            <Grid
              gridSize={gridSize}
              gridData={grid}
              onCellClick={handleCellClick}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </>
  );
}

export default App;
