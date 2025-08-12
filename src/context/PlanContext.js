"use client";
import {
  useContext,
  createContext,
  useState,
  useCallback,
} from "react";
import axiosInstance from "../service/api";

const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState("");

  const fetchPlanData = useCallback(
    async (endpoint) => {
      setPlanLoading(true);
      setPlanError("");
      try {
        // Accept full endpoint; do not append pagination or any params here
        const response = await axiosInstance.get(endpoint);
        return response.data;
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || "Failed to fetch plan data";
        setPlanError(errorMessage);
        console.error("Failed to fetch plan data:", error);
        return null;
      } finally {
        setPlanLoading(false);
      }
    },
    []
  );

  const postPlanData = useCallback(async (endpoint, data = {}) => {
    setPlanLoading(true);
    setPlanError("");
    try {
      const response = await axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to post plan data";
      setPlanError(errorMessage);
      console.error("Failed to post plan data:", error);
      
      // Return error response for better error handling
      return {
        status: error?.response?.status,
        message: errorMessage,
        error: error
      };
    } finally {
      setPlanLoading(false);
    }
  }, []);

  const putPlanData = useCallback(async (endpoint, data = {}) => {
    setPlanLoading(true);
    setPlanError("");
    try {
      const response = await axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to update plan data";
      setPlanError(errorMessage);
      console.error("Failed to update plan data:", error);
      return null;
    } finally {
      setPlanLoading(false);
    }
  }, []);

  const patchPlanData = useCallback(async (endpoint, data = {}) => {
    setPlanLoading(true);
    setPlanError("");
    try {
      const response = await axiosInstance.patch(endpoint, data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to patch plan data";
      setPlanError(errorMessage);
      console.error("Failed to patch plan data:", error);
      return {
        status: error?.response?.status,
        message: errorMessage,
        error: error,
      };
    } finally {
      setPlanLoading(false);
    }
  }, []);

  const deletePlanData = useCallback(async (endpoint) => {
    setPlanLoading(true);
    setPlanError("");
    try {
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete plan data";
      setPlanError(errorMessage);
      console.error("Failed to delete plan data:", error);
      return {
        status: error?.response?.status,
        message: errorMessage,
        error: error,
      };
    } finally {
      setPlanLoading(false);
    }
  }, []);

  return (
    <PlanContext.Provider
      value={{
        planLoading,
        planError,
        fetchPlanData,
        postPlanData,
        putPlanData,
        patchPlanData,
        deletePlanData,
        setPlanError,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error(
      "usePlan must be used within a PlanProvider"
    );
  }
  return context;
};
