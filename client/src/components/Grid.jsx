import React, { memo } from 'react';

// Memoized cell for performance
const Cell = memo(({ x, y, data, onClick }) => {
  const isClaimed = !!data;
  const color = data?.color || '';

  return (
    <div 
      className={`grid-cell ${data?.optimistic ? 'claimed' : ''}`}
      style={{ backgroundColor: color || 'rgba(255, 255, 255, 0.1)' }}
      onClick={() => onClick(x, y)}
      title={isClaimed ? `Claimed` : `Empty (${x},${y})`}
    >
      {/* Optional: subtle border if claimed to make it pop */}
      {isClaimed && (
        <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }} />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.data?.owner === nextProps.data?.owner &&
         prevProps.data?.timestamp === nextProps.data?.timestamp;
});

const Grid = ({ gridSize, gridData, onCellClick }) => {
  const cells = [];
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cellId = `${x},${y}`;
      cells.push(
        <Cell 
          key={cellId} 
          x={x} 
          y={y} 
          data={gridData.get(cellId)} 
          onClick={onCellClick} 
        />
      );
    }
  }

  return (
    <div 
      className="grid-board" 
      style={{ 
        gridTemplateColumns: `repeat(${gridSize}, 24px)`,
        gridTemplateRows: `repeat(${gridSize}, 24px)`
      }}
    >
      {cells}
    </div>
  );
};

export default Grid;
