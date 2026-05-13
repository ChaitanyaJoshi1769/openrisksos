'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  email: string;
  tenantId: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, tenantId: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage
  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem('userEmail');
      const storedTenantId = localStorage.getItem('tenantId');

      if (storedEmail && storedTenantId) {
        setUser({ email: storedEmail, tenantId: storedTenantId });
      }
    } catch (error) {
      console.error('Failed to initialize user from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, tenantId: string) => {
    const newUser = { email, tenantId };
    setUser(newUser);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('tenantId', tenantId);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('authToken');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
