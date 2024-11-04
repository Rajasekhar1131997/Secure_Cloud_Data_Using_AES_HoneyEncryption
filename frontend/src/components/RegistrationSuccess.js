import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Container, Box } from "@mui/material";

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login");
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
        You have successfully registered!
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Redirecting to the login page...
      </Typography>
      <Box sx={{ mt: 2 }}>
        <div className="success-animation">🎉</div>
      </Box>
    </Container>
  );
};

export default RegistrationSuccess;