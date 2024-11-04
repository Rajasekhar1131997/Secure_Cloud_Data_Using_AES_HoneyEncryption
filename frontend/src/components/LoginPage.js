// src/components/LoginPage.js

import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login(email, password);
      navigate("/logging-in"); // Redirect to LoggingIn page on successful login
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="overlay">
        <div className="title-container">
          <h1 className="page-title">Securing Cloud Data with AES and Honey Encryption</h1>
        </div>
        <Container component="main" maxWidth="xs" className="login-container">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5" className="login-header">
              Sign In
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
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
                className="login-input"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="login-button"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }} className="login-links">
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
                <Link href="/reset-password" variant="body2">
                  Forgot password?
                </Link>
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default LoginPage;
