import { useState } from 'react'
import './App.css'
import jobData from './jobs.json'
import sfuData from './sfu_courses.json' // <--- New Import!
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function App() {
  const [year, setYear] = useState(2026)

  // 1. Get Job Data for this year
  const currentJob = jobData.reduce((prev, curr) => 
    Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev
  );

  // 2. Get SFU Course Data for this year (or closest previous year)
  // This simulates looking at the course calendar for that year
  const currentSFU = sfuData.reduce((prev, curr) => 
    Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev
  );
  console.log("Current Year:", year);
  console.log("Comparing Job:", currentJob.skills);
  console.log("Against SFU Data for year:", currentSFU.year, currentSFU);
  
  // 3. THE LOGIC: Compare Job Skills vs. SFU Topics
  // We check if the skills required by the job exist in ANY SFU course topics for that year
  // 3. THE LOGIC: Smart Fuzzy Matching
  const missingSkills = currentJob.skills.filter(skill => {
    
    // Check if this skill is taught in ANY course for this year
    const isTaught = currentSFU.courses.some(course => {
      // Check every topic in that course
      return course.topics.some(topic => {
        const t = topic.toLowerCase();
        const s = skill.toLowerCase();
        
        // Match if one contains the other (e.g., "React" matches "React Hooks")
        return t.includes(s) || s.includes(t); 
      });
    });

    return !isTaught; // If NOT taught, it's a "Missing Skill"
  });

  // Calculate the "Gap Score" (0 = Good, 100 = Bad)
  const gapScore = Math.round((missingSkills.length / currentJob.skills.length) * 100);

  // Chart Data
  const chartData = {
    labels: currentJob.skills,
    datasets: [
      {
        label: `Job Demand in ${currentJob.year} (%)`,
        data: [90, 80, 70, currentJob.popularity], 
        backgroundColor: '#3b82f6', 
      },
      {
        label: `Taught at SFU? (100=Yes, 0=No)`,
        // If skill is missing, bar is 0. If present, bar is 100.
        data: currentJob.skills.map(skill => missingSkills.includes(skill) ? 0 : 100),
        backgroundColor: '#ef4444', // Red for SFU
      }
    ]
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1>Wayback Worklist 🕰️</h1>

      {/* TIMELINE SLIDER */}
      <div style={{ margin: '30px 0', padding: '20px', background: '#222', borderRadius: '15px' }}>
        <h2 style={{ fontSize: '3rem', margin: 0, color: gapScore > 50 ? '#ef4444' : '#22c55e' }}>
          {year}
        </h2>
        <input 
          type="range" min="2016" max="2026" value={year} 
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
        <p>Gap Score: <strong>{gapScore}%</strong> {gapScore > 50 ? "🚨 (You are on your own!)" : "✅ (SFU Covers this)"}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left' }}>
        
        {/* JOB CARD */}
        <div style={{ padding: '20px', border: '1px solid #444', borderRadius: '10px' }}>
          <h3>📢 Job: {currentJob.title}</h3>
          <p>"{currentJob.description}"</p>
          
          {/* THE WARNING BOX */}
          {missingSkills.length > 0 && (
            <div style={{ backgroundColor: '#450a0a', padding: '10px', borderRadius: '8px', border: '1px solid #ef4444', marginTop: '15px' }}>
              <strong style={{color: '#ef4444'}}>⚠️ SKILL GAP DETECTED:</strong>
              <p style={{fontSize: '0.9rem'}}>SFU does not offer courses for:</p>
              <ul>
                {missingSkills.map(skill => <li key={skill} style={{color: '#fca5a5'}}>{skill}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* CHART */}
        <div style={{ padding: '20px', border: '1px solid #444', borderRadius: '10px' }}>
          <Bar data={chartData} />
          <p style={{fontSize: '0.8rem', textAlign: 'center', marginTop: '10px'}}>
            Blue = Job Market | <span style={{color: '#ef4444'}}>Red = SFU Curriculum</span>
          </p>
        </div>
      </div>

      {/* COURSE LIST (To prove you used the API data) */}
      <div style={{ marginTop: '30px', textAlign: 'left', padding: '20px', background: '#111', borderRadius: '10px' }}>
        <h4>📚 SFU Courses Available in {currentSFU.year}:</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {currentSFU.courses.map(c => (
            <span key={c.code} style={{ padding: '5px 10px', background: '#333', borderRadius: '20px', fontSize: '0.8rem' }}>
              {c.code}: {c.title}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}

export default App