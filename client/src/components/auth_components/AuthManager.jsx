import React, { createContext, useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";

// 🔐 Create Context
export const AuthContext = createContext();

// 🔐 Auth Provider
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error("Token decoding failed:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
        setIsLoggedIn(true);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = decodeToken(token);
    if (decoded) {
      setUser(decoded);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔒 Private Route
export const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isLoggedIn, user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/home"
        replace
        state={{ message: "You need to log in to access this page." }}
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{ message: "You do not have permission to access this page." }}
      />
    );
  }

  return children;
};

// Updated Public Route with Role-Based Redirection
export const PublicRoute = ({ children }) => {
  const { isLoggedIn, user } = useContext(AuthContext);

  if (isLoggedIn && user?.role) {
    switch (user.role) {
      case "superadmin":
        return <Navigate to="/superadmin-dashboard" />;
      case "teacher":
        return <Navigate to="/teacher-dashboard" />;
      case "student":
        return <Navigate to="/student-dashboard" />;
      case "user":
      default:
        return <Navigate to="/dashboard" />;
    }
  }

  return children;
};
