import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true); // checking stored token

  useEffect(() => {
    const stored = localStorage.getItem('writedna_teacher');
    const token = localStorage.getItem('writedna_token');
    if (stored && token) {
      setTeacher(JSON.parse(stored));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = (token, teacherData) => {
    localStorage.setItem('writedna_token', token);
    localStorage.setItem('writedna_teacher', JSON.stringify(teacherData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setTeacher(teacherData);
  };

  const logout = () => {
    localStorage.removeItem('writedna_token');
    localStorage.removeItem('writedna_teacher');
    delete axios.defaults.headers.common['Authorization'];
    setTeacher(null);
  };

  return (
    <AuthContext.Provider value={{ teacher, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
