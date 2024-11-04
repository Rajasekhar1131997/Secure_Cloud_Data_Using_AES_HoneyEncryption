// src/components/UploadInProgress.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Container, Box, CircularProgress } from "@mui/material";
import "./UploadInProgress.css"; // Import the CSS file for animation styles

function UploadInProgress() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate upload time (e.g., 3 seconds)
    const timer = setTimeout(() => {
      navigate("/dashboard"); // Redirect back to the dashboard
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigate]);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Your File is being encrypted and uploaded into the cloud securely.
      </Typography>
      <Box className="animation-container">
        <div className="file-icon">📄</div>
        <div className="cloud-icon">☁️</div>
      </Box>
      <Box sx={{ mt: 3 }}>
        <CircularProgress size={30} color="primary" /> {/* Spinner */}
      </Box>
    </Container>
  );
}

export default UploadInProgress;
