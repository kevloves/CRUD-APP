import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';
import api from '../services/api';

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Set the auth header for API calls
        api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await api.post('/auth/login', credentials);
      const user = response.data;
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set the auth header for API calls
      api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred during login';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      throw new Error(message);
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      console.log('Register request:', data);
      const response = await api.post('/auth/register', data);
      console.log('Register response:', response.data);
      const user = response.data;
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set the auth header for API calls
      api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error: any) {
      console.error('Register error:', error);
      const message = error.response?.data?.message || 'An error occurred during registration';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      throw new Error(message);
    }
  };

  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem('user');
    
    // Remove auth header
    delete api.defaults.headers.common['Authorization'];
    
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};