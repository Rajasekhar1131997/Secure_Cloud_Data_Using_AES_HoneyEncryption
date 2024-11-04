// src/Dashboard.js

import React, { useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import FileList from "./FileList";
import { useAuth } from "../contexts/AuthContext";
import FileUploadDialog from "./FileUpload";
import "./Dashboard.css"; // Import the custom CSS

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/logging-out"); // Navigate to LoggingOut page
  };

  const handleUpload = () => {
    setRefresh((prev) => !prev); // Toggle state to trigger a refresh
  };

  return user ? (
    <div className="dashboard-page">
      <Container component="main" maxWidth="md" className="dashboard-card">
        <Typography variant="h4" component="h1" className="dashboard-header">
          Welcome to the Dashboard
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          className="dashboard-button"
          sx={{ mt: 2, mb: 3 }}
        >
          Upload your Files Here
        </Button>
        <FileUploadDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          user_id={user}
          onUpload={handleUpload}
        />
        <div className="file-list">
          <FileList user_id={user} refresh={refresh} />
        </div>
        <Button
          onClick={handleLogout}
          variant="contained"
          className="logout-button"
          sx={{ mt: 3 }}
        >
          Logout
        </Button>
      </Container>
    </div>
  ) : (
    <Navigate to="/" />
  );
}

export default Dashboard;