import React from 'react';
import { User, Trophy, AlertCircle } from 'lucide-react';

const UI = ({ user, leaderboard, errorMsg }) => {
  return (
    <div className="ui-layer">
      {/* Left side: Player Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: user.color,
              boxShadow: `0 0 10px ${user.color}`
            }}
          />
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>You</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{user.name}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={18} color={user.color} />
          <span><strong style={{ fontSize: '1.2rem', color: user.color }}>{user.blocks}</strong> blocks</span>
        </div>

        {errorMsg && (
          <div className="glass-panel" style={{ border: '1px solid #ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Right side: Leaderboard */}
      <div className="glass-panel" style={{ minWidth: '250px', maxHeight: 'calc(100vh - 3rem)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
          <Trophy size={20} color="#fbbf24" />
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Leaderboard</h2>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {leaderboard.length === 0 ? (
            <div style={{ opacity: 0.5, textAlign: 'center' }}>No players yet</div>
          ) : (
            leaderboard.map((player, index) => (
              <div
                key={player.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  backgroundColor: player.id === user.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ opacity: 0.5, width: '16px' }}>{index + 1}.</span>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: player.color }} />
                  <span style={{ fontWeight: player.id === user.id ? 'bold' : 'normal' }}>{player.name}</span>
                </div>
                <span style={{ fontWeight: 'bold' }}>{player.blocks}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UI;
