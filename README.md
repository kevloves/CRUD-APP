# Containerized CRUD Application
<img width="1276" alt="Screenshot 2025-03-10 at 9 19 44 PM" src="https://github.com/user-attachments/assets/d88c53fb-92a3-4105-9d33-2427d45bc826" />

A full-stack web application with CRUD functionality, authentication, and containerization.

## Features

- **Backend**: Node.js with Express, MongoDB, JWT authentication, rate limiting
- **Frontend**: React with Ant Design UI components
- **Containerization**: Docker with docker-compose for easy development and deployment
- **Authentication**: JWT-based user authentication and authorization
- **CRUD Operations**: Create, read, update, and delete items
- **Admin Dashboard**: Manage users and items from an admin interface

## Project Structure

```
crud-app/
├── backend/           # Node.js Express API
│   ├── src/           # Backend source code
│   ├── .env           # Environment variables
│   └── Dockerfile     # Backend Docker image config
├── frontend/          # React frontend
│   ├── src/           # Frontend source code
│   └── Dockerfile     # Frontend Docker image config
├── docker-compose.yml         # Production Docker Compose config
├── docker-compose.override.yml # Development Docker Compose config
└── README.md          # Project documentation
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Bun (for local development)

### Running with Docker (Recommended)

1. Clone the repository
2. Start the application:

```bash
# For development environment with hot reloading
docker-compose up

# For production build
docker-compose -f docker-compose.yml up
```

The development environment will start:
- MongoDB database
- Backend API server on port 8080 (using Bun)
- Frontend dev server on port 3000 (using Node.js)

The production environment will start:
- Backend API server on port 5001
- Frontend web server on port 80

### Local Development

1. Start the MongoDB container:

```bash
docker-compose up mongodb
```

2. Install backend dependencies and start server:

```bash
cd backend
bun install
bun dev
```

3. Install frontend dependencies and start development server:

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Users

- `GET /api/users/profile` - Get user profile (requires authentication)
- `PUT /api/users/profile` - Update user profile (requires authentication)
- `GET /api/users` - Get all users (requires admin authentication)
- `DELETE /api/users/:id` - Delete a user (requires admin authentication)

### Items

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get a specific item
- `POST /api/items` - Create a new item (requires authentication)
- `PUT /api/items/:id` - Update an item (requires authentication and ownership)
- `DELETE /api/items/:id` - Delete an item (requires authentication and ownership)

## Environment Variables

### Backend

- `NODE_ENV` - Environment (development/production)
- `PORT` - API server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - JWT token expiration time
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window in ms
- `RATE_LIMIT_MAX` - Maximum requests in rate limit window

### Frontend

- `REACT_APP_API_URL` - Backend API URL
