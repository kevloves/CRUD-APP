import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, List, Card, Spin, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getItems, createItem, deleteItem } from '../services/itemService';
import { useAuth } from '../context/AuthContext';
import { Item, ItemFormData } from '../types/item';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { state } = useAuth();
  const isAuthenticated = !!state.user;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(data);
    } catch (error) {
      message.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: ItemFormData) => {
    try {
      await createItem(values);
      message.success('Item created successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchItems();
    } catch (error) {
      message.error('Failed to create item');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      message.success('Item deleted successfully');
      fetchItems();
    } catch (error) {
      message.error('Failed to delete item');
    }
  };

  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this item?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => handleDelete(id),
    });
  };

  const showCreateModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Other'];

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        padding: '20px 0',
        borderBottom: '1px solid #f0f0f0' 
      }}>
        <Title level={2} style={{ margin: 0, fontWeight: 500 }}>
          <span style={{ marginRight: '12px', color: '#1890ff' }}>📦</span>
          Items
        </Title>
        {isAuthenticated && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showCreateModal}
            size="large"
            style={{ 
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)',
              fontWeight: 500 
            }}
          >
            Add Item
          </Button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : items.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 0', 
          background: '#f9f9f9',
          borderRadius: '12px'
        }}>
          <img 
            src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" 
            style={{ width: '120px', marginBottom: '24px', opacity: 0.5 }} 
            alt="No items" 
          />
          <Title level={3} style={{ color: '#999', fontWeight: 'normal' }}>No Items Yet</Title>
          {isAuthenticated ? (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={showCreateModal}
              style={{ marginTop: '16px', borderRadius: '6px' }}
            >
              Create Your First Item
            </Button>
          ) : (
            <Link to="/login">
              <Button type="primary" style={{ marginTop: '16px', borderRadius: '6px' }}>
                Login to Add Items
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <List
          grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={items}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                actions={[
                  <Link to={`/items/${item._id}`} key="view">
                    <EyeOutlined /> View
                  </Link>,
                  ...(state.user && (state.user._id === item.createdBy._id || state.user.isAdmin)
                    ? [
                        <Link to={`/items/${item._id}`} key="edit">
                          <EditOutlined /> Edit
                        </Link>,
                        <a onClick={() => confirmDelete(item._id)} key="delete">
                          <DeleteOutlined /> Delete
                        </a>,
                      ]
                    : []),
                ]}
              >
                <Card.Meta
                  title={
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                      {item.title}
                    </div>
                  }
                  description={
                    <>
                      <p style={{ marginBottom: '12px', color: '#666', minHeight: '60px' }}>
                        {item.description.length > 100 
                          ? `${item.description.substring(0, 100)}...` 
                          : item.description}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid #f0f0f0'
                      }}>
                        <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>${item.price.toFixed(2)}</Text>
                        <Text type="secondary" style={{ 
                          fontSize: '12px', 
                          padding: '2px 8px', 
                          background: '#f5f5f5', 
                          borderRadius: '4px' 
                        }}>{item.category}</Text>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
                        Created by <Text strong>{item.createdBy.username}</Text>
                      </div>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title={
          <div style={{ 
            fontSize: '20px', 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            <PlusOutlined style={{ marginRight: '10px', color: '#1890ff' }} /> 
            Add New Item
          </div>
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
        bodyStyle={{ padding: '24px' }}
        style={{ top: 20 }}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleCreate}
          requiredMark={false}
        >
          <Form.Item
            name="title"
            label={<span style={{ fontSize: '15px' }}>Title</span>}
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input 
              placeholder="Enter item title" 
              style={{ height: '45px', borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span style={{ fontSize: '15px' }}>Description</span>}
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter item description"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="price"
              label={<span style={{ fontSize: '15px' }}>Price</span>}
              rules={[{ required: true, message: 'Please enter a price' }]}
              style={{ flex: 1 }}
            >
              <InputNumber 
                min={0} 
                step={0.01} 
                style={{ width: '100%', height: '45px', borderRadius: '6px' }}
                placeholder="0.00"
              />
            </Form.Item>

            <Form.Item
              name="category"
              label={<span style={{ fontSize: '15px' }}>Category</span>}
              rules={[{ required: true, message: 'Please select a category' }]}
              style={{ flex: 1 }}
            >
              <Select
                placeholder="Select a category"
                style={{ width: '100%', height: '45px', borderRadius: '6px' }}
                dropdownStyle={{ borderRadius: '6px' }}
              >
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item style={{ marginTop: '16px', marginBottom: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button 
                onClick={() => setIsModalVisible(false)}
                style={{ borderRadius: '6px', height: '40px' }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{ 
                  borderRadius: '6px', 
                  height: '40px', 
                  paddingLeft: '24px', 
                  paddingRight: '24px',
                  fontWeight: 500
                }}
                icon={<PlusOutlined />}
              >
                Create Item
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ItemsPage;