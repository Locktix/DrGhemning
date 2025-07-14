import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import VaccinsPage from "./pages/VaccinsPage";
import AdminPage from "./pages/AdminPage";
import { AuthProvider, useAuth } from "./firebase/AuthContext";

function PrivateRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
