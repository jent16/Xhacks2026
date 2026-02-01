import { useState, useEffect } from 'react';
import './PersonalizedRoadmap.css';

function PersonalizedRoadmap({ careerName, baseRoadmap, getDifficultyColor, getDifficultyIcon }) {
  const [userGoals, setUserGoals] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('10');
  const [learningPace, setLearningPace] = useState('moderate');
  const [personalizedPath, setPersonalizedPath] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePersonalizedPath = () => {
    setIsGenerating(true);
    
    // Simulate AI generation with a sophisticated algorithm
    setTimeout(() => {
      const allNodes = extractAllNodes(baseRoadmap);
      const filteredNodes = filterNodesByUserProfile(allNodes);
      const optimizedPath = createOptimizedPath(filteredNodes);
      
      setPersonalizedPath(optimizedPath);
      setIsGenerating(false);
    }, 1500);
  };

  const extractAllNodes = (node, nodes = []) => {
    nodes.push(node);
    if (node.children) {
      node.children.forEach(child => extractAllNodes(child, nodes));
    }
    return nodes;
  };

  const filterNodesByUserProfile = (nodes) => {
    // Filter based on current skills mentioned
    const skillKeywords = currentSkills.toLowerCase().split(',').map(s => s.trim());
    
    return nodes.filter(node => {
      // Include nodes that match user goals
      if (userGoals && node.title.toLowerCase().includes(userGoals.toLowerCase())) {
        return true;
      }
      
      // Skip nodes user already knows
      const nodeSkills = node.skills.map(s => s.toLowerCase());
      const alreadyKnows = skillKeywords.some(skill => 
        nodeSkills.some(ns => ns.includes(skill) || skill.includes(ns))
      );
      
      if (alreadyKnows && node.difficulty === 'Beginner') {
        return false;
      }
      
      return true;
    });
  };

  const createOptimizedPath = (nodes) => {
    const hoursPerWeek = parseInt(timeAvailable);
    const paceMultiplier = {
      'slow': 1.5,
      'moderate': 1.0,
      'fast': 0.7,
      'intensive': 0.5
    }[learningPace];

    // Create branching paths
    const mainPath = nodes.slice(0, Math.min(5, nodes.length));
    const branchingPaths = [];

    // Generate 2-3 alternative branches
    if (nodes.length > 5) {
      const branch1 = nodes.slice(3, 7);
      const branch2 = nodes.slice(5, 9);
      
      if (branch1.length > 0) branchingPaths.push({
        name: "Alternative Path A",
        description: "Focuses on specialized skills",
        nodes: branch1
      });
      
      if (branch2.length > 0) branchingPaths.push({
        name: "Alternative Path B",
        description: "Emphasizes practical applications",
        nodes: branch2
      });
    }

    return {
      mainPath,
      branchingPaths,
      estimatedWeeks: Math.ceil((mainPath.length * 12) * paceMultiplier / (hoursPerWeek / 10)),
      totalSkills: mainPath.reduce((acc, node) => acc + node.skills.length, 0)
    };
  };

  return (
    <div className="personalized-roadmap">
      <div className="personalization-form">
        <h2>🤖 AI-Powered Personalized Roadmap</h2>
        <p className="form-description">
          Tell us about yourself and we'll create a custom learning path tailored to your goals
        </p>

        <div className="form-grid">
          <div className="form-group">
            <label>Your Career Goals</label>
            <textarea
              value={userGoals}
              onChange={(e) => setUserGoals(e.target.value)}
              placeholder={`E.g., "I want to become a senior ${careerName} specializing in AI/ML"`}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Current Skills (comma-separated)</label>
            <textarea
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              placeholder="E.g., Python, SQL, Basic Statistics, Git"
              rows={2}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Hours/Week Available</label>
              <input
                type="number"
                value={timeAvailable}
                onChange={(e) => setTimeAvailable(e.target.value)}
                min="1"
                max="40"
              />
            </div>

            <div className="form-group">
              <label>Learning Pace</label>
              <select value={learningPace} onChange={(e) => setLearningPace(e.target.value)}>
                <option value="slow">🐢 Slow & Steady</option>
                <option value="moderate">🚶 Moderate</option>
                <option value="fast">🏃 Fast Track</option>
                <option value="intensive">🚀 Intensive</option>
              </select>
            </div>
          </div>

          <button 
            className="generate-btn"
            onClick={generatePersonalizedPath}
            disabled={isGenerating}
          >
            {isGenerating ? '🤖 Generating Your Path...' : '✨ Generate My Personalized Roadmap'}
          </button>
        </div>
      </div>

      {personalizedPath && (
        <div className="generated-roadmap">
          <div className="roadmap-summary">
            <h3>📊 Your Personalized Path Summary</h3>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-icon">⏱️</span>
                <div>
                  <div className="stat-value">{personalizedPath.estimatedWeeks} weeks</div>
                  <div className="stat-label">Estimated Duration</div>
                </div>
              </div>
              <div className="summary-stat">
                <span className="stat-icon">🎯</span>
                <div>
                  <div className="stat-value">{personalizedPath.totalSkills}</div>
                  <div className="stat-label">Skills to Master</div>
                </div>
              </div>
              <div className="summary-stat">
                <span className="stat-icon">📚</span>
                <div>
                  <div className="stat-value">{personalizedPath.mainPath.length}</div>
                  <div className="stat-label">Learning Modules</div>
                </div>
              </div>
            </div>
          </div>

          <div className="main-path-section">
            <h3>🎯 Your Main Learning Path</h3>
            <div className="timeline">
              {personalizedPath.mainPath.map((node, idx) => (
                <div key={node.id} className="timeline-item">
                  <div className="timeline-marker" style={{ backgroundColor: getDifficultyColor(node.difficulty) }}>
                    {idx + 1}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h4>{node.title}</h4>
                      <span className="timeline-badge" style={{ backgroundColor: getDifficultyColor(node.difficulty) }}>
                        {getDifficultyIcon(node.difficulty)} {node.difficulty}
                      </span>
                    </div>
                    <div className="timeline-meta">
                      <span>⏱️ {node.time}</span>
                      <span>📚 {node.skills.length} skills</span>
                    </div>
                    <div className="timeline-skills">
                      {node.skills.map((skill, sidx) => (
                        <span key={sidx} className="timeline-skill-tag">{skill}</span>
                      ))}
                    </div>
                    {node.prerequisites.length > 0 && (
                      <div className="timeline-prereqs">
                        <strong>Prerequisites:</strong> {node.prerequisites.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {personalizedPath.branchingPaths.length > 0 && (
            <div className="branching-paths-section">
              <h3>🌿 Alternative Specialization Paths</h3>
              <p className="branch-description">
                After mastering the fundamentals, you can branch into these specialized areas:
              </p>
              <div className="branches-grid">
                {personalizedPath.branchingPaths.map((branch, bidx) => (
                  <div key={bidx} className="branch-card">
                    <div className="branch-header">
                      <h4>{branch.name}</h4>
                      <p>{branch.description}</p>
                    </div>
                    <div className="branch-nodes">
                      {branch.nodes.map((node, nidx) => (
                        <div key={node.id} className="branch-node">
                          <div className="branch-node-title">
                            {nidx + 1}. {node.title}
                          </div>
                          <div className="branch-node-meta">
                            <span style={{ color: getDifficultyColor(node.difficulty) }}>
                              {node.difficulty}
                            </span>
                            <span>• {node.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button className="action-btn primary">
              📥 Download Roadmap PDF
            </button>
            <button className="action-btn secondary">
              📧 Email Me This Plan
            </button>
            <button className="action-btn secondary">
              🔗 Share with Friends
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonalizedRoadmap;
