import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CURRENT_USER_DEFAULT } from '../data/mockData';
import { loadFromStorage, saveToStorage, clearStorageKey } from '../utils/storage';
import authService from '../services/authService';
import profileService, { normalizeStudentProfile } from '../services/profileService';
import { getStoredToken } from '../services/apiClient';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'skill_exchange_current_user';
const STORAGE_KEY_AUTH = 'skill_exchange_is_logged_in';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return loadFromStorage(STORAGE_KEY_USER, CURRENT_USER_DEFAULT);
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return loadFromStorage(STORAGE_KEY_AUTH, true); // default true for demo exploration
  });

  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_USER, currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_AUTH, isLoggedIn);
  }, [isLoggedIn]);

  // Attempt to synchronize with real backend session if token exists
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      authService
        .getCurrentUser()
        .then((userData) => {
          setIsBackendConnected(true);
          const normalized = normalizeStudentProfile(userData);
          if (normalized) {
            setCurrentUser((prev) => ({
              ...prev,
              ...normalized,
              notifications: prev?.notifications || CURRENT_USER_DEFAULT.notifications,
              privacy: prev?.privacy || CURRENT_USER_DEFAULT.privacy,
            }));
            setIsLoggedIn(true);
          }
        })
        .catch(() => {
          setIsBackendConnected(false);
        });
    }
  }, []);

  const login = async (email, password, rememberMe = true) => {
    try {
      const response = await authService.login(email, password, rememberMe);
      setIsBackendConnected(true);
      if (response?.user) {
        const normalized = normalizeStudentProfile(response.user);
        const mergedUser = {
          ...CURRENT_USER_DEFAULT,
          ...normalized,
          email: response.user.email || email,
          notifications: currentUser?.notifications || CURRENT_USER_DEFAULT.notifications,
          privacy: currentUser?.privacy || CURRENT_USER_DEFAULT.privacy,
        };
        setCurrentUser(mergedUser);
        setIsLoggedIn(true);
        return { success: true, user: mergedUser, fromBackend: true };
      }
    } catch (err) {
      // If error is unauthorized (invalid credentials), rethrow so UI shows error
      if (err.status === 401 || err.status === 400) {
        throw err;
      }
      // If server is unavailable / offline, fall back to offline demo login
      console.warn('Backend unavailable during login, falling back to local session', err);
      setIsBackendConnected(false);
    }

    // Demo fallback login handler
    setIsLoggedIn(true);
    return { success: true, user: currentUser, fromBackend: false };
  };

  const signup = async (formData) => {
    // Convert form skills strings into structured arrays
    const formattedOffered = Array.isArray(formData.skillsOffered)
      ? formData.skillsOffered
      : (formData.skillsOffered || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((name) => ({ name, level: 'Intermediate', category: 'general' }));

    const formattedDesired = Array.isArray(formData.skillsDesired)
      ? formData.skillsDesired
      : (formData.skillsDesired || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((name) => ({ name, priority: 'High', category: 'general' }));

    try {
      const payload = {
        name: formData.name || 'New Student',
        email: formData.email,
        password: formData.password || 'password123',
        college: formData.college || 'University Partner',
        course: formData.course || 'Student',
        yearOfStudy: formData.year || '1st Year',
        bio: formData.bio || 'Excited to learn new skills and share what I know with fellow students!',
        skillsOffered: formattedOffered.map((s) => ({
          name: typeof s === 'string' ? s : s.name,
          category: s.category || 'general',
          level: s.level || 'Intermediate',
        })),
        learningGoals: formattedDesired.map((g) => ({
          name: typeof g === 'string' ? g : g.name,
          priority: g.priority || 'High',
        })),
      };

      const response = await authService.register(payload);
      setIsBackendConnected(true);
      if (response?.user) {
        const normalized = normalizeStudentProfile(response.user);
        const newUser = {
          ...CURRENT_USER_DEFAULT,
          ...normalized,
          email: response.user.email || formData.email,
        };
        setCurrentUser(newUser);
        setIsLoggedIn(true);
        return { success: true, user: newUser, fromBackend: true };
      }
    } catch (err) {
      if (err.status === 400 || err.status === 409) {
        throw err;
      }
      console.warn('Backend unavailable during registration, saving local user', err);
      setIsBackendConnected(false);
    }

    const newUser = {
      ...CURRENT_USER_DEFAULT,
      id: 'user-' + Date.now(),
      name: formData.name || 'New Student',
      email: formData.email,
      college: formData.college || 'University Partner',
      course: formData.course || 'Student',
      year: formData.year || '1st Year',
      bio: formData.bio || 'Excited to learn new skills and share what I know with fellow students!',
      skillsOffered: formattedOffered.length ? formattedOffered : CURRENT_USER_DEFAULT.skillsOffered,
      skillsDesired: formattedDesired.length ? formattedDesired : CURRENT_USER_DEFAULT.skillsDesired,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    };

    setCurrentUser(newUser);
    setIsLoggedIn(true);
    return { success: true, user: newUser, fromBackend: false };
  };

  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
  };

  const updateProfile = useCallback(async (updatedFields) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));

    try {
      if (getStoredToken()) {
        await profileService.updateMyProfile(updatedFields);
      }
    } catch (e) {
      console.warn('Could not sync profile update to backend', e);
    }
  }, []);

  const resetDemoData = () => {
    authService.logout();
    clearStorageKey(STORAGE_KEY_USER);
    clearStorageKey('skill_exchange_exchanges');
    clearStorageKey('skill_exchange_sessions');
    clearStorageKey('skill_exchange_conversations');
    clearStorageKey('skill_exchange_custom_skills');
    setCurrentUser(CURRENT_USER_DEFAULT);
    setIsLoggedIn(true);
    // Reload to guarantee all stores reload default data
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        isBackendConnected,
        login,
        signup,
        logout,
        updateProfile,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
