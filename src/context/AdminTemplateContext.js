"use client";
import {
  useContext,
  createContext,
  useState,
  useCallback,
} from "react";
import axiosInstance from "../service/api";

const AdminTemplateContext = createContext();

export const AdminTemplateProvider = ({ children }) => {
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateError, setTemplateError] = useState("");

  const fetchTemplateData = useCallback(
    async (endpoint) => {
      setTemplateLoading(true);
      setTemplateError("");
      try {
        const response = await axiosInstance.get(endpoint);
        return response.data;
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || "Failed to fetch template data";
        setTemplateError(errorMessage);
        console.error("Failed to fetch template data:", error);
        return null;
      } finally {
        setTemplateLoading(false);
      }
    },
    []
  );

  const postTemplateData = useCallback(async (endpoint, data = {}) => {
    setTemplateLoading(true);
    setTemplateError("");
    try {
      const response = await axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to post template data";
      setTemplateError(errorMessage);
      console.error("Failed to post template data:", error);
      return null;
    } finally {
      setTemplateLoading(false);
    }
  }, []);

  const putTemplateData = useCallback(async (endpoint, data = {}) => {
    setTemplateLoading(true);
    setTemplateError("");
    try {
      const response = await axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to update template data";
      setTemplateError(errorMessage);
      console.error("Failed to update template data:", error);
      return null;
    } finally {
      setTemplateLoading(false);
    }
  }, []);

  const patchTemplateData = useCallback(async (endpoint, data = {}) => {
    setTemplateLoading(true);
    setTemplateError("");
    try {
      const response = await axiosInstance.patch(endpoint, data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to patch template data";
      setTemplateError(errorMessage);
      console.error("Failed to patch template data:", error);
      return null;
    } finally {
      setTemplateLoading(false);
    }
  }, []);

  const deleteTemplateData = useCallback(async (endpoint) => {
    setTemplateLoading(true);
    setTemplateError("");
    try {
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete template data";
      setTemplateError(errorMessage);
      console.error("Failed to delete template data:", error);
      return null;
    } finally {
      setTemplateLoading(false);
    }
  }, []);

  return (
    <AdminTemplateContext.Provider
      value={{
        templateLoading,
        templateError,
        fetchTemplateData,
        postTemplateData,
        putTemplateData,
        patchTemplateData,
        deleteTemplateData,
        setTemplateError,
      }}
    >
      {children}
    </AdminTemplateContext.Provider>
  );
};

export const useAdminTemplate = () => {
  const context = useContext(AdminTemplateContext);
  if (!context) {
    throw new Error(
      "useAdminTemplate must be used within an AdminTemplateProvider"
    );
  }
  return context;
};
