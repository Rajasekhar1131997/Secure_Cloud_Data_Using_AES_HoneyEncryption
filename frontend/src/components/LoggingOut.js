// src/components/LoggingOut.js

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Container, Box } from "@mui/material";
import "./LoggingOut.css"; // Import the CSS file for styling

const LoggingOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the login page after 3 seconds
    const timer = setTimeout(() => {
      navigate("/"); // Redirect to the login page
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigate]);

  return (
    <Container className="logging-container">
      <Box className="spinner-container">
        <div className="spinner">🔒</div>
        <Typography variant="h5" className="fade-text">
          Logging out...
        </Typography>
      </Box>
    </Container>
  );
};

export default LoggingOut;