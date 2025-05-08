import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import AnimatedButton from '../components/AnimatedButton';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const ref = React.useRef(null);
  const inView = useInView(ref, { triggerOnce: true });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      setSuccess(response.data.message);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while submitting the form');
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Debug log to verify inView value
  useEffect(() => {
    console.log('Contact inView:', inView);
  }, [inView]);

  return (
    <Container sx={{ py: 8 }}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={formVariants}
      >
        <motion.div variants={inputVariants}>
          <Typography variant="h1" gutterBottom sx={{ color: '#007BFF' }}>
            Contact Us
          </Typography>
        </motion.div>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            className: 'card-hover'
          }}
        >
          <motion.div variants={inputVariants}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
          </motion.div>
          <motion.div variants={inputVariants}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
          </motion.div>
          <motion.div variants={inputVariants}>
            <TextField
              fullWidth
              label="Message"
              name="message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              margin="normal"
              required
            />
          </motion.div>
          <motion.div variants={inputVariants}>
            <AnimatedButton type="submit">Send</AnimatedButton>
          </motion.div>
        </Box>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            sx={{ mt: 4 }}
          >
            <Alert severity="success">{success}</Alert>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            sx={{ mt: 4 }}
          >
            <Alert severity="error">{error}</Alert>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};

export default Contact;