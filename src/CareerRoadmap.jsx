import { useState } from 'react';
import careerPaths from './careerPaths.json';
import RoadmapNode from './RoadmapNode';
import PersonalizedRoadmap from './PersonalizedRoadmap';
import './CareerRoadmap.css';

function CareerRoadmap() {
  const [selectedCareer, setSelectedCareer] = useState('Data Scientist');
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'personalized'
  const careerNames = Object.keys(careerPaths);
  const currentCareer = careerPaths[selectedCareer];

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': '#4ade80',
      'Intermediate': '#3b82f6',
      'Hard': '#f59e0b',
      'Very Hard': '#f87171',
      'Advanced': '#a855f7',
      'Expert': '#ec4899'
    };
    return colors[difficulty] || '#6b7280';
  };

  const getDifficultyIcon = (difficulty) => {
    const icons = {
      'Beginner': '🌱',
      'Intermediate': '📚',
      'Hard': '🔥',
      'Very Hard': '💪',
      'Advanced': '🚀',
      'Expert': '👑'
    };
    return icons[difficulty] || '📌';
  };

  return (
    <div className="career-roadmap-container">
      <div className="roadmap-header">
        <div className="header-content">
          <h1>🗺️ Career Path Roadmaps</h1>
          <p>Visualize your journey from beginner to expert with structured learning paths</p>
        </div>

        <div className="controls-section">
          <div className="career-selector">
            <label>Choose Your Path</label>
            <select 
              value={selectedCareer} 
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="career-select"
            >
              {careerNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div className="view-toggle">
            <button 
              className={viewMode === 'tree' ? 'active' : ''}
              onClick={() => setViewMode('tree')}
            >
              🌳 Tree View
            </button>
            <button 
              className={viewMode === 'personalized' ? 'active' : ''}
              onClick={() => setViewMode('personalized')}
            >
              🤖 AI Personalized
            </button>
          </div>
        </div>

        <div className="career-overview">
          <div className="overview-item">
            <span className="overview-label">Description</span>
            <span className="overview-value">{currentCareer.description}</span>
          </div>
          <div className="overview-stats">
            <div className="stat">
              <span className="stat-icon">{getDifficultyIcon(currentCareer.difficulty)}</span>
              <span className="stat-label">Difficulty</span>
              <span 
                className="stat-value"
                style={{ color: getDifficultyColor(currentCareer.difficulty) }}
              >
                {currentCareer.difficulty}
              </span>
            </div>
            <div className="stat">
              <span className="stat-icon">⏱️</span>
              <span className="stat-label">Total Time</span>
              <span className="stat-value">{currentCareer.totalTime}</span>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'tree' ? (
        <div className="roadmap-tree">
          <div className="tree-legend">
            <h4>Legend</h4>
            <div className="legend-items">
              <span className="legend-item">
                <span className="legend-dot beginner"></span> Beginner
              </span>
              <span className="legend-item">
                <span className="legend-dot intermediate"></span> Intermediate
              </span>
              <span className="legend-item">
                <span className="legend-dot hard"></span> Hard
              </span>
              <span className="legend-item">
                <span className="legend-dot very-hard"></span> Very Hard
              </span>
              <span className="legend-item">
                <span className="legend-dot advanced"></span> Advanced
              </span>
              <span className="legend-item">
                <span className="legend-dot expert"></span> Expert
              </span>
            </div>
          </div>
          
          <div className="tree-container">
            <RoadmapNode 
              node={currentCareer.roadmap} 
              isRoot={true}
              getDifficultyColor={getDifficultyColor}
            />
          </div>
        </div>
      ) : (
        <PersonalizedRoadmap 
          careerName={selectedCareer}
          baseRoadmap={currentCareer.roadmap}
          getDifficultyColor={getDifficultyColor}
          getDifficultyIcon={getDifficultyIcon}
        />
      )}
    </div>
  );
}

export default CareerRoadmap;
