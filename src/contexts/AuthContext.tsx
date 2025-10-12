// src/auth/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authLogin } from "../services";

export type Role = 'ADMIN' | 'TEMPLATECREATOR' | 'USER';
export type Status = 'ACTIVE' | 'INACTIVE' | 'BANNED';

type User = {
  id: string;
  email: string;
  username: string;
  role: Role;
  status: Status;
  name?: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (creds: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on app start
  useEffect(() => {
    const initializeAuth = () => {
      console.log('AuthContext: Initializing authentication state');
      
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      console.log('AuthContext: Stored token exists:', !!storedToken);
      console.log('AuthContext: Stored user exists:', !!storedUser);

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('AuthContext: Parsed user:', parsedUser);
          
          // Validate that the user has the required fields
          if (parsedUser.id && parsedUser.email && parsedUser.role) {
            setToken(storedToken);
            setUser(parsedUser);
            console.log('AuthContext: Successfully restored auth state', parsedUser);
          } else {
            console.warn('AuthContext: Invalid user data structure, clearing storage');
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error('AuthContext: Error parsing stored user data:', error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      
      // CRITICAL: Set loading to false AFTER attempting to restore state
      setLoading(false);
      console.log('AuthContext: Initialization complete, loading set to false');
    };

    initializeAuth();
  }, []); // Empty dependency array is correct here

  const login: AuthContextType["login"] = async ({ email, password }) => {
    try {
      setLoading(true); // Set loading during login
      const response = await authLogin({ email, password });
      
      console.log('=== DEBUGGING LOGIN RESPONSE ===');
      console.log('Full response:', response);
      
      const accessToken = response?.token;
      let userData = response?.user || response?.data || response;
      
      if (!accessToken) {
        throw new Error("No access token received");
      }

      if (!userData || !userData.id) {
        throw new Error("No user data received from server");
      }

      localStorage.setItem("token", accessToken);
      setToken(accessToken);

      const normalizedUser = {
        id: userData.id,
        email: userData.email || email,
        username: userData.username || userData.name || email.split('@')[0],
        role: (userData.role || 'USER').toUpperCase() as Role,
        status: userData.status || 'ACTIVE',
        name: userData.name || userData.username
      };
      
      console.log('Normalized user object:', normalizedUser);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      
    } catch (error: any) {
      console.error('AuthContext: Login failed:', error);
      throw error;
    } finally {
      setLoading(false); // Always set loading to false
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out');
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    
    console.log('AuthContext: Logout complete');
  };

  const value: AuthContextType = { 
    user, 
    token, 
    login, 
    logout, 
    loading 
  };

  // Log current state for debugging
  console.log('AuthContext: Current state:', {
    hasUser: !!user,
    userRole: user?.role,
    hasToken: !!token,
    loading
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
