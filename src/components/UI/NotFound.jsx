import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.css';
import LogoIcon from './LogoIcon';

const NotFound = () => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [commandIndex, setCommandIndex] = useState(0);
  const navigate = useNavigate();
  
  const commands = [
    { text: "find /portfolio -name 'requested-page'", delay: 300 },
    { text: "echo 'Suggestions:'", delay: 1500 },
    { text: "cd /portfolio", delay: 2500 }
  ];
  
  useEffect(() => {
    console.log('NotFound component rendered');
    
    // Command animation sequence
    if (commandIndex < commands.length) {
      const timer = setTimeout(() => {
        setCommandIndex(commandIndex + 1);
      }, commands[commandIndex].delay);
      return () => clearTimeout(timer);
    }
    
    // Countdown and redirect
    if (secondsLeft > 0) {
      const timer = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/');
    }
  }, [secondsLeft, navigate, commandIndex, commands]);

  return (
    <div className="not-found">
      <motion.div 
        className="terminal-window"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="terminal-button red"></span>
            <span className="terminal-button yellow"></span>
            <span className="terminal-button green"></span>
          </div>
          <div className="terminal-title">
            <LogoIcon size={16} color="#0cff77" />
            <span>terminal@portfolio ~ <span style={{ color: 'var(--accent-color)' }}>404</span></span>
          </div>
        </div>
        <div className="terminal-body">
          {commandIndex > 0 && (
            <div className="terminal-line">
              <span className="prompt">$</span> {commands[0].text}
            </div>
          )}
          
          <motion.div 
            className="error-code"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.4,
              type: "spring",
              stiffness: 100
            }}
          >
            <span style={{ color: 'var(--accent-color)' }}>4</span>
            <span>0</span>
            <span style={{ color: 'var(--accent-color)' }}>4</span>
          </motion.div>
          
          <div className="error-message">
            <span className="highlight">ERROR:</span> The page you are looking for does not exist in this directory.
          </div>
          
          {commandIndex > 1 && (
            <div className="terminal-line">
              <span className="prompt">$</span> {commands[1].text}
            </div>
          )}
          
          <div className="action-suggestions">
            <ul>
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.2 }}
              >
                Check the URL for typos
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.4 }}
              >
                Return to the <Link to="/">homepage</Link>
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.6 }}
              >
                Try exploring the navigation menu
              </motion.li>
            </ul>
          </div>
          
          {commandIndex > 2 && (
            <div className="terminal-line">
              <span className="prompt">$</span> {commands[2].text}
            </div>
          )}
          
          <div className="terminal-output">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.7 }}
            >
              Navigating to homepage in {secondsLeft} seconds...
            </motion.span>
          </div>
          
          <motion.div
            className="return-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="btn">Return to Homepage</Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound; 