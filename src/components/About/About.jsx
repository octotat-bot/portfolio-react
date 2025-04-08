import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionParticles from '../UI/SectionParticles';
import '../UI/SectionParticles.css';
import './About.css';

const About = () => {
  const aboutRef = useRef(null);
  const isInView = useInView(aboutRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100
      }
    }
  };

  return (
    <section id="about" className="about section-with-particles" ref={aboutRef}>
      <SectionParticles type="about" color="#0cff77" />
      
      <div className="container about-container">
        <motion.div
          className="section-header"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 className="section-title" variants={itemVariants}>About Me</motion.h2>
          <motion.div className="section-subtitle terminal-text" variants={itemVariants}>
            Exploring the Code of Who I Am
          </motion.div>
        </motion.div>

        <div className="about-content">
          <motion.div 
            className="about-text"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div className="terminal-window" variants={itemVariants}>
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="terminal-button"></span>
                  <span className="terminal-button"></span>
                  <span className="terminal-button"></span>
                </div>
                <div className="terminal-title">about.exe</div>
              </div>
              <div className="terminal-body">
                <div className="terminal-line">
                  <span className="terminal-prompt">mukund@portfolio:~$</span> cat about.txt
                </div>
                <div className="terminal-output">
                  <p>
                    Hello! I'm Mukund Mangla, a first-year student at Newton School of Technology, passionate about exploring the digital landscape.
                  </p>
                  <p>
                    My journey in tech is just beginning, but I'm enthusiastic about learning various programming languages, frameworks, and tools to build innovative solutions.
                  </p>
                  <p>
                    When I'm not coding, you can find me exploring new technologies, working on personal projects, or expanding my knowledge through online courses and resources.
                  </p>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prompt">mukund@portfolio:~$</span> ./interests.sh
                </div>
                <div className="terminal-output">
                  <ul className="interests-list">
                    <li>Web Development</li>
                    <li>UI/UX Design</li>
                    <li>Software Engineering</li>
                    <li>Machine Learning</li>
                    <li>Open Source Contribution</li>
                  </ul>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prompt">mukund@portfolio:~$</span> <span className="terminal-cursor">_</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="about-buttons" variants={itemVariants}>
              <a href="#contact" className="btn primary-btn">Get In Touch</a>
              <a href="#skills" className="btn secondary-btn">My Skills</a>
            </motion.div>
          </motion.div>

          <motion.div 
            className="about-image-container"
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="about-image-frame">
              <div className="image-glitch-effect">
                <div className="profile-image">
                  <img src="/mukund.png" alt="Mukund Mangla" />
                  <div className="image-overlay"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About; 