import { useState } from 'react';
import './RoadmapNode.css';

function RoadmapNode({ node, isRoot = false, getDifficultyColor, depth = 0 }) {
  const [isExpanded, setIsExpanded] = useState(isRoot || depth < 2);
  const [isCompleted, setIsCompleted] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleComplete = (e) => {
    e.stopPropagation();
    setIsCompleted(!isCompleted);
  };

  const difficultyClass = node.difficulty?.toLowerCase().replace(/\s+/g, '-') || 'beginner';

  return (
    <div className={`roadmap-node-container ${isRoot ? 'root-node' : ''}`}>
      <div 
        className={`roadmap-node ${difficultyClass} ${isCompleted ? 'completed' : ''} ${hasChildren ? 'has-children' : 'leaf-node'}`}
        onClick={handleToggle}
        style={{ 
          borderColor: getDifficultyColor(node.difficulty),
          cursor: hasChildren ? 'pointer' : 'default'
        }}
      >
        <div className="node-header">
          <div className="node-title-section">
            {hasChildren && (
              <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                ▶
              </span>
            )}
            <h3 className="node-title">{node.title}</h3>
            <button 
              className={`complete-checkbox ${isCompleted ? 'checked' : ''}`}
              onClick={handleComplete}
              title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {isCompleted ? '✓' : ''}
            </button>
          </div>
        </div>

        <div className="node-content">
          <div className="node-meta">
            <span className="meta-badge time">
              ⏱️ {node.time}
            </span>
            <span 
              className="meta-badge difficulty"
              style={{ backgroundColor: getDifficultyColor(node.difficulty) }}
            >
              {node.difficulty}
            </span>
          </div>

          <div className="node-skills">
            <span className="skills-label">Skills:</span>
            <div className="skills-tags">
              {node.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          {node.prerequisites && node.prerequisites.length > 0 && (
            <div className="node-prerequisites">
              <span className="prereq-label">Prerequisites:</span>
              <div className="prereq-list">
                {node.prerequisites.map((prereq, idx) => (
                  <span key={idx} className="prereq-item">🔑 {prereq}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="node-children">
          {node.children.map((child, idx) => (
            <div key={child.id} className="child-wrapper">
              <div className="connection-line"></div>
              <RoadmapNode 
                node={child} 
                getDifficultyColor={getDifficultyColor}
                depth={depth + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RoadmapNode;
