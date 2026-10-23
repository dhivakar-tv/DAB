import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentSessionUser,
} from '../services/authService';
import { ROLES } from '../utils/constants';
import { SEED_USERS } from '../services/seedData';
import { updateUserProfile } from '../services/dbService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on initial mount
    const active = getCurrentSessionUser();
    if (active) {
      setUser(active);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await loginUser(email, password);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = await registerUser(userData);
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  // Demo role switcher for testing and demonstration
  const switchDemoRole = (role) => {
    let target = null;
    if (role === ROLES.PATIENT) {
      target = SEED_USERS.find((u) => u.email === 'patient@medicare.demo');
    } else if (role === ROLES.DOCTOR) {
      target = SEED_USERS.find((u) => u.email === 'doctor.sarah@medicare.demo');
    } else if (role === ROLES.ADMIN) {
      target = SEED_USERS.find((u) => u.email === 'admin@medicare.demo');
    }

    if (target) {
      localStorage.setItem('dabs_current_user', JSON.stringify(target));
      setUser(target);
      return target;
    }
  };

  const updateProfileData = async (profileUpdates) => {
    if (!user) return;
    const updated = await updateUserProfile(user.uid, profileUpdates);
    if (updated) {
      const merged = { ...user, ...updated };
      setUser(merged);
      localStorage.setItem('dabs_current_user', JSON.stringify(merged));
    }
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    isPatient: user?.role === ROLES.PATIENT,
    isDoctor: user?.role === ROLES.DOCTOR,
    isAdmin: user?.role === ROLES.ADMIN,
    loading,
    login,
    register,
    logout,
    switchDemoRole,
    updateProfileData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
