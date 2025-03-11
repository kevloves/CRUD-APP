import React, { useState, useEffect } from 'react';
import { Typography, Table, Button, Modal, message, Badge, Tabs } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import api from '../services/api';
import { getItems, deleteItem } from '../services/itemService';
import { Item } from '../types/item';

const { Title } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState({
    users: true,
    items: true,
  });

  useEffect(() => {
    fetchUsers();
    fetchItems();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(prev => ({ ...prev, items: true }));
      const data = await getItems();
      setItems(data);
    } catch (error) {
      message.error('Failed to fetch items');
    } finally {
      setLoading(prev => ({ ...prev, items: false }));
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const confirmDeleteUser = (id: string) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteUser(id);
      },
    });
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
      message.success('Item deleted successfully');
      fetchItems();
    } catch (error) {
      message.error('Failed to delete item');
    }
  };

  const confirmDeleteItem = (id: string) => {
    confirm({
      title: 'Are you sure you want to delete this item?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteItem(id);
      },
    });
  };

  const userColumns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin: boolean) => (
        isAdmin ? <Badge status="success" text="Admin" /> : <Badge status="default" text="User" />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: User) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => confirmDeleteUser(record._id)}
          disabled={record.isAdmin} // Prevent deleting admin users
        >
          Delete
        </Button>
      ),
    },
  ];

  const itemColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy: { username: string }) => createdBy.username,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: Item) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => confirmDeleteItem(record._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Admin Dashboard</Title>
      
      <Tabs defaultActiveKey="users">
        <TabPane tab="Users Management" key="users">
          <Table
            columns={userColumns}
            dataSource={users}
            rowKey="_id"
            loading={loading.users}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        
        <TabPane tab="Items Management" key="items">
          <Table
            columns={itemColumns}
            dataSource={items}
            rowKey="_id"
            loading={loading.items}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminPage;