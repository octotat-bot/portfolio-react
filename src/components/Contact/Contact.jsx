import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub, FaPaperPlane } from 'react-icons/fa';
import './Contact.css';

const HolographicInput = ({ id, name, type, label, value, onChange, placeholder, required, textarea = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(value.trim().length > 0);
  }, [value]);

  const InputElement = textarea ? 'textarea' : 'input';
  const extraProps = textarea ? { rows: '5' } : { type };

  return (
    <div className={`holo-input-container ${isFocused ? 'focused' : ''} ${hasValue ? 'has-value' : ''}`}>
      <div className="holo-input-border"></div>
      <div className="holo-input-glow"></div>
      
      <InputElement
        id={id}
        name={name}
        className="holo-input"
        placeholder=""
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...extraProps}
      />
      
      <label htmlFor={id} className="holo-label">
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      
      <div className="holo-placeholder">{placeholder}</div>
      
      <div className="input-scan-line"></div>
      <div className="input-particles"></div>
    </div>
  );
};

const Contact = () => {
  const contactRef = useRef(null);
  const formRef = useRef(null);
  const canvasRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const isInView = useInView(contactRef, { once: true, amount: 0.2 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [formActive, setFormActive] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [formProgress, setFormProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  useEffect(() => {
    if (!contactRef.current) return;
    
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = contactRef.current.getBoundingClientRect();
      
      const rotX = ((clientY - top - height / 2) / height) * 5;
      const rotY = ((clientX - left - width / 2) / width) * 5;
      
      setRotation({ x: rotX, y: rotY });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      let width = canvas.width = window.innerWidth;
      let height = canvas.height = window.innerHeight;
      
      const nodePositions = [
        { x: width * 0.2, y: height * 0.3 },
        { x: width * 0.4, y: height * 0.2 },
        { x: width * 0.7, y: height * 0.4 },
        { x: width * 0.8, y: height * 0.7 },
        { x: width * 0.3, y: height * 0.8 },
        { x: width * 0.5, y: height * 0.6 }
      ];
      
      const animate = () => {
        ctx.clearRect(0, 0, width, height);
        
        ctx.strokeStyle = 'rgba(12, 255, 119, 0.1)';
        ctx.lineWidth = 1;
        
        let opacity = 0.05;
        if (connectionState === 'connecting') {
          opacity = 0.2;
        } else if (connectionState === 'connected') {
          opacity = 0.3;
        }
        
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.strokeStyle = `rgba(12, 255, 119, ${opacity / 2})`;
          ctx.stroke();
        }
        
        for (let y = 0; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.strokeStyle = `rgba(12, 255, 119, ${opacity / 2})`;
          ctx.stroke();
        }
        
        for (let i = 0; i < nodePositions.length; i++) {
          const node = nodePositions[i];
          
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(12, 255, 119, ${opacity * 2})`;
          ctx.fill();
          
          for (let j = i + 1; j < nodePositions.length; j++) {
            const target = nodePositions[j];
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `rgba(12, 255, 119, ${opacity})`;
            ctx.stroke();
          }
        }
        
        requestAnimationFrame(animate);
      };
      
      animate();
      
      const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [contactRef, connectionState]);
  
  useEffect(() => {
    setIsLoading(true);
    setFormProgress(0);
    
    const initialLoadTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(initialLoadTimeout);
  }, []);
  
  useEffect(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    if (isInView && !isLoading) {
      setConnectionState('connecting');
      
      const startTime = Date.now();
      const duration = 3000;
      
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
        
        setFormProgress(progress);
        
        if (progress >= 100) {
          clearInterval(progressIntervalRef.current);
          
          setTimeout(() => {
            setConnectionState('connected');
            setFormActive(true);
          }, 500);
        }
      }, 50);
      
      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [isInView, isLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setConnectionState('transmitting');
    setFormStatus({
      submitted: true,
      success: false,
      message: 'Transmitting message...'
    });
    
    setTimeout(() => {
      setConnectionState('connected');
      setFormStatus({
        submitted: true,
        success: true,
        message: `Thanks for your message, ${formData.name}! Message transmission successful.`
      });
      
      setTimeout(() => {
        setFormStatus({
          submitted: false,
          success: false,
          message: ''
        });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 5000);
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100
      }
    }
  };

  return (
    <section id="contact" className="contact" ref={contactRef}>
      <canvas ref={canvasRef} className="contact-canvas"></canvas>
      <div className="hologram-scanline"></div>
      <div className="hologram-overlay contact-overlay"></div>
      
      <div className="container contact-container">
        <motion.div
          className="section-header"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ 
            transform: `perspective(1000px) rotateX(${rotation.x * 0.5}deg) rotateY(${rotation.y * 0.5}deg)` 
          }}
        >
          <motion.h2 variants={itemVariants} className="title-hologram section-title">
            <div className="title-glow"></div>
            Contact
          </motion.h2>
          <motion.div variants={itemVariants} className="section-subtitle hologram-flicker">
            Establish Connection
          </motion.div>
        </motion.div>

        <div className="contact-content">
          <motion.div
            className="contact-info"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ 
              transform: `perspective(1000px) rotateX(${rotation.x * 0.3}deg) rotateY(${rotation.y * 0.3}deg)` 
            }}
          >
            <motion.div className="contact-card" variants={itemVariants}>
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="terminal-button"></span>
                  <span className="terminal-button"></span>
                  <span className="terminal-button"></span>
                </div>
                <div className="terminal-title">contact_info.dat</div>
              </div>
              <div className="terminal-body contact-terminal">
                <div className="terminal-line">
                  <span className="terminal-prompt">system:~$</span> <span className="cmd-text">initialize_contact_protocol</span>
                </div>
                <div className="terminal-output">
                  <div className="contact-status">
                    <div className={`status-indicator ${connectionState}`}></div>
                    <div className="status-text">
                      {connectionState === 'disconnected' && 'Connection Idle'}
                      {connectionState === 'connecting' && 'Establishing Connection...'}
                      {connectionState === 'connected' && 'Connection Established'}
                      {connectionState === 'transmitting' && 'Transmitting Data...'}
                    </div>
                  </div>
                  
                  <div className={`progress-bar ${connectionState === 'connecting' ? 'active' : ''}`}>
                    <div className="progress-fill" style={{ width: `${formProgress}%` }}></div>
                    <div className="progress-text">{formProgress}%</div>
                  </div>
                  
                  <div className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    <div className="contact-text">
                      <h4>Email Address</h4>
                      <p>mukund@example.com</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <FaMapMarkerAlt className="contact-icon" />
                    <div className="contact-text">
                      <h4>Location</h4>
                      <p>Newton School of Technology</p>
                    </div>
                  </div>
                  
                  <div className="terminal-line">
                    <span className="terminal-prompt">system:~$</span> <span className="cmd-text">get_social_profiles</span>
                  </div>
                  
                  <div className="social-links-container">
                    <div className="social-links">
                      <a href="https://www.linkedin.com/in/mukund-mangla" target="_blank" rel="noopener noreferrer" className="social-link">
                        <div className="social-glow"></div>
                        <FaLinkedin />
                      </a>
                      <a href="https://github.com/octotat-bot" target="_blank" rel="noopener noreferrer" className="social-link">
                        <div className="social-glow"></div>
                        <FaGithub />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="contact-form-container"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ 
              transform: `perspective(1000px) rotateX(${rotation.x * 0.3}deg) rotateY(${rotation.y * 0.3}deg)` 
            }}
          >
            <AnimatePresence>
              {formActive ? (
                <motion.form
                  ref={formRef}
                  className="contact-form hologram-panel"
                  onSubmit={handleSubmit}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="hologram-border"></div>
                  <div className="form-header">
                    <h3 className="form-title">TRANSMISSION INTERFACE</h3>
                    <div className="form-controls">
                      <div className="form-control-btn"></div>
                      <div className="form-control-btn"></div>
                      <div className="form-control-btn"></div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {formStatus.submitted && (
                      <motion.div 
                        className={`form-message ${formStatus.success ? 'success' : 'pending'}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="message-content">
                          {formStatus.message}
                        </div>
                        <div className="message-pulse"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="form-group">
                    <HolographicInput
                      id="name"
                      name="name"
                      type="text"
                      label="Name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    
                    <HolographicInput
                      id="email"
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <HolographicInput
                    id="subject"
                    name="subject"
                    type="text"
                    label="Subject"
                    placeholder="Message subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  
                  <HolographicInput
                    id="message"
                    name="message"
                    label="Message"
                    placeholder="Your message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    textarea
                  />
                  
                  <button 
                    type="submit" 
                    className="hologram-btn form-submit"
                    disabled={formStatus.submitted}
                  >
                    <span className="btn-content">
                      <FaPaperPlane /> 
                      {formStatus.submitted ? 'Transmitting...' : 'Transmit Message'}
                    </span>
                    <span className="btn-glow"></span>
                    <span className="btn-border"></span>
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  className="form-connecting"
                  variants={itemVariants}
                >
                  <div className="connecting-text">
                    <span className="text-primary">Initializing Contact Protocol</span>
                    <span className="text-secondary">Please wait while the system establishes a secure connection...</span>
                  </div>
                  <div className="connecting-animation">
                    <div className="connecting-circle"></div>
                    <div className="connecting-circle"></div>
                    <div className="connecting-circle"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 