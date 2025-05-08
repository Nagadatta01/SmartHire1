import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Switch, Box } from '@mui/material';
import { motion } from 'framer-motion';

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AppBar position="sticky" className="gradient-bg">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'white', fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}
        >
          Smart Hire
        </Typography>
        <motion.div variants={navVariants} initial="hidden" animate="visible">
          <Box sx={{ display: 'flex', gap: 2 }}>
            {['Home', 'Predict', 'History', 'About', 'Contact'].map((item) => (
              <motion.div key={item} variants={itemVariants}>
                <Button
                  color="inherit"
                  component={Link}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  sx={{
                    color: 'white',
                    '&:hover': { color: '#00FF8C', transition: 'color 0.3s' }
                  }}
                >
                  {item}
                </Button>
              </motion.div>
            ))}
            <motion.div variants={itemVariants}>
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                sx={{
                  '& .MuiSwitch-thumb': { backgroundColor: '#00FF8C' },
                  '& .MuiSwitch-track': { backgroundColor: '#6B21A8' }
                }}
              />
            </motion.div>
          </Box>
        </motion.div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;