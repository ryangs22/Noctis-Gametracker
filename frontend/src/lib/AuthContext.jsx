import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); 
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('noctis_username');
    
    if (token) {
      setIsAuthenticated(true);
      setUser({ name: savedUsername || 'Viajante' }); 
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    
    setIsLoadingPublicSettings(false);
    setIsLoadingAuth(false);
  };

  const login = (userData, token) => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('noctis_username', userData.name);
    }
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('noctis_username');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const newUser = { ...prev, ...updatedFields };
      if (updatedFields.name) {
        localStorage.setItem('noctis_username', updatedFields.name);
      }
      return newUser;
    });
  };

  const navigateToLogin = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      login, 
      logout,
      updateUser, 
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};