// src/components/LoggingIn.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, CircularProgress, Box } from "@mui/material";
import "./LoggingIn.css";

const messages = ["Authenticating...", "Securing connection...", "Logging in..."];

const LoggingIn = () => {
  const navigate = useNavigate();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 3000);

    const messageInterval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(messageInterval);
    };
  }, [navigate]);

  return (
    <Container className="logging-container">
      <Box className="spinner-container">
        <CircularProgress color="inherit" size={30} className="spinner" />
        <Box className="fade-text">{messages[messageIndex]}</Box>
      </Box>
    </Container>
  );
};

export default LoggingIn;

