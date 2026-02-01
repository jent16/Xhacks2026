import { useState, useEffect, useRef } from 'react';
import jobData from './jobs.json';
import sfuData from './courses.json';
import './App.css';

function App() {
  const [role, setRole] = useState("Full Stack Developer");
  const [year1, setYear1] = useState(2016);
  const [year2, setYear2] = useState(2026);

  const roles = Object.keys(jobData);
  const years = Array.from({ length: 11 }, (_, i) => 2016 + i);

  // 1. Extract SFU skills for a specific year
  const getSFUSkills = (year) => {
    let allSkills = [];
    Object.keys(sfuData).forEach(cat => {
      const sfuYear = Object.keys(sfuData[cat]).reverse().find(y => y <= year) || 2016;
      const courses = sfuData[cat][sfuYear]?.courses_and_skills || [];
      courses.forEach(c => allSkills.push(...c.skills_taught));
    });
    return [...new Set(allSkills)];
  };

  // 2. Recommend SFU courses for matched skills
  const getRecommendedCourses = (matchedSkillsList) => {
    const recommendations = [];
    Object.keys(sfuData).forEach(cat => {
      const sfuYear = Object.keys(sfuData[cat]).reverse().find(y => y <= year2) || 2016;
      const courses = sfuData[cat][sfuYear]?.courses_and_skills || [];
      courses.forEach(course => {
        const hasMatch = course.skills_taught.some(s => 
          matchedSkillsList.some(ms => ms.toLowerCase().includes(s.toLowerCase()))
        );
        if (hasMatch) recommendations.push(`${course.course}: ${course.title}`);
      });
    });
    return [...new Set(recommendations)].slice(0, 3);
  };

  // 3. Core Calculations
  const jobSkills1 = jobData[role][year1] || [];
  const jobSkills2 = jobData[role][year2] || [];
  const sfuSkills = getSFUSkills(year2);

  const matchedSkills = jobSkills2.filter(skill => 
    sfuSkills.some(taught => taught.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(taught.toLowerCase()))
  );
  
  const missingSkills = jobSkills2.filter(skill => !matchedSkills.includes(skill));

  // 4. THE MASSIVE RESOURCE MAP (Expanded for all roles)
  const resourceMap = {
    // Languages
    "Rust": "https://doc.rust-lang.org/book/",
    "TypeScript": "https://www.typescriptlang.org/docs/",
    "Go": "https://go.dev/doc/",
    "Python": "https://docs.python.org/3/",
    "Kotlin": "https://kotlinlang.org/docs/home.html",
    "Swift": "https://developer.apple.com/documentation/swift",
    "C++": "https://en.cppreference.com/w/",
    "C#": "https://learn.microsoft.com/en-us/dotnet/csharp/",
    "Java": "https://dev.java/learn/",

    // Web & Frameworks
    "Next.js": "https://nextjs.org/docs",
    "React": "https://react.dev/",
    "FastAPI": "https://fastapi.tiangolo.com/",
    "Tailwind": "https://tailwindcss.com/docs",
    "Node.js": "https://nodejs.org/en/docs/",
    "Angular": "https://angular.io/docs",
    "Vue": "https://vuejs.org/guide/introduction.html",
    "Express": "https://expressjs.com/",

    // AI & Data
    "LangChain": "https://python.langchain.com/docs/get_started/introduction",
    "Vector DB": "https://www.pinecone.io/learn/vector-database/",
    "Agentic": "https://www.deeplearning.ai/short-courses/ai-agentic-workflows-with-crewai/",
    "LLM": "https://www.deeplearning.ai/short-courses/",
    "PyTorch": "https://pytorch.org/docs/stable/index.html",
    "TensorFlow": "https://www.tensorflow.org/api_docs",
    "Pandas": "https://pandas.pydata.org/docs/",
    "Snowflake": "https://docs.snowflake.com/",
    "BigQuery": "https://cloud.google.com/bigquery/docs",
    "Databricks": "https://docs.databricks.com/",

    // Game Dev & Graphics
    "Unreal": "https://dev.epicgames.com/documentation/en-us/unreal-engine/",
    "Unity": "https://docs.unity3d.com/Manual/index.html",
    "Godot": "https://docs.godotengine.org/en/stable/",
    "Vulkan": "https://www.vulkan.org/",
    "Ray Tracing": "https://developer.nvidia.com/rtx/ray-tracing",
    "Blender": "https://docs.blender.org/manual/en/latest/",

    // Infrastructure & DevOps
    "Docker": "https://docs.docker.com/",
    "Kubernetes": "https://kubernetes.io/docs/home/",
    "Terraform": "https://developer.hashicorp.com/terraform/docs",
    "AWS": "https://docs.aws.amazon.com/",
    "Azure": "https://learn.microsoft.com/en-us/azure/",
    "GitHub Actions": "https://docs.github.com/en/actions",
    "Prometheus": "https://prometheus.io/docs/introduction/overview/",

    // Security
    "Zero Trust": "https://www.nist.gov/publications/zero-trust-architecture",
    "Penetration": "https://www.offsec.com/courses-and-certifications/",
    "Wireshark": "https://www.wireshark.org/docs/",
    "Metasploit": "https://docs.metasploit.com/"
  };

  const studyPlan = missingSkills.map(skill => {
    // 1. Find a match in the resourceMap
    const key = Object.keys(resourceMap).find(k => 
      skill.toLowerCase().includes(k.toLowerCase())
    );
    
    const finalLink = resourceMap[key] 
      ? resourceMap[key] 
      : `https://www.google.com/search?q=${encodeURIComponent(skill)}`;
    
    return {
      name: skill,
      link: finalLink
    };
  });

  const knownRatio = matchedSkills.length;
  const missingRatio = missingSkills.length;
  const matchPercentage = jobSkills2.length > 0 ? Math.round((knownRatio / jobSkills2.length) * 100) : 0;
  const topCourses = getRecommendedCourses(matchedSkills);

  // Theme state with persistence
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); } catch { return 'dark'; }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  // Parallax/tilt effect for cards
  const cardsRef = useRef([]);
  const handleMouseMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cardsRef.current.forEach(card => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotY = x * 8;
      const rotX = y * -6;
      card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    });
  };

  const handleMouseLeave = () => {
    cardsRef.current.forEach(card => {
      if (card) card.style.transform = '';
    });
  };

  return (
    <div className="layout" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <nav className="sidebar">
        <h2>Wayback Worklist 🕰️</h2>
        <div>
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
        </div>
        <div className="theme-toggle">
          <label className="label">Theme</label>
          <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </nav>

      <main className="content">
        <header>
          <h1>{role} Roadmap</h1>
          <p>Analyzing the shift from {year1} to {year2}</p>
        </header>

        <div className="comparison-container">
          <section className="year-card" ref={(el) => { if (el) cardsRef.current[0] = el; }}>
            <h3>Standard in {year1}</h3>
            <ul className="skill-list">
              {jobSkills1.map(s => <li key={s} className="skill-past">{s}</li>)}
            </ul>
          </section>

          <section className="year-card" ref={(el) => { if (el) cardsRef.current[1] = el; }}>
            <h3>Demand in {year2}</h3>
            <ul className="skill-list">
              {jobSkills2.map(skill => {
                const taught = matchedSkills.includes(skill);
                return (
                  <li key={skill} className={taught ? "skill-match" : "skill-gap"}>
                    {skill} <span>{taught ? "✅" : "🚨"}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {studyPlan.length > 0 && (
          <section className="study-plan-section">
            <h3>🚀 Personalized Industry Bridge</h3>
            <p>SFU doesn't teach these yet. Access official documentation to stay ahead:</p>
            <div className="resource-grid">
              {studyPlan.map(item => (
                <a key={item.name} href={item.link} target="_blank" rel="noreferrer" className="resource-card">
                  <div className="resource-info">
                    <span className="resource-name">{item.name}</span>
                    <span className="resource-action">Start Learning ↗</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <footer className="analysis-summary">
          <div className="ratio-dashboard">
            <div className="ratio-stat">
              <span className="big-number">{knownRatio}</span>
              <span className="label">Skills Offered</span>
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
              <h4>📚 Recommended SFU Courses for this Roadmap:</h4>
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