
// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication data on app load
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Validate the stored user data has required fields
        if (parsedUser && parsedUser.id && parsedUser.email) {
          setToken(storedToken);
          setUser(parsedUser);
        } else {
          // Clear invalid data
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData, authToken) => {
    try {
      // Validate user data structure
      if (!userData || !userData.id || !userData.email) {
        throw new Error('Invalid user data received from server');
      }

      // Ensure user has a role property with default value
      const userWithRole = {
        ...userData,
        role: userData.role || 'user' // Default to 'user' if role is missing
      };

      // Store in state
      setUser(userWithRole);
      setToken(authToken);
      
      // Persist to localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(userWithRole));
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const login = async (userData, authToken) => {
    try {
      // Validate user data structure
      if (!userData || !userData.id || !userData.email) {
        throw new Error('Invalid user data received from server');
      }

      // Ensure user has a role property with default value
      const userWithRole = {
        ...userData,
        role: userData.role || 'user' // Default to 'user' if role is missing
      };

      // Store in state
      setUser(userWithRole);
      setToken(authToken);
      
      // Persist to localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(userWithRole));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    console.log('Logout functionality will be implemented in the future');
    // Clear state
    setUser(null);
    setToken(null);
    
    // Remove from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const updateUser = async (updatedUserData) => {
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Call the backend API to update user profile
      const response = await fetch('http://localhost:4000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedUserData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update profile');
      }

      // Update local state with the new user data
      const updatedUser = { ...user, ...updatedUserData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: error.message };
    }
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const refreshToken = async () => {
    console.log('Token refresh functionality will be implemented in the future');
    return { success: false, error: 'Token refresh not implemented yet' };
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
