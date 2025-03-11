// This is a test script to check if the API endpoints are working properly
// Run it with: bun test-api.js

import { fetch } from 'bun';

const API_URL = 'http://localhost:8080/api';

async function testRegister() {
  console.log('Testing register endpoint...');
  
  const testUser = {
    username: `testuser_${Math.floor(Math.random() * 10000)}`,
    email: `test${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'password123'
  };
  
  console.log('Sending request with:', testUser);
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    
    return data;
  } catch (error) {
    console.error('Error testing register:', error);
  }
}

async function testLogin(email, password) {
  console.log('Testing login endpoint...');
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    
    return data;
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

async function main() {
  const registerResult = await testRegister();
  
  if (registerResult && registerResult._id) {
    await testLogin(registerResult.email, 'password123');
  } else {
    console.log('Registration failed, testing login with existing credentials');
    await testLogin('test@example.com', 'password123');
  }
}

main().catch(console.error);