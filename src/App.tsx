import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import AppDetailsPage from './pages/AppDetailsPage';
import CategoryPage from './pages/CategoryPage';
import SearchResultsPage from './pages/SearchResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminAppsPage from './pages/admin/AppsPage';
import AdminAddAppPage from './pages/admin/AddAppPage';
import AdminEditAppPage from './pages/admin/EditAppPage';
import AdminReviewsPage from './pages/admin/ReviewsPage';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="app/:id" element={<AppDetailsPage />} />
              <Route path="category/:category" element={<CategoryPage />} />
              <Route path="search" element={<SearchResultsPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            
            {/* Admin routes - protected by admin check */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboardPage />} />
              <Route path="apps" element={<AdminAppsPage />} />
              <Route path="apps/add" element={<AdminAddAppPage />} />
              <Route path="apps/edit/:id" element={<AdminEditAppPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
