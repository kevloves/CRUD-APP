import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Tabs } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const { Title } = Typography;
const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
  const { state } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  if (!state.user) {
    return null; // This should be handled by ProtectedRoute
  }

  const updateProfile = async (values: { username: string; email: string }) => {
    try {
      setLoading(true);
      const response = await api.put('/users/profile', values);
      
      if (response.status === 200) {
        message.success('Profile updated successfully');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (values: { password: string }) => {
    try {
      setLoading(true);
      const response = await api.put('/users/profile', values);
      
      if (response.status === 200) {
        message.success('Password updated successfully');
        passwordForm.resetFields();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Title level={2}>Profile</Title>
      
      <Tabs defaultActiveKey="profile">
        <TabPane tab="Profile Information" key="profile">
          <Card>
            <Form
              form={profileForm}
              layout="vertical"
              initialValues={{
                username: state.user.username,
                email: state.user.email,
              }}
              onFinish={updateProfile}
            >
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: 'Please input your username!' },
                  { min: 3, message: 'Username must be at least 3 characters' }
                ]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane tab="Change Password" key="password">
          <Card>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={updatePassword}
            >
              <Form.Item
                name="password"
                label="New Password"
                rules={[
                  { required: true, message: 'Please input your new password!' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProfilePage;