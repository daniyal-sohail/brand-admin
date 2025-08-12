"use client";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "../service/api";
const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

  const fetchDashboardData = useCallback(async (endpoint) => {
    setDashboardLoading(true);
    setDashboardError("");
    try {
      const response = await axiosInstance.get(endpoint);
      
      // Handle success/error messages from backend
      if (response?.data?.message) {
        if (response?.data?.status >= 200 && response?.data?.status < 300) {
        
        } else {
          // Error message
          setDashboardError(response.data.message);
        }
      }
      
      return response.data;
    } catch (error) {
      setDashboardError(error?.response?.data?.message || "Failed to fetch data");
      console.error("Failed to fetch dashboard data:", error);
      return null;
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider value={{ 
      dashboardLoading, 
      dashboardError, 
      fetchDashboardData 
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
