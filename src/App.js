import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import VaccinsPage from "./pages/VaccinsPage";
import AdminPage from "./pages/AdminPage";
import { AuthProvider, useAuth } from "./firebase/AuthContext";
import { Fade } from "@mui/material";

function PrivateRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Fade in={true} timeout={400} key={location.pathname}>
      <div>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <PrivateRoute allowedRoles={["membre", "secrétaire", "médecin", "dev"]}>
              <HomePage />
            </PrivateRoute>
          } />
          <Route path="/vaccins" element={
            <PrivateRoute allowedRoles={["secrétaire", "médecin", "dev"]}>
              <VaccinsPage />
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={["dev"]}>
              <AdminPage />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Fade>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
