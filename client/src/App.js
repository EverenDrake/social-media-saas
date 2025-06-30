import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ApiProvider } from './contexts/ApiContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PostsPage from './pages/PostsPage';
import CreatePostPage from './pages/CreatePostPage';
import SocialAccountsPage from './pages/SocialAccountsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Main Layout Component
const Layout = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return children;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ApiProvider>
          <Router>
            <Layout>
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/posts" 
                element={
                  <ProtectedRoute>
                    <PostsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/posts/create" 
                element={
                  <ProtectedRoute>
                    <CreatePostPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/social-accounts" 
                element={
                  <ProtectedRoute>
                    <SocialAccountsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <AnalyticsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />
              </Routes>
            </Layout>
            <Toaster position="top-right" />
          </Router>
        </ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
