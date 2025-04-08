import { useState, useEffect, useRef } from 'react';
import { FaHeart, FaArrowUp, FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [activeCircuit, setActiveCircuit] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const footerRef = useRef(null);
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: <FaGithub />, url: 'https://github.com/octotat-bot', name: 'GitHub' },
    { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/mukund-mangla', name: 'LinkedIn' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    const handleMouseMove = (e) => {
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getRandomPoints = (count) => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 50 + 25
    }));
  };

  const circuitPoints = [
    getRandomPoints(5),
    getRandomPoints(6),
    getRandomPoints(4)
  ];

  const commands = [
    { cmd: 'cd ~', output: 'Changed to home directory' },
    { cmd: 'ls -l', output: 'portfolio  projects  skills  contact' },
    { cmd: 'cat thanks.txt', output: 'Thanks for visiting my portfolio!' },
    { cmd: 'exit', output: 'Closing session...' }
  ];

  return (
    <footer className="footer" ref={footerRef}>
      <div className="circuit-background">
        <div className="circuit-paths">
          {circuitPoints.map((points, pathIndex) => (
            <svg 
              key={pathIndex} 
              className={`circuit-path ${activeCircuit === pathIndex ? 'active' : ''}`}
              viewBox="0 0 100 100"
              onClick={() => setActiveCircuit(pathIndex)}
            >
              <path 
                d={`M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`}
                stroke="var(--primary-color)"
                fill="none"
              />
              {points.map((point, i) => (
                <circle 
                  key={i} 
                  cx={point.x} 
                  cy={point.y} 
                  r="0.8" 
                  className="circuit-node"
                />
              ))}
            </svg>
          ))}
        </div>
        <div className="glow-orbs">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i}
              className="glow-orb"
              style={{ 
                '--orb-delay': `${i * 2}s`,
                '--orb-size': `${100 + (i * 30)}px`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container footer-container">
        <motion.div 
          className="footer-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="footer-logo">
            <motion.span 
              className="logo-text terminal-text"
              whileHover={{ scale: 1.05 }}
              style={{
                textShadow: `0 0 8px var(--glow-color), 0 0 12px var(--glow-color)`,
              }}
            >
              mukund@portfolio:~$
            </motion.span>
          </div>
          
          <div className="footer-links">
            {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((link, index) => (
              <motion.a 
                key={index}
                href={`#${link.toLowerCase()}`}
                whileHover={{ 
                  scale: 1.1, 
                  color: 'var(--primary-color)',
                  textShadow: '0 0 8px var(--glow-color)'
                }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <span className="link-text">{link}</span>
                <span className="link-highlight" />
              </motion.a>
            ))}
          </div>
          
          <div className="footer-social">
            <h4>Connect With Me</h4>
            <div className="social-icons">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: [0, -10, 10, -10, 0]
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {social.icon}
                  <span className="social-glow"></span>
                  <span className="icon-tooltip">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </div>
          
          <div className="footer-text">
            <p>
              <span className="terminal-text">echo "Made with </span>
              <FaHeart className="heart-icon" />
              <span className="terminal-text"> and ReactJS"</span>
            </p>
            <p className="copyright">&copy; {currentYear} Mukund Mangla</p>
          </div>
        </motion.div>
        
        <AnimatePresence>
          {showScrollButton && (
            <motion.button 
              className="scroll-top-btn" 
              onClick={scrollToTop} 
              aria-label="Scroll to top"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ 
                scale: 1.1, 
                boxShadow: '0 0 25px var(--glow-color)' 
              }}
            >
              <FaArrowUp />
              <span className="scroll-tooltip">Back to Top</span>
              <div className="btn-particle-container">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="btn-particle"
                    style={{
                      '--particle-delay': `${i * 0.2}s`,
                      '--particle-size': `${3 + i}px`,
                    }}
                  />
                ))}
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        <div className="footer-terminal">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <div className="terminal-button"></div>
              <div className="terminal-button"></div>
              <div className="terminal-button"></div>
            </div>
            <div className="terminal-title">terminal@portfolio</div>
          </div>
          <div className="terminal-body">
            {commands.map((cmd, index) => (
              <div key={index} className="terminal-command-group">
                <div className="terminal-line">
                  <span className="terminal-prompt">mukund@portfolio:~$</span> {cmd.cmd}
                </div>
                <div className="terminal-output">
                  <span className={index === commands.length - 1 ? "blink" : ""}>
                    {cmd.output}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="matrix-container">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="matrix-column"
            style={{ '--column-speed': `${10 + Math.random() * 20}s` }}
          >
            {[...Array(20)].map((_, j) => (
              <span 
                key={j}
                className="matrix-char"
                style={{ '--char-delay': `${j * 0.1}s` }}
              >
                {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
              </span>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer; 