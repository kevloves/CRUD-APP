import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from './components/AppHeader';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ItemsPage from './pages/ItemsPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import './App.css';

const { Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <AppHeader />
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <div className="site-layout-content" style={{ padding: 24, minHeight: 380 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/items/:id" element={<ItemDetailsPage />} />
              
              {/* Protected Routes */}
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>CRUD ©{new Date().getFullYear()} All Rights Reserved</Footer>
      </Layout>
    </Router>
  );
};

export default App;
