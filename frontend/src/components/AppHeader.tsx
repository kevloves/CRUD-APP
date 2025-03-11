import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { UserOutlined, ShoppingOutlined, LoginOutlined, LogoutOutlined, HomeOutlined, DashboardOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!state.user;
  const isAdmin = state.user?.isAdmin;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
        <Link to="/" style={{ color: 'white' }}>CRUD</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Menu theme="dark" mode="horizontal" selectedKeys={[window.location.pathname]} style={{ lineHeight: '64px' }}>
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/items" icon={<ShoppingOutlined />}>
            <Link to="/items">Items</Link>
          </Menu.Item>
          
          {isAuthenticated && (
            <>
              <Menu.Item key="/profile" icon={<UserOutlined />}>
                <Link to="/profile">Profile</Link>
              </Menu.Item>
              
              {isAdmin && (
                <Menu.Item key="/admin" icon={<DashboardOutlined />}>
                  <Link to="/admin">Admin</Link>
                </Menu.Item>
              )}
              
              <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
              </Menu.Item>
            </>
          )}
        </Menu>
        
        {!isAuthenticated && (
          <Link to="/login">
            <Button type="primary" icon={<LoginOutlined />} style={{ marginLeft: '15px' }}>
              Login/Register
            </Button>
          </Link>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;