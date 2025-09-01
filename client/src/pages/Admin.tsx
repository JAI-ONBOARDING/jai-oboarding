import React, { useState, useEffect } from "react";
import LoginForm from "../components/admin/LoginForm";
import Dashboard from "../components/admin/Dashboard";

// API Configuration
import { buildApiUrl } from "../config/api";

// Main App Component
const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);

  const validateToken = async (savedToken: string) => {
    try {
      const response = await fetch(buildApiUrl("auth/me"), {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setToken(savedToken);
        setAdmin(data.admin);
        setIsAuthenticated(true);
      } else {

      }
    } catch (error) {
      
    }
  };

  const handleLogin = (newToken: string, adminData: any) => {
    setToken(newToken);
    setAdmin(adminData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setToken(null);
    setAdmin(null);
    setIsAuthenticated(false);
  };

  return (
    <div>
      {isAuthenticated ? (
        <Dashboard token={token} admin={admin} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default AdminPanel;
