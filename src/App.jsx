import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Components
import Header from './components/Header/Header'
import Home from './components/Home/Home'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
// import CustomCursor from './components/UI/CustomCursor'
import NotFound from './components/UI/NotFound'
import ScrollButton from './components/UI/ScrollButton'

// Code snippets for background decoration
const codeSnippets = [
  `function createPortfolio() {
  return {
    name: "Mukund",
    passion: "Tech"
  };
}`,
  `const skills = [
  "HTML", "CSS", 
  "JavaScript", 
  "React"
];`,
  `useEffect(() => {
  // Learning every day
  return () => {
    console.log("Growing");
  }
}, []);`,
  `class Developer {
  constructor() {
    this.learning = true;
    this.coffee = 100;
  }
}`
];

function App() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 10) + 5;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);

    // Complete loading after progress reaches 100%
    const timer = setTimeout(() => {
      clearInterval(interval);
      setLoading(false)
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <h1 className="terminal-text">Initializing Portfolio<span className="blink">_</span></h1>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <div className="progress-text">{progress}%</div>
        </div>
        <div className="loading-message">
          {progress < 30 && "Loading resources..."}
          {progress >= 30 && progress < 60 && "Starting terminal..."}
          {progress >= 60 && progress < 90 && "Connecting components..."}
          {progress >= 90 && "Preparing interface..."}
        </div>
      </div>
    )
  }

  return (
    <Router>
      {/* <CustomCursor /> */}
      <div className="app">
        {/* Floating code snippets */}
        {codeSnippets.map((snippet, index) => (
          <pre key={index} className="code-snippet" style={{ 
            animationDelay: `${index * 1.5}s`,
            opacity: 0.05 + (index * 0.01)
          }}>
            {snippet}
          </pre>
        ))}
        
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Home />
                <About />
                <Skills />
                <Projects />
                <Contact />
              </>
            } />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </main>
        <Footer />
        <ScrollButton />
      </div>
    </Router>
  )
}

export default App
