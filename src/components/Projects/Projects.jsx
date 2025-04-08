import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaTerminal, FaCode, FaChevronRight, FaArrowRight, FaFolder, FaFolderOpen } from 'react-icons/fa';
import './Projects.css';

const projectsData = [
  {
    id: 1,
    title: "Expense Tracker",
    description: "A comprehensive expense tracking application with visualization and budgeting features.",
    tags: ["Web App", "React"],
    githubLink: "https://github.com/mukundmangla/expense-tracker",
    demoLink: "https://expense-tracker-demo.vercel.app",
    technologies: ["React", "Chart.js", "Firebase"],
    features: [
      "Real-time data synchronization",
      "Interactive charts and graphs for expense visualization",
      "Budget setting and notifications",
      "Categorization of expenses",
      "Monthly and yearly reports"
    ],
    colors: {
      primary: "12, 255, 119", // Green
      secondary: "50, 200, 100"
    }
  },
  {
    id: 2,
    title: "Task Manager ",
    description: "A modern, intuitive task management application designed to help users organize their daily activities efficiently, with a focus on simplicity and visual appeal.",
    tags: ["Frontend"],
    githubLink: "https://github.com/octotat-bot/task-manager-app",
    demoLink: "https://task-manager-app-rosy-kappa.vercel.app/",
    technologies: ["React", "HTML", "CSS", "JavaScript"],
    features: [
      "Task creation with optional descriptions and due dates",
      "Smart filtering and sorting (by date, alphabetically, creation time)",
      "Responsive design with animations and visual feedback",
      "Status indicators for task priority and due dates",
      
    ],
    colors: {
      primary: "12, 140, 255", // Blue
      secondary: "50, 100, 200"
    }
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "A personal portfolio website showcasing projects and skills with interactive elements.",
    tags: ["Web App", "Frontend"],
    githubLink: "https://github.com/mukundmangla/portfolio",
    demoLink: "https://mukundmangla.dev",
    technologies: ["React", "JavaScript", "CSS3", "HTML5"],
    features: [
      "Responsive design for all devices",
      "Advanced animations and transitions",
      "Interactive project showcase",
      "Dark/Light mode toggle",
      "Contact form with validation"
    ],
    colors: {
      primary: "184, 12, 255", // Purple
      secondary: "150, 50, 200"
    }
  },
  {
    id: 4,
    title: "Weather Dashboard",
    description: "A weather application with forecasts, location-based searches, and interactive maps.",
    tags: ["Web App", "API Integration"],
    githubLink: "https://github.com/mukundmangla/weather-dashboard",
    demoLink: "https://weather-dashboard-mukundmangla.vercel.app/",
    technologies: ["OpenWeatherMap API", "Javascript", "HTML", "CSS"],
    features: [
      "Current weather and 5-day Real-time weather data for any location with geolocation support",
      "Location-based weather 5-day forecast with detailed metrics (temperature, humidity, wind, pressure)",
      "Dynamic UI that changes based on weather conditions (rain, snow, clear, etc.)",
      "Interactive weather animations and particle effects",
      "Day/night mode adaptation and responsive design for all devices",
      "Temperature unit toggle between Celsius and Fahrenheit"
    ],
    colors: {
      primary: "255, 100, 12", // Orange
      secondary: "200, 100, 50"
    }
  }
];

// Animated typing effect component
const TerminalText = ({ text, speed = 50, className = "", onComplete = () => {} }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);
  
  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && <span className="terminal-cursor"></span>}
    </span>
  );
};

// Digital Rain background effect
const DigitalRain = () => {
  return (
    <div className="digital-rain-container">
      {Array.from({ length: 30 }).map((_, i) => (
        <div 
          key={i} 
          className="rain-column"
          style={{ 
            left: `${Math.random() * 100}%`, 
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        >
          {Array.from({ length: Math.floor(Math.random() * 20) + 10 }).map((_, j) => (
            <span 
              key={j} 
              className="rain-char"
              style={{ 
                animationDelay: `${Math.random() * 5}s`,
                color: `rgba(0, ${Math.random() * 155 + 100}, 0, ${Math.random() * 0.5 + 0.5})`
              }}
            >
              {String.fromCharCode(Math.random() > 0.5 ? Math.floor(Math.random() * 26) + 65 : Math.floor(Math.random() * 10) + 48)}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

// Terminal Project Component
const TerminalProject = ({ project, index, isActive, setActiveProject }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const detailsRef = useRef(null);
  
  useEffect(() => {
    if (isActive && !showDetails) {
      setShowDetails(true);
      setLoadingStage(0);
    } else if (!isActive && showDetails) {
      setShowDetails(false);
    }
  }, [isActive, showDetails]);
  
  const handleStageComplete = () => {
    setLoadingStage(prev => prev + 1);
  };
  
  const handleClick = (e) => {
    e.stopPropagation();
    setActiveProject(isActive ? null : project.id);
  };
  
  return (
    <motion.div
      className="terminal-project"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="terminal-header">
        <div className="terminal-file-name">
          <span className="file-dot"></span>
          <span>project_{project.id}.sh</span>
        </div>
      </div>
      
      <div className="terminal-body" onClick={handleClick}>
        <div className="command-line">
          <span className="prompt">mukund@portfolio:~/projects$</span>
          <span className="command">{isActive ? " cat " : " ls -la "}</span>
          <span className="command-arg">{project.title.toLowerCase().replace(/\s+/g, '-')}{isActive ? ".md" : ""}</span>
        </div>
        
        <div className="terminal-output">
          {!isActive ? (
            <div className="project-summary">
              <div className="folder-icon">
                <FaFolder className="folder-closed" />
                <FaFolderOpen className="folder-open" />
              </div>
              
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                
                <div className="project-tags">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="project-tag" style={{ '--tag-color': `rgb(${project.colors.primary})` }}>
                      #{tag.toLowerCase().replace(/\s+/g, '-')}
                    </span>
                  ))}
                </div>
                
                <div className="view-more">
                  <span className="prompt-char">$</span> run view-details.sh
                </div>
              </div>
            </div>
          ) : (
            <div className="project-details" ref={detailsRef}>
              <AnimatePresence>
                {loadingStage >= 0 && (
                  <motion.div
                    className="loading-section"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="command-line">
                      <span className="prompt">mukund@portfolio:~/projects$</span>
                      <TerminalText 
                        text={` loading ${project.title.toLowerCase().replace(/\s+/g, '-')}_details...`}
                        speed={20}
                        onComplete={handleStageComplete}
                      />
                    </div>
                  </motion.div>
                )}
                
                {loadingStage >= 1 && (
                  <motion.div 
                    className="details-section"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="section-divider">
                      <span className="divider-text">// Technologies</span>
                      <div className="divider-line"></div>
                    </div>
                    
                    <div className="tech-stack">
                      {project.technologies.map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="tech-item"
                          style={{ '--tech-color': `rgb(${project.colors.primary})` }}
                        >
                          <span className="tech-icon">⟢</span> {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="section-divider">
                      <span className="divider-text">// Features</span>
                      <div className="divider-line"></div>
                    </div>
                    
                    <ul className="features-list">
                      {project.features.map((feature, idx) => (
                        <li key={idx}>
                          <span className="feature-bullet">⟢</span> {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="project-links">
                      <motion.a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link github"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="link-command">git clone</span>
                        <FaGithub className="link-icon" />
                        <span className="link-label">View Source</span>
                      </motion.a>
                      
                      <motion.a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link demo"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="link-command">npm start</span>
                        <FaExternalLinkAlt className="link-icon" />
                        <span className="link-label">Live Demo</span>
                      </motion.a>
                    </div>
                    
                    <div className="close-terminal" onClick={handleClick}>
                      <span className="prompt-char">$</span> exit
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [showInitialCommand, setShowInitialCommand] = useState(true);
  const [commandStage, setCommandStage] = useState(0);
  
  useEffect(() => {
    if (commandStage === 0) {
      const timer = setTimeout(() => {
        setCommandStage(1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [commandStage]);
  
  const handleCommandComplete = () => {
    setShowInitialCommand(false);
  };
  
  return (
    <section id="projects" className="projects">
      <DigitalRain />
      
      <div className="matrix-overlay"></div>
      
      <div className="container">
        <div className="main-terminal">
          <div className="main-terminal-header">
            <div className="terminal-buttons">
              <div className="terminal-button close"></div>
              <div className="terminal-button minimize"></div>
              <div className="terminal-button maximize"></div>
            </div>
            <div className="terminal-title">projects.sh</div>
          </div>
          
          <div className="main-terminal-body">
            {showInitialCommand ? (
              <div className="intro-commands">
                <div className="command-line">
                  <span className="prompt">mukund@portfolio:~$</span>
                  <TerminalText 
                    text=" cd projects"
                    speed={80}
                    onComplete={() => setCommandStage(2)}
                  />
                </div>
                
                {commandStage >= 2 && (
                  <div className="command-line">
                    <span className="prompt">mukund@portfolio:~/projects$</span>
                    <TerminalText 
                      text=" ls -la | grep 'showcase'"
                      speed={50}
                      onComplete={() => setCommandStage(3)}
                    />
                  </div>
                )}
                
                {commandStage >= 3 && (
                  <div className="command-line">
                    <span className="prompt">mukund@portfolio:~/projects$</span>
                    <TerminalText 
                      text=" ./showcase.sh --interactive"
                      speed={50}
                      onComplete={handleCommandComplete}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="section-title-container">
                  <FaTerminal className="section-icon" />
                  <h2 className="section-title">PROJECT SHOWCASE</h2>
                  <div className="title-underline"></div>
                </div>
                
                <p className="section-subtitle">
                  <span className="comment">// Explore my coding journey through these highlighted projects</span>
                </p>
                
                <div className="projects-grid">
                  <AnimatePresence>
                    {projectsData.map((project, index) => (
                      <TerminalProject
                        key={project.id}
                        project={project}
                        index={index}
                        isActive={activeProject === project.id}
                        setActiveProject={setActiveProject}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                <div className="github-profile-section">
                  <div className="github-profile-card">
                    <div className="github-profile-header">
                      <FaGithub className="github-icon" />
                      <h3>GitHub Profile</h3>
                    </div>
                    <div className="github-profile-content">
                      <p>Explore more of my projects and contributions on GitHub</p>
                      <motion.a
                        href="https://github.com/mukundmangla"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-profile-link"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>View Profile</span>
                        <FaExternalLinkAlt className="link-icon" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects; 