import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Specialists from './pages/Specialists';
import Hospitals from './pages/Hospitals';
import Verification from './pages/Verification';
import BloodRequests from './pages/BloodRequests';
import Donations from './pages/Donations';

// Private Route Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/users/patients" 
          element={
            <PrivateRoute>
              <Patients />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/users/specialists" 
          element={
            <PrivateRoute>
              <Specialists />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/users/hospitals" 
          element={
            <PrivateRoute>
              <Hospitals />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/verification" 
          element={
            <PrivateRoute>
              <Verification />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/blood-requests" 
          element={
            <PrivateRoute>
              <BloodRequests />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/donations" 
          element={
            <PrivateRoute>
              <Donations />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/users" element={<Navigate to="/users/patients" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
