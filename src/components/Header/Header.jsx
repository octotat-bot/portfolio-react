import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [commandText, setCommandText] = useState('ls');
  const commandTimeoutRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Detect active section based on scroll position
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Apply staggered animation to mobile menu items
    const navItems = document.querySelectorAll('.nav li');
    navItems.forEach((item, index) => {
      item.style.setProperty('--index', index);
    });
    
    // Close mobile menu when clicking outside
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.nav') && !e.target.closest('.mobile-menu-btn')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Simulated commands when hovering nav items
  const updateCommand = (section) => {
    const commands = {
      home: 'cd ~/',
      about: 'cat about.txt',
      skills: 'ls -la skills/',
      projects: 'git log --oneline',
      contact: 'ssh connect@mukund.dev'
    };
    
    setCommandText(commands[section]);
    
    // Reset command text after 3 seconds
    clearTimeout(commandTimeoutRef.current);
    commandTimeoutRef.current = setTimeout(() => {
      setCommandText('ls');
    }, 3000);
  };

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };
  
  const logoVariants = {
    normal: { textShadow: "0 0 8px var(--glow-color)" },
    glitch: { 
      textShadow: [
        "2px 0 #ff00ea, -2px 0 #00ffd5, 0 0 8px var(--glow-color)",
        "-2px 0 #ff00ea, 2px 0 #00ffd5, 0 0 8px var(--glow-color)",
        "2px 2px #ff00ea, -2px -2px #00ffd5, 0 0 8px var(--glow-color)",
        "-2px 2px #ff00ea, 2px -2px #00ffd5, 0 0 8px var(--glow-color)",
        "0 0 8px var(--glow-color)"
      ],
      transition: { 
        duration: 0.3, 
        repeat: 2, 
        repeatType: "reverse", 
        ease: "easeInOut" 
      }
    }
  };

  // Add animation variants for mobile menu
  const mobileMenuVariants = {
    closed: {
      right: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
        when: "afterChildren"
      }
    },
    open: {
      right: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const menuItemVariants = {
    closed: { 
      x: 50, 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.header 
      className={`header ${isScrolled ? 'scrolled' : ''}`}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container header-container">
        <motion.div 
          className="logo"
          initial="normal"
          whileHover="glitch"
          variants={logoVariants}
        >
          <span className="logo-text terminal-text">mukund@mangla:~$ </span>
          <span className="command-text">{commandText}</span>
          <span className="blink">_</span>
        </motion.div>
        
        <motion.div 
          className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
          whileTap={{ scale: 0.9 }}
        >
          <span></span>
          <span></span>
          <span></span>
        </motion.div>
        
        <AnimatePresence>
          {(isMenuOpen || window.innerWidth > 768) && (
            <motion.nav 
              className="nav"
              initial="closed"
              animate={isMenuOpen ? "open" : window.innerWidth > 768 ? "visible" : "closed"}
              exit="closed"
              variants={window.innerWidth <= 768 ? mobileMenuVariants : {}}
            >
              <div className="nav-background">
                <div className="nav-grid"></div>
              </div>
              <ul>
                {['home', 'about', 'skills', 'projects', 'contact'].map((item, index) => (
                  <motion.li 
                    key={item}
                    custom={index}
                    variants={window.innerWidth <= 768 ? menuItemVariants : navItemVariants}
                    initial="hidden"
                    animate="visible"
                    className={activeSection === item ? 'active' : ''}
                  >
                    <a 
                      href={`#${item}`} 
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveSection(item);
                      }}
                      onMouseEnter={() => updateCommand(item)}
                    >
                      <div className="nav-item-content">
                        <span className="terminal-prompt">$</span>
                        <span className="nav-number">0{index + 1}.</span>
                        <span className="nav-text">{item}</span>
                        <span className="terminal-cursor">_</span>
                        <span className="nav-decorative"></span>
                      </div>
                    </a>
                    {activeSection === item && (
                      <motion.div 
                        className="nav-active-indicator" 
                        layoutId="activeSection"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header; 