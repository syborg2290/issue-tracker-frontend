import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  getUsers,
  getUserById,
  createUser as createUserApi,
  updateUser as updateUserApi,
} from "../services/userService";

// Define types for context data
interface UserContextData {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => void;
  fetchUserById: (userId: string) => void;
  createUser: (userData: Partial<User>) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
}

// Create context
export const UserContext = createContext<UserContextData | undefined>(
  undefined
);

// User provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user by ID
  const fetchUserById = async (userId: string) => {
    setLoading(true);
    try {
      const user = await getUserById(userId);
      if (user) {
        setUsers([user]);
        setError(null);
      } else {
        setError(`User with ID ${userId} not found`);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      const newUser = await createUserApi(userData);
      setUsers([...users, newUser]);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async (userId: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      const updatedUser = await updateUserApi(userId, userData);
      const updatedUsers = users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users initially on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Context data
  const contextValue: UserContextData = {
    users,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
