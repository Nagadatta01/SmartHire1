import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Predict from './pages/Predict';
import History from './pages/History';
import About from './pages/About';
import Contact from './pages/Contact';
import './styles.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#007BFF' },
      secondary: { main: '#FF6F61' },
      accent: { main: '#00FF8C' },
      background: {
        default: darkMode ? '#1A1A2E' : '#F5F5F5',
        paper: darkMode ? '#252540' : '#FFFFFF'
      }
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      h1: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 800,
        fontSize: '3rem',
        '@media (max-width:600px)': { fontSize: '2rem' }
      },
      h2: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
        fontSize: '2rem'
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            padding: '12px 24px',
            '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.3s' }
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '&:hover fieldset': { borderColor: '#00FF8C' },
              '&.Mui-focused fieldset': { borderColor: '#007BFF' }
            }
          }
        }
      }
    }
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <Home />
                </motion.div>
              }
            />
            <Route
              path="/predict"
              element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <Predict />
                </motion.div>
              }
            />
            <Route
              path="/history"
              element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <History />
                </motion.div>
              }
            />
            <Route
              path="/about"
              element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <About />
                </motion.div>
              }
            />
            <Route
              path="/contact"
              element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
                  <Contact />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  );
};

export default App;