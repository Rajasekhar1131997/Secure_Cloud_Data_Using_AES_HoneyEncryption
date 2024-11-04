// src/UpdatePasswordPage.js

import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SHA256 from "crypto-js/sha256";
import './UpdatePasswordPage.css'; // Import custom CSS for background styling

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    // Redirect to login if no email was passed to this page
    if (!email) {
      setError("No email provided. Redirecting to login...");
      setTimeout(() => navigate("/"), 3000);
    }
  }, [email, navigate]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const hashedPassword = SHA256(password).toString();
      const response = await axios.post("http://127.0.0.1:8000/update-password", {
        email,
        password: hashedPassword,
      });

      if (response.data.success) {
        setSuccess("Password updated successfully! Redirecting to login...");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setError(response.data.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error:", err);
    }
  };

  return (
    <div className="update-password-page">
      <Container component="main" maxWidth="xs" className="update-password-card">
        <Typography component="h1" variant="h5" className="update-password-title">
          Update Password
        </Typography>
        <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="update-password-input"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="update-password-input"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="update-password-button"
            sx={{ mt: 3 }}
            disabled={!email} // Disable if no email provided
          >
            Update Password
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default UpdatePasswordPage;