// src/components/GameCard.jsx
import React from 'react';

const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      <div className="game-header">
        <h3 className="game-name">{game.name}</h3>
        {game.category && game.category !== "None" && (
          <span className="game-category">{game.category}</span>
        )}
      </div>
      
      <div className="game-details">
        <div className="game-detail-item">
          <span className="detail-label">⏱️ Время:</span>
          <span className="detail-value">{game.timeToBeat}</span>
        </div>
        <div className="game-detail-item">
          <span className="detail-label">🎲 Кубики:</span>
          <span className="detail-value">{game.dices}</span>
        </div>
      </div>

      <div className="game-tags">
        {game.tags.map((tag, index) => (
          <span key={index} className="game-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GameCard;