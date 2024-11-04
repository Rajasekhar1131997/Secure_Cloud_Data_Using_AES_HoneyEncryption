// src/ResetPasswordPage.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './ResetPasswordPage.css';
import axios from "axios";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send a request to the backend to check if the email exists
      const response = await axios.post("http://127.0.0.1:8000/check-email", { email });

      if (response.data.exists) {
        // If the email exists, navigate to the update password page with the email state
        navigate('/update-password', { state: { email } });
      } else {
        // If the email doesn't exist, show an error
        setError("Email not found. Please check and try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("API error details:", err); // Log error details
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-overlay">
        <Container component="main" maxWidth="xs" className="reset-password-card">
          <Typography component="h1" variant="h5" className="reset-password-title">
            Reset Password
          </Typography>
          <Box component="form" noValidate onSubmit={handleResetPassword}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="reset-password-input"
            />
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              className="reset-password-button" 
              disabled={loading}
            >
              {loading ? "Checking..." : "Reset Password"}
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account? <a href="/" className="login-link">Log In</a>
          </Typography>
        </Container>
      </div>
    </div>
  );
};

export default ResetPasswordPage;