// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import RegisterPage from "./components/RegisterPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import LoggingIn from "./components/LoggingIn"; // Import LoggingIn component
import LoggingOut from "./components/LoggingOut";
import UploadInProgress from './components/UploadInProgress';
import RegistrationSuccess from './components/RegistrationSuccess';
import UpdatePasswordPage from "./components/UpdatePasswordPage";
import { AuthProvider } from "./contexts/AuthContext";
import Cookies from "js-cookie";

function App() {
  console.log("csrftoken", Cookies.get("csrftoken"));
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/upload-in-progress" element={<UploadInProgress />} />
          <Route path="/logging-in" element={<LoggingIn />} />
          <Route path="/logging-out" element={<LoggingOut />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
