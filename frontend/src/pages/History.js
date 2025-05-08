import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import AnimatedButton from '../components/AnimatedButton';

const History = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const ref = React.useRef(null);
  const inView = useInView(ref, { triggerOnce: true });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/history');
        setHistory(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred');
      }
    };
    fetchHistory();
  }, []);

  const handleDownloadPDF = async (predictionId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/generate_pdf/${predictionId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prediction_${predictionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while downloading the PDF');
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  // Debug log to verify inView value
  React.useEffect(() => {
    console.log('inView:', inView);
  }, [inView]);

  return (
    <Container sx={{ py: 8 }}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      >
        <Typography variant="h1" gutterBottom sx={{ color: '#007BFF' }}>
          Prediction History
        </Typography>
        {error && (
          <Box mb={4}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <Grid container spacing={4}>
          {history.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <motion.div variants={cardVariants} className="card-hover">
                <Card sx={{ bgcolor: 'background.paper', borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      {new Date(item.timestamp).toLocaleString()}
                    </Typography>
                    <Typography color="textSecondary">Age: {item.input.age}</Typography>
                    <Typography color="textSecondary">
                      Gender: {item.input.gender === 1 ? 'Male' : 'Female'}
                    </Typography>
                    <Typography color="textSecondary">Education: {item.input.educationLevel}</Typography>
                    <Typography color="textSecondary">Experience: {item.input.experienceYears} years</Typography>
                    <Typography color={item.prediction ? 'success.main' : 'error.main'}>
                      {item.prediction ? 'Hired' : 'Not Hired'}
                    </Typography>
                    <Typography color="textSecondary">
                      Probability: {(item.probability * 100).toFixed(2)}%
                    </Typography>
                    <Box mt={2}>
                      <AnimatedButton
                        color="secondary"
                        onClick={() => handleDownloadPDF(item._id)}
                      >
                        Download PDF
                      </AnimatedButton>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default History;