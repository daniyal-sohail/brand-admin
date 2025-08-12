"use client";
import { createContext, useContext, useState, useCallback } from "react";
import axiosInstance from "../service/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUserData = useCallback(async (endpoint, params = {}) => {
    setUserLoading(true);
    setUserError("");
    try {
      let url = endpoint;
      if (Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, value);
          }
        });
        url += `?${queryParams.toString()}`;
      }
      
      const response = await axiosInstance.get(url);
      
      // Handle success/error messages from backend
      if (response?.data?.message) {
        if (response?.data?.status >= 200 && response?.data?.status < 300) {
        
        } else {
          // Error message
          setUserError(response.data.message);
        }
      }
      
      return response.data;
    } catch (error) {
      setUserError(error?.response?.data?.message || "Failed to fetch user data");
      console.error("Failed to fetch user data:", error);
      return null;
    } finally {
      setUserLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id) => {
    const result = await fetchUserData(`/user/admin/${id}`);
    if (result?.status === 200 && result?.data) {
      setCurrentUser(result.data);
    }
    return result;
  }, [fetchUserData]);

  const deleteUserData = useCallback(async (id) => {
    setUserLoading(true);
    setUserError("");
    try {
      const response = await axiosInstance.delete(`/user/admin/${id}`);
      
      // Handle success/error messages from backend
      if (response?.data?.message) {
        if (response?.data?.status >= 200 && response?.data?.status < 300) {
        
        } else {
          // Error message
          setUserError(response.data.message);
        }
      }
      
      return response.data;
    } catch (error) {
      setUserError(error?.response?.data?.message || "Failed to delete user");
      console.error("Failed to delete user:", error);
      return null;
    } finally {
      setUserLoading(false);
    }
  }, []);

  const putUserData = useCallback(async (id, data) => {
    setUserLoading(true);
    setUserError("");
    try {
      const response = await axiosInstance.put(`/user/admin/${id}/role`, data);
      
      // Handle success/error messages from backend
      if (response?.data?.message) {
        if (response?.data?.status >= 200 && response?.data?.status < 300) {
         
        } else {
          // Error message
          setUserError(response.data.message);
        }
      }
      
      return response.data;
    } catch (error) {
      setUserError(error?.response?.data?.message || "Failed to update user");
      console.error("Failed to update user:", error);
      return null;
    } finally {
      setUserLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        userLoading,
        userError,
        currentUser,
        fetchUserData,
        fetchUserById,
        deleteUserData,
        putUserData,
        setCurrentUser,
        setUserError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}; 