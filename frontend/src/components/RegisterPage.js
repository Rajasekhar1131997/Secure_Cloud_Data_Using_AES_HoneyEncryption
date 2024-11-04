import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SHA256 from "crypto-js/sha256";
import "./RegisterPage.css"; // Import custom CSS for styling

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Prepare data
    const formData = {
      email: email,
      password: SHA256(password).toString(),
      mobile: mobile,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success !== undefined) {
        setSuccess("Registration successful! Redirecting to login page...");
        setTimeout(() => navigate("/"), 3000); // Redirect to login page after 3 seconds
      } else {
        setError(response.data["error"]);
      }
    } catch (error) {
      setError("Failed to register. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Container component="main" maxWidth="xs" className="register-card">
        <Typography component="h1" variant="h4" className="register-header">
          Create an Account
        </Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
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
            className="register-input"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="register-input"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="mobile"
            label="Mobile Number"
            type="tel"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="register-input"
            helperText="Enter a 10-digit mobile number"
            inputProps={{ pattern: "[0-9]{10}" }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="register-button"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <a href="/" className="login-link">Log In</a>
        </Typography>
      </Container>
    </div>
  );
};

export default RegisterPage;