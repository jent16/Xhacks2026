import { useState } from 'react';
import jobData from './jobs.json';
import sfuData from './courses.json';
import './App.css';

function App() {
  const [role, setRole] = useState("Full Stack Developer");
  const [year1, setYear1] = useState(2016);
  const [year2, setYear2] = useState(2026);

  const roles = Object.keys(jobData);
  const years = Array.from({ length: 11 }, (_, i) => 2016 + i);

  // Logic to find all SFU skills taught in a specific year
  const getSFUSkills = (year) => {
    let allSkills = [];
    Object.keys(sfuData).forEach(cat => {
      const sfuYear = Object.keys(sfuData[cat]).reverse().find(y => y <= year) || 2016;
      const courses = sfuData[cat][sfuYear]?.courses_and_skills || [];
      courses.forEach(c => allSkills.push(...c.skills_taught));
    });
    return [...new Set(allSkills)];
  };

  // Logic for Course Recommendations
  const getRecommendedCourses = (missingSkillsList) => {
    const recommendations = [];
    Object.keys(sfuData).forEach(cat => {
      const sfuYear = Object.keys(sfuData[cat]).reverse().find(y => y <= year2) || 2016;
      const courses = sfuData[cat][sfuYear]?.courses_and_skills || [];
      courses.forEach(course => {
        const hasMatch = course.skills_taught.some(s => 
          missingSkillsList.some(ms => ms.toLowerCase().includes(s.toLowerCase()))
        );
        if (hasMatch) recommendations.push(`${course.course}: ${course.title}`);
      });
    });
    return [...new Set(recommendations)].slice(0, 3);
  };

  const jobSkills1 = jobData[role][year1] || [];
  const jobSkills2 = jobData[role][year2] || [];
  const sfuSkills = getSFUSkills(year2);

  const matchedSkills = jobSkills2.filter(skill => 
    sfuSkills.some(taught => taught.toLowerCase().includes(skill.toLowerCase()))
  );
  const missingSkills = jobSkills2.filter(skill => 
    !sfuSkills.some(taught => taught.toLowerCase().includes(skill.toLowerCase()))
  );

  const knownRatio = matchedSkills.length;
  const missingRatio = missingSkills.length;
  const matchPercentage = jobSkills2.length > 0 ? Math.round((knownRatio / jobSkills2.length) * 100) : 0;
  const topCourses = getRecommendedCourses(matchedSkills); // Recommends courses based on target skills

  return (
    <div className="layout">
      <nav className="sidebar">
        <h2>Wayback Worklist</h2>
        <div className="input-group">
          <label>Career Path</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Starting Point</label>
          <select value={year1} onChange={(e) => setYear1(Number(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Future Horizon</label>
          <select value={year2} onChange={(e) => setYear2(Number(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </nav>

      <main className="content">
        <header>
          <h1>{role} Roadmap</h1>
          <p>Analyzing the shift from {year1} to {year2}</p>
        </header>

        <div className="comparison-container">
          <section className="year-card">
            <h3>Standard in {year1}</h3>
            <ul className="skill-list">
              {jobSkills1.map(s => <li key={s} className="skill-past">{s}</li>)}
            </ul>
          </section>

          <div className="divider">➔</div>

          <section className="year-card">
            <h3>Demand in {year2}</h3>
            <ul className="skill-list">
              {jobSkills2.map(skill => {
                const taught = sfuSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()));
                return (
                  <li key={skill} className={taught ? "skill-match" : "skill-gap"}>
                    {skill} <span>{taught ? "✅" : "🚨"}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <footer className="analysis-summary">
          <div className="ratio-dashboard">
            <div className="ratio-stat">
              <span className="big-number">{knownRatio}</span>
              <span className="label">Skills Known</span>
            </div>
            <div className="ratio-divider">vs</div>
            <div className="ratio-stat">
              <span className="big-number" style={{ color: '#f87171' }}>{missingRatio}</span>
              <span className="label">Skills Missing</span>
            </div>
          </div>

          <div className="progress-container">
            <div className="progress-bar" style={{ 
                width: `${matchPercentage}%`,
                backgroundColor: matchPercentage > 70 ? '#4ade80' : matchPercentage > 40 ? '#f59e0b' : '#f87171'
            }}>
              {matchPercentage}% Ready
            </div>
          </div>

          {topCourses.length > 0 && (
            <div className="recommendation-box">
              <h4>📚 Recommended SFU Courses:</h4>
              <ul>
                {topCourses.map(c => <li key={c}>{c}</li>)}
              </ul>
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}

export default App;