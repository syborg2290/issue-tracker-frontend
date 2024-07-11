import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface Permission {
  name: string;
  description: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  permissions: Permission[];
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  hasPermission: (permissionName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children, navigate }: any) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      navigate("/issues"); // Redirect to profile or another route upon login
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const hasPermission = (permissionName: string) => {
    return (
      user?.permissions.some(
        (permission) => permission.name === permissionName
      ) || false
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const isTokenExpired = (token: string) => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};
