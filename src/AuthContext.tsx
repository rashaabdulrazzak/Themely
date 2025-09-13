// src/auth/AuthContext.tsx
import  { createContext, useContext, useState, type ReactNode } from "react";
import { authLogin } from "./services";

type User = {
  email: string;
  // Avoid keeping password in memory after login
  name?: string;
  id?: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (creds: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const login: AuthContextType["login"] = async ({ email, password }) => {
    const response = await authLogin({ email, password });
    
    const accessToken = response.token;

    if (!accessToken) throw new Error("No access token received");

    localStorage.setItem("token", accessToken);
    setToken(accessToken);

    // store a safe subset of the user (don’t keep plaintext password)
    setUser({ email });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = { user, token, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ---- The hook uses THE SAME context instance as the provider
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
