import React from 'react';
import humanBodyImage from '../assets/human_body.png';
import './BodyDiagram.css';

const BodyDiagram = ({ selectedPart, onPartSelect }) => {
  const bodyParts = [
    { id: 'head', name: 'Head', bodyX: 50, bodyY: 18, labelX: 50, labelY: 5, arrowDirection: 'down' },
    { id: 'chest', name: 'Chest', bodyX: 50, bodyY: 35, labelX: 85, labelY: 35, arrowDirection: 'left' },
    { id: 'abdomen', name: 'Abdomen', bodyX: 50, bodyY: 52, labelX: 50, labelY: 95, arrowDirection: 'up' },
    { id: 'arms', name: 'Arms', bodyX: 20, bodyY: 40, labelX: 5, labelY: 40, arrowDirection: 'right' },
    { id: 'legs', name: 'Legs', bodyX: 50, bodyY: 75, labelX: 15, labelY: 85, arrowDirection: 'right' },
    { id: 'skin', name: 'Skin', bodyX: 80, bodyY: 45, labelX: 95, labelY: 60, arrowDirection: 'left' }
  ];

  return (
    <div className="body-diagram">
      <div className="diagram-container">
        <div className="body-image-wrapper">
          <img src={humanBodyImage} alt="Human Body" className="body-image" />
          
          {/* Clickable hotspots */}
          {bodyParts.map(part => (
            <div
              key={part.id}
              className={`body-hotspot ${selectedPart === part.id ? 'selected' : ''}`}
              style={{ left: `${part.bodyX}%`, top: `${part.bodyY}%` }}
              onClick={() => onPartSelect(part.id)}
            >
              <div className="hotspot-dot"></div>
            </div>
          ))}
          
          {/* External labels with arrows */}
          {bodyParts.map(part => (
            <div
              key={`label-${part.id}`}
              className={`body-label ${selectedPart === part.id ? 'selected' : ''}`}
              style={{ left: `${part.labelX}%`, top: `${part.labelY}%` }}
              onClick={() => onPartSelect(part.id)}
            >
              <div className="label-text">{part.name}</div>
              <svg className={`arrow arrow-${part.arrowDirection}`} width="20" height="20" viewBox="0 0 20 20">
                {part.arrowDirection === 'down' && <path d="M10 2 L10 15 M6 11 L10 15 L14 11" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>}
                {part.arrowDirection === 'up' && <path d="M10 18 L10 5 M6 9 L10 5 L14 9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>}
                {part.arrowDirection === 'left' && <path d="M18 10 L5 10 M9 6 L5 10 L9 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>}
                {part.arrowDirection === 'right' && <path d="M2 10 L15 10 M11 6 L15 10 L11 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>}
              </svg>
            </div>
          ))}
        </div>
      </div>
      
      <div className="diagram-legend">
        <h4>Click on body parts to find specialists</h4>
        <div className="legend-items">
          {bodyParts.map(part => (
            <div 
              key={part.id}
              className={`legend-item ${selectedPart === part.id ? 'active' : ''}`}
              onClick={() => onPartSelect(part.id)}
            >
              <span className="legend-dot"></span>
              <span>{part.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BodyDiagram;