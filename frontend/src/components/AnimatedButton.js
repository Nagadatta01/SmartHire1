import React from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedButton = ({ children, color = 'primary', ...props }) => {
  return (
    <motion.div
      className="button-pulse"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="contained"
        color={color}
        sx={{
          borderRadius: 12,
          padding: '12px 24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          '&:hover': { boxShadow: '0 6px 16px rgba(0, 123, 255, 0.4)' }
        }}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;