import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Row, Col, Card, Button } from 'antd';
import { ShoppingOutlined, UserOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Paragraph } = Typography;
const { Meta } = Card;

const HomePage: React.FC = () => {
  const { state } = useAuth();
  const isAuthenticated = !!state.user;

  return (
    <div style={{ padding: '20px' }}>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card
            hoverable
            cover={<div style={{ background: '#1890ff', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ShoppingOutlined style={{ fontSize: '64px', color: 'white' }} />
            </div>}
          >
            <Meta
              title="Browse Items"
              description="Browse through our collection of items. See details and find what you need."
            />
            <div style={{ marginTop: '20px' }}>
              <Link to="/items">
                <Button type="primary" block>
                  View Items
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card
            hoverable
            cover={<div style={{ background: '#52c41a', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <AppstoreOutlined style={{ fontSize: '64px', color: 'white' }} />
            </div>}
          >
            <Meta
              title="Create Items"
              description="Add your own items to the collection. Share with the community."
            />
            <div style={{ marginTop: '20px' }}>
              <Link to={isAuthenticated ? "/items" : "/login"}>
                <Button type="primary" block>
                  {isAuthenticated ? "Add Item" : "Login to Create"}
                </Button>
              </Link>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            hoverable
            cover={<div style={{ background: '#722ed1', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <UserOutlined style={{ fontSize: '64px', color: 'white' }} />
            </div>}
          >
            <Meta
              title="Manage Profile"
              description="Update your profile information and view your activity."
            />
            <div style={{ marginTop: '20px' }}>
              <Link to={isAuthenticated ? "/profile" : "/login"}>
                <Button type="primary" block>
                  {isAuthenticated ? "View Profile" : "Login"}
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default HomePage;