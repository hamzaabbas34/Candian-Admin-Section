import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session on mount
    const verifySession = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('authToken');

      if (storedUser && storedToken) {
        try {
          // Verify token is still valid
          const response = await api.get('/auth/verify', {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });

          if (response.data.success) {
            setUser(JSON.parse(storedUser));
            console.log('✅ Session restored from localStorage');
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            setUser(null);
          }
        } catch (error) {
          // Token verification failed, clear storage
          console.log('❌ Session expired or invalid');
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', {
      username,
      password,
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message);
    }

    const userData = data.data.user;
    const token = data.data.token;

    // Store user and token
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', token);

    // Set token in API headers for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    console.log('✅ Login successful, session saved');
  };

  const logout = async () => {
    const token = localStorage.getItem('authToken');
    
    // Call logout endpoint to invalidate token on server
    if (token) {
      try {
        await api.post('/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Clear local state and storage
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];

    console.log('✅ Logged out, session cleared');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

