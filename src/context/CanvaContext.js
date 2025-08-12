"use client";
import { useContext, createContext, useState, useCallback } from "react";
import axiosInstance from "@/service/api";

const CanvaContext = createContext();

export const CanvaProvider = ({ children }) => {
  const [canvaLoading, setCanvaLoading] = useState(false);
  const [canvaError, setCanvaError] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const fetchCanvaData = useCallback(async (endpoint, params = {}) => {
    setCanvaLoading(true);
    setCanvaError("");
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
          setCanvaError(response.data.message);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error("Canva API error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      
      const errorMessage =
        error?.response?.data?.message || 
        error?.response?.status === 500 ? "Server error: Please try again later" :
        error?.response?.status === 404 ? "Endpoint not found" :
        error?.response?.status === 401 ? "Unauthorized access" :
        error?.response?.status === 403 ? "Access forbidden" :
        "Failed to fetch Canva data";
      
      setCanvaError(errorMessage);
      return null;
    } finally {
      setCanvaLoading(false);
    }
  }, []);

  const postCanvaData = useCallback(async (endpoint, data = {}) => {
    setCanvaLoading(true);
    setCanvaError("");
    try {
      const response = await axiosInstance.post(endpoint, data);
      
      // Handle success/error messages from backend
      if (response?.data?.message) {
        if (response?.data?.status >= 200 && response?.data?.status < 300) {
        
        } else {
          // Error message
          setCanvaError(response.data.message);
        }
      }
      
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to post Canva data";
      setCanvaError(errorMessage);
      console.error("Failed to post Canva data:", error);
      return null;
    } finally {
      setCanvaLoading(false);
    }
  }, []);

  const putCanvaData = useCallback(async (endpoint, data = {}) => {
    setCanvaLoading(true);
    setCanvaError("");
    try {
      const response = await axiosInstance.put(endpoint, data);
      
      // Handle success/error messages from backend
      if (response?.data?.message) {
        if (response?.data?.status >= 200 && response?.data?.status < 300) {
         
        } else {
          // Error message
          setCanvaError(response.data.message);
        }
      }
      
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to update Canva data";
      setCanvaError(errorMessage);
      console.error("Failed to update Canva data:", error);
      return null;
    } finally {
      setCanvaLoading(false);
    }
  }, []);

  const deleteCanvaData = useCallback(async (endpoint) => {
    setCanvaLoading(true);
    setCanvaError("");
    try {
      const response = await axiosInstance.delete(endpoint);
      
      // Handle success/error messages from backend
      if (response?.data?.message) {
        if (response?.data?.status >= 200 && response?.data?.status < 300) {
        
        } else {
          // Error message
          setCanvaError(response.data.message);
        }
      }
      
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete Canva data";
      setCanvaError(errorMessage);
      console.error("Failed to delete Canva data:", error);
      return null;
    } finally {
      setCanvaLoading(false);
    }
  }, []);

  return (
    <CanvaContext.Provider
      value={{
        canvaLoading,
        canvaError,
        isConnected,
        fetchCanvaData,
        postCanvaData,
        putCanvaData,
        deleteCanvaData,
        setCanvaError,
        setIsConnected,
      }}
    >
      {children}
    </CanvaContext.Provider>
  );
};

export const useCanva = () => {
  const context = useContext(CanvaContext);
  if (!context) {
    throw new Error("useCanva must be used within a CanvaProvider");
  }
  return context;
};
