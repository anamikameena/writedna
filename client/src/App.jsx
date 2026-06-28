import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentProfile from './pages/StudentProfile';
import Submissions from './pages/Submissions';
import SubmissionDetail from './pages/SubmissionDetail';
import Submit from './pages/Submit';
import Login from './pages/Login';
import Register from './pages/Register';

const AppLayout = ({ children }) => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <main style={{ marginLeft: 220, flex: 1, minHeight: '100vh' }}>
      {children}
    </main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/students" element={
            <ProtectedRoute>
              <AppLayout><Students /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/students/:id" element={
            <ProtectedRoute>
              <AppLayout><StudentProfile /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/submissions" element={
            <ProtectedRoute>
              <AppLayout><Submissions /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/submissions/:id" element={
            <ProtectedRoute>
              <AppLayout><SubmissionDetail /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/submit" element={
            <ProtectedRoute>
              <AppLayout><Submit /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
