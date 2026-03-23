import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await axiosInstance.get('auth/profile/');
      setUser(res.data);
      localStorage.setItem('authUser', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to fetch user profile', err);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Refresh user data from server to get latest address etc.
      fetchUserProfile();
    }
  }, [fetchUserProfile]);

  const login = (tokenData, userData) => {
    localStorage.setItem('authToken', tokenData);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setToken(tokenData);
    setUser(userData);
    fetchUserProfile(); // Get full profile include address
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchUserProfile();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
