import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sos_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true); // Initially true, as we're checking localStorage

  useEffect(() => {
    // This effect runs once on mount to finalize auth state
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem('sos_user');
      if (savedUser) setUser(JSON.parse(savedUser));
      setLoading(false); // Authentication check from localStorage is complete
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('sos_token', data.token);
    localStorage.setItem('sos_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('sos_token', data.token);
    localStorage.setItem('sos_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('sos_token');
    localStorage.removeItem('sos_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
