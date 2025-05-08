import React, { useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { triggerOnce: true });

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  // Debug log to verify inView value
  useEffect(() => {
    console.log('About inView:', inView);
  }, [inView]);

  return (
    <Container sx={{ py: 8, position: 'relative' }}>
      <motion.div
        className="floating-shape"
        style={{
          width: 150,
          height: 150,
          background: '#FF6F61',
          borderRadius: '30%',
          top: '10%',
          right: '10%'
        }}
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={sectionVariants}
      >
        <Typography variant="h1" gutterBottom sx={{ color: '#007BFF' }}>
          About Smart Hire
        </Typography>
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 4, bgcolor: 'background.paper', borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', className: 'card-hover' }}>
          <motion.div variants={sectionVariants}>
            <Typography variant="body1" paragraph>
              Smart Hire is an AI-powered platform designed to streamline the hiring process by predicting the likelihood of a candidate being hired based on their profile.
            </Typography>
          </motion.div>
          <motion.div variants={sectionVariants}>
            <Typography variant="body1" paragraph>
              Using advanced machine learning models, Smart Hire analyzes key candidate attributes to provide accurate and data-driven predictions.
            </Typography>
          </motion.div>
          <motion.div variants={sectionVariants}>
            <Typography variant="body1" paragraph>
              Our mission is to empower recruiters with intelligent tools to make informed decisions, saving time and improving hiring outcomes.
            </Typography>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  );
};

export default About;