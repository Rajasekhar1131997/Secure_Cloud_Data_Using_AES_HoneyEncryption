// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import SHA256 from "crypto-js/sha256";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    axios
      .post(
        "http://127.0.0.1:8000/auth/check",
        { user_id: user },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.userid !== undefined) {
          setUser(response.data.userid);
          setLoading(false);
        } else {
          setUser(null);
          setLoading(false);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const formData = {
      email: email,
      password: SHA256(password).toString(),
    };
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // setUser(response.data.user);
      if (response.data.userid !== undefined) {
        setUser(response.data.userid);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
        PromiseRejectionEvent();
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const formData = { user_id: user };
      await axios.post("http://127.0.0.1:8000/auth/logout", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
