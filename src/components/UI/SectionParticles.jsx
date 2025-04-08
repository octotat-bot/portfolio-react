import { useCallback, memo } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

// Memoize the component to prevent unnecessary re-renders
const SectionParticles = memo(({ type = 'default', color = '#0cff77' }) => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const getParticleConfig = () => {
    // Base config for all sections
    const baseConfig = {
      fpsLimit: 60, // Reduced from 120 to 60 for better performance
      background: {
        color: {
          value: 'transparent',
        },
      },
      detectRetina: false, // Disabled retina detection for better performance
    };

    const configs = {
      default: {
        ...baseConfig,
        particles: {
          color: {
            value: color,
          },
          links: {
            color: color,
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
            triangles: {
              enable: false, // Disabled triangles for better performance
            }
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: 1, // Reduced from 1.5 to 1
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000, // Increased area to reduce particle count
            },
            value: 30, // Reduced from 50 to 30
          },
          opacity: {
            value: 0.3,
          },
          shape: {
            type: ["circle"], // Simplified shape types
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
      },
      
      skills: {
        ...baseConfig,
        particles: {
          color: {
            value: color,
          },
          links: {
            enable: false,
          },
          move: {
            direction: "bottom",
            enable: true,
            outModes: {
              default: "out",
            },
            speed: 1.5, // Reduced from 2 to 1.5
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000, // Increased area to reduce particle count
            },
            value: 20, // Reduced from 30 to 20
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: ["circle"], // Simplified shape types
          },
          size: {
            value: { min: 1, max: 3 }, // Reduced max size
          },
          rotate: {
            animation: {
              enable: false, // Disabled rotation animation for better performance
            },
            direction: "random",
            value: 0
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "bubble",
            },
          },
          modes: {
            bubble: {
              distance: 100,
              duration: 2,
              opacity: 0.8,
              size: 5, // Reduced from 6 to 5
            },
          },
        },
      },
      
      about: {
        ...baseConfig,
        particles: {
          color: {
            value: color,
          },
          links: {
            enable: false,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "out",
            },
            path: {
              enable: false, // Disabled path for better performance
            },
            trail: {
              enable: false, // Disabled trail for better performance
            },
            speed: 1,
            random: false,
          },
          number: {
            density: {
              enable: true,
              area: 1200, // Increased area to reduce particle count
            },
            value: 15, // Reduced from 20 to 15
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 2 }, // Reduced max size
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
          },
          modes: {
            grab: {
              distance: 150,
              links: {
                opacity: 0.5,
              }
            },
          },
        },
      },
      
      projects: {
        ...baseConfig,
        particles: {
          color: {
            value: color,
          },
          links: {
            color: color,
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "out",
            },
            speed: 0.8, // Reduced from 1 to 0.8
            random: true,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000, // Increased area to reduce particle count
            },
            value: 25, // Reduced from 40 to 25
          },
          opacity: {
            value: 0.3,
            animation: {
              enable: false, // Disabled opacity animation for better performance
            }
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 2 }, // Reduced max size
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
          },
          modes: {
            grab: {
              distance: 150,
              links: {
                opacity: 0.3,
              }
            },
          },
        },
      },
      
      contact: {
        ...baseConfig,
        particles: {
          color: {
            value: color,
          },
          links: {
            enable: false,
          },
          move: {
            direction: "top",
            enable: true,
            outModes: {
              default: "out",
            },
            speed: 0.8, // Reduced from original speed
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000, // Increased area to reduce particle count
            },
            value: 20, // Reduced particles count
          },
          opacity: {
            value: 0.3,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "connect",
            },
          },
          modes: {
            connect: {
              distance: 100,
              links: {
                opacity: 0.2,
              },
              radius: 60,
            },
          },
        },
      },
    };

    return configs[type] || configs.default;
  };

  return (
    <Particles
      id={`particles-${type}`}
      className="section-particles"
      init={particlesInit}
      options={getParticleConfig()}
    />
  );
});

export default SectionParticles; 