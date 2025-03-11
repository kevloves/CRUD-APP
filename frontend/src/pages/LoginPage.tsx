import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { LoginCredentials } from '../types/auth';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const { login, state } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (state.user) {
      navigate('/');
    }
  }, [state.user, navigate]);

  const onFinish = async (values: LoginCredentials) => {
    try {
      await login(values);
      message.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      message.error(error.message || 'Failed to login');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '50px' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={state.loading}>
              Log in
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            Don't have an account? <Link to="/register">Register now!</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;