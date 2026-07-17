import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout & Protected Route
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfilePage from './pages/StudentProfilePage';
import AppliedJobs from './pages/AppliedJobs';

// Recruiter Pages
import RecruiterDashboard from './pages/RecruiterDashboard';
import MyJobs from './pages/MyJobs';
import AddJob from './pages/AddJob';
import EditJob from './pages/EditJob';
import Applicants from './pages/Applicants';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="jobs" element={<JobListings />} />
            <Route path="jobs/:id" element={<JobDetails />} />

            {/* Student Protected Routes */}
            <Route
              path="student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/profile"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/applications"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AppliedJobs />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Protected Routes */}
            <Route
              path="recruiter/dashboard"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/jobs"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <MyJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/jobs/new"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <AddJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/jobs/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <EditJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/jobs/:id/applicants"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <Applicants />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
