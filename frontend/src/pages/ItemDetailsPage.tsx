import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Card, Descriptions, Spin, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getItemById, updateItem, deleteItem } from '../services/itemService';
import { useAuth } from '../context/AuthContext';
import { Item, ItemFormData } from '../types/item';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { state } = useAuth();
  
  const isOwnerOrAdmin = state.user && item && 
    (state.user._id === item.createdBy._id || state.user.isAdmin);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await getItemById(id);
      setItem(data);
      // Initialize form with current item data
      form.setFieldsValue({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
      });
    } catch (error) {
      message.error('Failed to fetch item details');
      navigate('/items');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values: ItemFormData) => {
    if (!id) return;
    
    try {
      const updatedItem = await updateItem(id, values);
      setItem(updatedItem);
      setIsModalVisible(false);
      message.success('Item updated successfully');
    } catch (error) {
      message.error('Failed to update item');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteItem(id);
      message.success('Item deleted successfully');
      navigate('/items');
    } catch (error) {
      message.error('Failed to delete item');
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this item?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: handleDelete,
    });
  };

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Other'];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '0 0 20px 0',
        borderBottom: '1px solid #f0f0f0' 
      }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/items')}
          style={{ fontSize: '14px', height: '36px' }}
        >
          Back to Items
        </Button>
        
        {isOwnerOrAdmin && (
          <div>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => setIsModalVisible(true)}
              style={{ marginRight: '10px', borderRadius: '6px' }}
            >
              Edit
            </Button>
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={confirmDelete}
              style={{ borderRadius: '6px' }}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      
      <Card
        style={{ 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          padding: '10px'
        }}
      >
        <Title level={2} style={{ marginTop: '10px' }}>{item.title}</Title>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <Text 
            style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1890ff', 
              marginRight: '16px'
            }}
          >
            ${item.price.toFixed(2)}
          </Text>
          <Text 
            style={{ 
              fontSize: '14px', 
              padding: '4px 12px', 
              background: '#f5f5f5', 
              borderRadius: '16px' 
            }}
          >
            {item.category}
          </Text>
        </div>
        
        <div style={{ 
          background: '#f9f9f9', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <Title level={4} style={{ marginTop: 0 }}>Description</Title>
          <div style={{ marginBottom: 0, fontSize: '16px' }}>
            {item.description}
          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid #f0f0f0',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <div>
            <Text type="secondary">Created by</Text>
            <div>
              <Text strong>{item.createdBy.username}</Text>
            </div>
          </div>
          <div>
            <Text type="secondary">Created at</Text>
            <div>
              <Text>{new Date(item.createdAt).toLocaleString()}</Text>
            </div>
          </div>
          <div>
            <Text type="secondary">Updated at</Text>
            <div>
              <Text>{new Date(item.updatedAt).toLocaleString()}</Text>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        title={
          <div style={{ 
            fontSize: '20px', 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            <EditOutlined style={{ marginRight: '10px', color: '#1890ff' }} /> 
            Edit Item
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
          onFinish={handleUpdate}
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
                icon={<EditOutlined />}
              >
                Update Item
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ItemDetailsPage;