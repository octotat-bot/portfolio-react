import { useEffect, useRef, useState, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import './Home.css';

// Memoize the terminal component
const Terminal = memo(({ active, lines }) => {
  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-button"></span>
          <span className="terminal-button"></span>
          <span className="terminal-button"></span>
        </div>
        <div className="terminal-title">mukund@portfolio:~</div>
      </div>
      <div className="terminal-body">
        {active && lines.map((line, index) => (
          <div key={index} className="terminal-command-group">
            <motion.div 
              className="terminal-line"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: line.delay / 1000, duration: 0.2 }}
            >
              <span className="terminal-prompt">mukund@portfolio:~$</span> {line.command}
            </motion.div>
            <motion.div 
              className="terminal-output"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (line.delay + 300) / 1000, duration: 0.2 }}
            >
              {line.output}
            </motion.div>
          </div>
        ))}
        {active && (
          <motion.div 
            className="terminal-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.0, duration: 0.2 }}
          >
            <span className="terminal-prompt">mukund@portfolio:~/portfolio$</span> <span className="terminal-cursor">_</span>
          </motion.div>
        )}
      </div>
    </div>
  );
});

// Particle component
const Particle = ({ style }) => (
  <div className="hologram-particle" style={style}></div>
);

// Floating Element component
const FloatingElement = ({ children, delay, x, y, z, scale }) => (
  <motion.div
    className="floating-element"
    initial={{ opacity: 0, x: -50, y: -20, scale: 0.9 }}
    animate={{ 
      opacity: 1, 
      x: 0, 
      y: 0,
      scale: 1,
      rotateX: [0, 5, 0, -5, 0],
      rotateY: [0, 10, 0, -10, 0]
    }}
    transition={{ 
      delay: delay,
      duration: 1,
      rotateX: {
        repeat: Infinity,
        duration: 6,
        ease: "easeInOut"
      },
      rotateY: {
        repeat: Infinity,
        duration: 8,
        ease: "easeInOut"
      }
    }}
    style={{ 
      x, y, z,
      scale
    }}
  >
    {children}
  </motion.div>
);

// Hexagon component
const Hexagon = ({ className, children, size = 100, color = 'var(--primary-color)' }) => (
  <div 
    className={`hexagon ${className || ''}`}
    style={{ 
      width: `${size}px`, 
      height: `${size * 0.866}px`,
      '--hexagon-color': color 
    }}
  >
    <div className="hexagon-content">{children}</div>
  </div>
);

const Home = () => {
  const homeRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [terminalActive, setTerminalActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHologramActive, setIsHologramActive] = useState(false);
  const [particles, setParticles] = useState([]);
  const floatingHexagons = useRef([]);
  const hoverTarget = useRef(null);

  // Generate initial particles
  useEffect(() => {
    // Generate random particles
    const generateParticles = () => {
      const newParticles = [];
      const count = window.innerWidth < 768 ? 30 : 60;
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 1,
          speed: Math.random() * 1 + 0.2,
          opacity: Math.random() * 0.5 + 0.1,
          color: Math.random() > 0.7 ? 'var(--accent-color)' : 'var(--primary-color)'
        });
      }
      
      setParticles(newParticles);
    };
    
    generateParticles();
    
    // Window resize handler
    const handleResize = () => {
      generateParticles();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation frames for particles and hologram effect
  useEffect(() => {
    let animationId;
    let hologramTimeout;
    
    // Set loaded state and start terminal animation
    setIsLoaded(true);
    hologramTimeout = setTimeout(() => {
      setIsHologramActive(true);
      setTimeout(() => setTerminalActive(true), 1000);
    }, 800);
    
    // Initialize hologram canvas
    const initHologram = () => {
      if (!canvasRef.current || !homeRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width = window.innerWidth;
      const height = canvas.height = window.innerHeight;
      
      let time = 0;
      
      // Animation loop
      const animate = () => {
        time += 0.01;
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        const gridSize = 40;
        ctx.strokeStyle = 'rgba(12, 255, 119, 0.15)';
        ctx.lineWidth = 1;
        
        // Perspective grid effect
        for (let x = 0; x < width; x += gridSize) {
          const distortionX = Math.sin(time + x * 0.01) * 5;
          
          ctx.beginPath();
          ctx.moveTo(x + distortionX, 0);
          ctx.lineTo(x - distortionX, height);
          ctx.stroke();
        }
        
        for (let y = 0; y < height; y += gridSize) {
          const distortionY = Math.cos(time + y * 0.01) * 5;
          
          ctx.beginPath();
          ctx.moveTo(0, y + distortionY);
          ctx.lineTo(width, y - distortionY);
          ctx.stroke();
        }
        
        // Draw circles at intersections
        ctx.fillStyle = 'rgba(12, 255, 119, 0.4)';
        for (let x = 0; x < width; x += gridSize) {
          for (let y = 0; y < height; y += gridSize) {
            // Distance to mouse
            const dx = x - mousePos.x;
            const dy = y - mousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
              const radius = 2 * (1 - distance / 150) + 1;
              ctx.beginPath();
              ctx.arc(
                x + Math.sin(time + x * 0.05) * 2, 
                y + Math.cos(time + y * 0.05) * 2, 
                radius, 
                0, 
                Math.PI * 2
              );
              ctx.fill();
            } else if (Math.random() > 0.85) {
              ctx.beginPath();
              ctx.arc(
                x + Math.sin(time + x * 0.05) * 2, 
                y + Math.cos(time + y * 0.05) * 2, 
                1, 
                0, 
                Math.PI * 2
              );
              ctx.fill();
            }
          }
        }
        
        // Draw highlight around mouse position
        if (mousePos.x && mousePos.y) {
          const gradient = ctx.createRadialGradient(
            mousePos.x, mousePos.y, 0,
            mousePos.x, mousePos.y, 150
          );
          
          gradient.addColorStop(0, 'rgba(12, 255, 119, 0.3)');
          gradient.addColorStop(0.5, 'rgba(12, 255, 119, 0.1)');
          gradient.addColorStop(1, 'rgba(12, 255, 119, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(mousePos.x, mousePos.y, 150, 0, Math.PI * 2);
          ctx.fill();
        }
        
        animationId = requestAnimationFrame(animate);
      };
      
      animate();
    };
    
    initHologram();
    
    // Track mouse movement
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Check if mouse is over a floating hexagon
      if (floatingHexagons.current.length > 0) {
        let isOverHexagon = false;
        
        floatingHexagons.current.forEach(hex => {
          if (!hex.element) return;
          
          const rect = hex.element.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            isOverHexagon = true;
            if (hoverTarget.current !== hex.id) {
              hoverTarget.current = hex.id;
              hex.element.classList.add('hexagon-hover');
            }
          } else if (hex.element.classList.contains('hexagon-hover') && hoverTarget.current === hex.id) {
            hex.element.classList.remove('hexagon-hover');
            hoverTarget.current = null;
          }
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(hologramTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Function to scroll to the About section
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  // Terminal commands
  const terminalLines = [
    { command: 'whoami', output: 'Mukund Mangla - Tech Enthusiast', delay: 500 },
    { command: 'location', output: 'Newton School of Technology', delay: 1500 },
    { command: 'cat skills.txt', output: 'HTML, CSS, JavaScript, React', delay: 2500 },
    { command: 'cd portfolio', output: 'Welcome to my portfolio! Scroll down to explore...', delay: 3500 },
  ];

  // Skills for floating hexagons
  const skills = [
    { id: 'html', name: 'HTML', icon: '💻', color: '#e34f26' },
    { id: 'css', name: 'CSS', icon: '🎨', color: '#1572b6' },
    { id: 'js', name: 'JavaScript', icon: '⚡', color: '#f7df1e' },
    { id: 'react', name: 'React', icon: '⚛️', color: '#61dafb' },
    { id: 'node', name: 'Node.js', icon: '🔄', color: '#43853d' }
  ];
  
  // Reference hexagons for hover effects
  useEffect(() => {
    floatingHexagons.current = skills.map(skill => ({ 
      id: skill.id, 
      element: document.getElementById(`hex-${skill.id}`)
    }));
  }, [isLoaded]);

  // Render floating particles
  const renderParticles = useMemo(() => {
    return particles.map(particle => (
      <Particle
        key={particle.id}
        style={{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          opacity: particle.opacity,
          backgroundColor: particle.color,
          animationDuration: `${10 / particle.speed}s`
        }}
      />
    ));
  }, [particles]);

  return (
    <section id="home" className={`home ${isLoaded ? 'content-loaded' : ''} ${isHologramActive ? 'hologram-active' : ''}`} ref={homeRef}>
      {/* Hologram Canvas Background */}
      <canvas ref={canvasRef} className="hologram-canvas"></canvas>
      
      {/* Hologram Overlay Effect */}
      <div className="hologram-overlay"></div>
      <div className="hologram-scanline"></div>
      
      {/* Floating Particles */}
      <div className="particles-container">
        {renderParticles}
      </div>
      
      {/* Floating Hexagons */}
      <div className="floating-hexagons">
        {skills.map((skill, index) => (
          <FloatingElement 
            key={skill.id}
            delay={1 + index * 0.2}
            x={`${-20 + index * 15}%`}
            y={`${-10 + (index % 2) * 20}%`}
            z={100 + index * 10}
            scale={0.8 + (index % 3) * 0.1}
          >
            <Hexagon 
              className="skill-hexagon"
              id={`hex-${skill.id}`}
              size={80}
              color={skill.color}
            >
              <div className="skill-icon">{skill.icon}</div>
              <div className="skill-name">{skill.name}</div>
            </Hexagon>
          </FloatingElement>
        ))}
      </div>
      
      <div className="container home-container">
        <motion.div 
          className="home-content-hologram"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() => setHasAnimated(true)}
        >
          <div className="hologram-border"></div>
          
          <motion.div className="greeting terminal-text" variants={itemVariants}>
            <span className="hologram-flicker">Hello World!</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="title-hologram">
            I'm <span className="name-hologram">Mukund Mangla</span>
          </motion.h1>
          
          <motion.div className="typewriter-container" variants={itemVariants}>
            <span className="typewriter-prefix terminal-text">I am </span>
            <Typewriter
              options={{
                strings: [
                  'a Tech Enthusiast',
                  'a First Year Student',
                  'at Newton School of Technology',
                  'a Future Developer'
                ],
                autoStart: true,
                loop: true,
                wrapperClassName: 'typewriter-text',
                cursorClassName: 'typewriter-cursor',
                delay: 50,
                deleteSpeed: 30
              }}
            />
          </motion.div>
          
          <motion.p variants={itemVariants} className="description-hologram">
            <span className="hologram-text">Welcome to my tech-themed portfolio. I'm passionate about technology and
            building innovative solutions. Currently exploring the world of coding and development.</span>
          </motion.p>
          
          <motion.div className="cta-buttons" variants={itemVariants}>
            <a href="#projects" className="btn primary-btn hologram-btn">
              <span className="btn-content">View Projects</span>
              <span className="btn-glow"></span>
              <span className="btn-border"></span>
            </a>
            <a href="#contact" className="btn secondary-btn hologram-btn">
              <span className="btn-content">Contact Me</span>
              <span className="btn-glow"></span>
              <span className="btn-border"></span>
            </a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="terminal-hologram"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="hologram-flicker-fast"></div>
          <Terminal active={terminalActive} lines={terminalLines} />
        </motion.div>
      </div>
      
      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.0, duration: 0.5 }}
        onClick={scrollToAbout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="scroll-text">Scroll Down</div>
        <div className="scroll-arrow"></div>
      </motion.div>
    </section>
  );
};

export default Home; 