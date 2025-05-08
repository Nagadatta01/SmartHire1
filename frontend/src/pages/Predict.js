import React, { useState } from 'react';
import { Container, Typography, TextField, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer'; // Correct import
import axios from 'axios';
import AnimatedButton from '../components/AnimatedButton';

const Predict = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    educationLevel: '',
    experienceYears: '',
    previousCompanies: '',
    distanceFromCompany: '',
    interviewScore: '',
    skillScore: '',
    personalityScore: '',
    recruitmentStrategy: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [ref, inView] = useInView({ triggerOnce: true });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      const response = await axios.post('http://localhost:5000/api/predict', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
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
            Candidate Prediction
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
          {[
            { label: 'Age', name: 'age', type: 'number' },
            { label: 'Gender (0: Female, 1: Male)', name: 'gender', type: 'number' },
            { label: 'Education Level (1: High School, 2: Bachelor\'s, 3: Master\'s, 4: PhD)', name: 'educationLevel', type: 'number' },
            { label: 'Experience Years', name: 'experienceYears', type: 'number' },
            { label: 'Previous Companies', name: 'previousCompanies', type: 'number' },
            { label: 'Distance from Company (km)', name: 'distanceFromCompany', type: 'number' },
            { label: 'Interview Score (0-100)', name: 'interviewScore', type: 'number' },
            { label: 'Skill Score (0-100)', name: 'skillScore', type: 'number' },
            { label: 'Personality Score (0-100)', name: 'personalityScore', type: 'number' },
            { label: 'Recruitment Strategy (1: Aggressive, 2: Moderate, 3: Conservative)', name: 'recruitmentStrategy', type: 'number' }
          ].map((field) => (
            <motion.div key={field.name} variants={inputVariants}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                margin="normal"
                required
              />
            </motion.div>
          ))}
          <motion.div variants={inputVariants}>
            <AnimatedButton type="submit">Predict</AnimatedButton>
          </motion.div>
        </Box>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            sx={{ mt: 4, textAlign: 'center' }}
          >
            <Alert severity={result.prediction ? 'success' : 'info'}>
              {result.prediction ? 'Candidate is likely to be hired!' : 'Candidate is unlikely to be hired.'}
              <br />
              Probability of Hire: {(result.probability * 100).toFixed(2)}%
            </Alert>
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

export default Predict;