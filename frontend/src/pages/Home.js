import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedButton from '../components/AnimatedButton';

const Home = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { triggerOnce: true, threshold: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  // Debug log to verify inView value
  React.useEffect(() => {
    console.log('inView:', inView);
  }, [inView]);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        className="gradient-bg"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60vh',
          clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)'
        }}
      />
      <motion.div
        className="floating-shape"
        style={{
          width: 100,
          height: 100,
          background: '#00FF8C',
          borderRadius: '50%',
          top: '20%',
          left: '10%'
        }}
      />
      <Container sx={{ py: 12, position: 'relative', zIndex: 1 }}>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants}>
            <Typography
              variant="h1"
              gutterBottom
              sx={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              Smart Hire
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{ color: '#00FF8C', maxWidth: 600, mx: 'auto' }}
            >
              AI-Powered Candidate Prediction
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Box sx={{ mt: 6, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <AnimatedButton component={Link} to="/predict">
                Start Predicting
              </AnimatedButton>
              <AnimatedButton color="secondary" component={Link} to="/about">
                Learn More
              </AnimatedButton>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Home;