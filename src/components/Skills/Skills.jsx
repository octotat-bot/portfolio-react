import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaGitAlt, FaPython } from 'react-icons/fa';
import SectionParticles from '../UI/SectionParticles';
import '../UI/SectionParticles.css';
import './Skills.css';

const Skills = () => {
  const skillsRef = useRef(null);
  const svgRef = useRef(null);
  const isInView = useInView(skillsRef, { once: true, amount: 0.2 });
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Generate particles along active paths
  useEffect(() => {
    if (!activePath || !svgRef.current) return;
    
    // Create particles along active paths
    const newParticles = [];
    const svgElement = svgRef.current;
    const svgRect = svgElement.getBoundingClientRect();
    
    activePath.forEach(connection => {
      const fromSkill = skills.find(s => s.name === connection.from);
      const toSkill = skills.find(s => s.name === connection.to);
      
      if (!fromSkill || !toSkill) return;

      // Get path coordinates 
      const x1 = 200 + (fromSkill.position.col * 250);
      const y1 = 150 + (fromSkill.position.row * 280);
      const x2 = 200 + (toSkill.position.col * 250);
      const y2 = 150 + (toSkill.position.row * 280);
   
      // Create particles
      for (let i = 0; i < 3; i++) {
        newParticles.push({
          id: `particle-${connection.from}-${connection.to}-${i}`,
          x1, y1, x2, y2,
          progress: Math.random(),
          speed: 0.005 + Math.random() * 0.01,
          size: 2 + Math.random() * 3,
          color: fromSkill.color
        });
      }
    });
        
    setParticles(newParticles);
    
    // Animate particles
    let animationFrameId;
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Update progress
          let progress = particle.progress + particle.speed;
          if (progress > 1) progress = 0;
          
          return {
            ...particle,
            progress
          };
        })
      );
      
      animationFrameId = requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      setParticles([]);
    };
  }, [activePath]);
  
  // Track mouse position for 3D effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setMousePos({ x: clientX, y: clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: i * 0.1
      }
    })
  };
    
  const skills = [
    { 
      name: 'HTML5', 
      icon: <FaHtml5 />, 
      color: '#E44D26',
      description: 'Semantic markup, forms, accessibility, and modern HTML features',
      projects: 'Used in multiple portfolio projects and web applications',
      position: { row: 0, col: 0 }
    },
    { 
      name: 'CSS3', 
      icon: <FaCss3Alt />, 
      color: '#264DE4',
      description: 'Flexbox, Grid, animations, and responsive design techniques',
      projects: 'Styling for interactive UIs and responsive layouts',
      position: { row: 0, col: 2 }
    },
    { 
      name: 'JavaScript', 
      icon: <FaJs />, 
      color: '#F7DF1E',
      description: 'ES6+, DOM manipulation, async programming with Promises',
      projects: 'Interactive features and frontend functionality',
      position: { row: 1, col: 1 }
    },
    { 
      name: 'React', 
      icon: <FaReact />, 
      color: '#61DAFB',
      description: 'Hooks, state management, component architecture, and React Router',
      projects: 'Building interactive single-page applications',
      position: { row: 2, col: 0 }
    },
    { 
      name: 'Git', 
      icon: <FaGitAlt />, 
      color: '#F05032',
      description: 'Version control, branching strategies, and collaboration workflows',
      projects: 'Used for version control on all development projects',
      position: { row: 1, col: 3 }
    },
    { 
      name: 'Python', 
      icon: <FaPython />, 
      color: '#3776AB',
      description: 'Basic syntax, data structures, automation scripts, and fundamentals',
      projects: 'Simple automation scripts and learning projects',
      position: { row: 2, col: 2 }
    }
  ];

  // Define connections between skills
  const connections = [
    { from: 'HTML5', to: 'CSS3' },
    { from: 'HTML5', to: 'JavaScript' },
    { from: 'CSS3', to: 'JavaScript' },
    { from: 'JavaScript', to: 'React' },
    { from: 'JavaScript', to: 'Python' },
    { from: 'React', to: 'Git' },
    { from: 'Git', to: 'Python' }
  ];

  // Handler for skill hover that highlights connected paths
  const handleSkillHover = (skillName) => {
    setHoveredSkill(skillName);
    const connectedPaths = connections.filter(
      conn => conn.from === skillName || conn.to === skillName
    );
    setActivePath(connectedPaths);
  };

  return (
    <section id="skills" className="skills section-with-particles" ref={skillsRef}>
      <SectionParticles type="skills" color="#264DE4" />
      
      <div className="container skills-container">
        <motion.div
          className="section-header"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 className="section-title" variants={itemVariants}>Skills</motion.h2>
          <motion.div className="section-subtitle terminal-text" variants={itemVariants}>
            My Technical Arsenal
          </motion.div>
        </motion.div>

        <div className="skills-content">
          <div className="skills-grid-container">
            <div className="skills-3d-perspective" 
              style={{ 
                transform: mousePos.x ? 
                  `rotateY(${(mousePos.x / window.innerWidth - 0.5) * 10}deg) 
                   rotateX(${(mousePos.y / window.innerHeight - 0.5) * -10}deg)` : 
                  'none'
              }}
            >
              <div className="skills-circuit-background">
                <svg className="circuit-svg" viewBox="0 0 1000 900" preserveAspectRatio="xMidYMid meet" ref={svgRef}>
                  {/* Circuit board grid lines */}
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(12, 255, 119, 0.1)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Connection paths */}
                  {connections.map((connection, idx) => {
                    const fromSkill = skills.find(s => s.name === connection.from);
                    const toSkill = skills.find(s => s.name === connection.to);
                    
                    if (!fromSkill || !toSkill) return null;
                    
                    // Calculate SVG path coordinates based on grid positions
                    const x1 = 200 + (fromSkill.position.col * 250);
                    const y1 = 150 + (fromSkill.position.row * 280);
                    const x2 = 200 + (toSkill.position.col * 250);
                    const y2 = 150 + (toSkill.position.row * 280);
                    
                    // Create a slightly curved path
                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2 - 30;
                    
                    const isActive = activePath?.some(
                      p => (p.from === connection.from && p.to === connection.to) ||
                           (p.from === connection.to && p.to === connection.from)
                    );
                    
                    return (
                      <g key={`connection-${idx}`}>
                        <path
                          d={`M${x1},${y1} Q${midX},${midY} ${x2},${y2}`}
                          className={`circuit-path ${isActive ? 'active' : ''}`}
                          style={{ 
                            stroke: isActive ? 
                              `var(--primary-color)` : 
                              'rgba(var(--accent-rgb), 0.2)',
                            strokeDasharray: isActive ? '5,0' : '5,5'
                          }}
                        />
                        {/* Add circuit nodes at key points */}
                        <circle
                          cx={midX} 
                          cy={midY} 
                          r="4" 
                          className={`circuit-node ${isActive ? 'active' : ''}`}
                          style={{ 
                            fill: isActive ? 
                              'var(--primary-color)' : 
                              'rgba(var(--accent-rgb), 0.3)' 
                          }}
                        />
                      </g>
                    );
                  })}
                  
                  {/* Moving particles */}
                  {particles.map(particle => {
                    // Calculate current position based on progress
                    const t = particle.progress;
                    const x = particle.x1 + (particle.x2 - particle.x1) * t;
                    const y = particle.y1 + (particle.y2 - particle.y1) * t - Math.sin(t * Math.PI) * 30;
                    
                    return (
                      <circle
                        key={particle.id}
                        cx={x}
                        cy={y}
                        r={particle.size}
                        fill={particle.color}
                        className="circuit-particle"
                      />
                    );
                  })}
                </svg>
              </div>

              <motion.div
                className="skills-grid"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {skills.map((skill, index) => (
                  <motion.div
                    className={`skill-hex ${hoveredSkill === skill.name ? 'active' : ''}`}
                    key={skill.name}
                    custom={index}
                    variants={itemVariants}
                    style={{
                      '--skill-accent-color': skill.color,
                      gridRow: skill.position.row + 1,
                      gridColumn: skill.position.col + 1,
                      transform: hoveredSkill === skill.name ? 
                        'scale(1.05) translateZ(40px)' : 
                        'translateZ(20px)'
                    }}
                    onMouseEnter={() => handleSkillHover(skill.name)}
                    onMouseLeave={() => {
                      setHoveredSkill(null);
                      setActivePath(null);
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="skill-hex-inner">
                      <div className="skill-hex-content">
                        <div 
                          className="skill-icon" 
                          style={{ color: skill.color }}
                        >
                          {skill.icon}
                          <div className="skill-icon-orbit"></div>
                        </div>
                        <h3 className="skill-name">{skill.name}</h3>
                        <div className="skill-details">
                          <div className="skill-description">
                            <p>{skill.description}</p>
                          </div>
                          <div className="skill-projects">
                            <h4>Projects:</h4>
                            <p>{skill.projects}</p>
                          </div>
                        </div>
                      </div>
                      <div className="skill-hex-glow"></div>
                      <div className="skill-hex-shine"></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          <motion.div 
            className="skills-side-content"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="terminal-button"></span>
                  <span className="terminal-button"></span>
                  <span className="terminal-button"></span>
                </div>
                <div className="terminal-title">skills.min.js</div>
              </div>
              <div className="terminal-body">
                <div className="terminal-line">
                  <span className="terminal-prompt">mukund@portfolio:~$</span> node skills.min.js
                </div>
                <div className="terminal-output">
                  <pre className="skills-code">
{`const dev={
  front:["HTML","CSS","JS","React"],
  back:["Node"],
  tools:"Git",
  other:"Python",
  learning:true
};

const stats={solved:"150+",leetcode:"25+"};

setInterval(()=>console.log("Growing..."),86400000);`}</pre>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prompt">mukund@portfolio:~$</span> <span className="terminal-cursor">_</span>
                </div>
              </div>
            </div>

            <motion.div 
              className="leetcode-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="leetcode-header">
                <div className="leetcode-icon">
                  <span className="code-bracket">{`{`}</span>
                  <span className="code-symbol">#</span>
                  <span className="code-bracket">{`}`}</span>
                </div>
                <h3>LeetCode Mastery</h3>
              </div>
              <div className="leetcode-content">
                <ul>
                  <li>Solved <span className="highlight">150+</span> LeetCode questions</li>
                  <li>Completed <span className="highlight">25+</span> questions in under 3 hours</li>
                  <li>Proficient in data structures and algorithms</li>
                </ul>
                <a href="https://leetcode.com/mukundmangla/" target="_blank" rel="noopener noreferrer" className="leetcode-profile-link">
                  View My Profile <span className="leetcode-arrow">→</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills; 