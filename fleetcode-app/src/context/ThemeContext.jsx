import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('fc-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fc-theme', theme);
  }, [theme]);

  const toggleTheme = (event, explicitTheme) => {
    const nextTheme = explicitTheme || (theme === 'light' ? 'dark' : 'light');
    if (nextTheme === theme) return;

    // Calculate origin coordinates for the expanding circle animation
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (event) {
      if (typeof event.clientX === 'number' && event.clientX > 0) {
        x = event.clientX;
        y = event.clientY;
      } else if (event.currentTarget && typeof event.currentTarget.getBoundingClientRect === 'function') {
        const rect = event.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Modern circular reveal using Document View Transitions API
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      const transition = document.startViewTransition(() => {
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('fc-theme', nextTheme);
        setTheme(nextTheme);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 550,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
      return;
    }

    // Fallback animated expanding circle ripple for older browsers
    const ripple = document.createElement('div');
    ripple.className = 'theme-circle-ripple';
    const size = endRadius * 2.2;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.backgroundColor = nextTheme === 'dark' ? '#0f1117' : '#ffffff';
    document.body.appendChild(ripple);

    setTimeout(() => {
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('fc-theme', nextTheme);
      setTheme(nextTheme);
      setTimeout(() => {
        ripple.style.opacity = '0';
        ripple.style.transition = 'opacity 0.2s ease';
        setTimeout(() => ripple.remove(), 200);
      }, 300);
    }, 250);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  return ctx || { theme: 'light', toggleTheme: () => {} };
}

