"use client";
import {
  useContext,
  createContext,
  useState,
  useCallback,
} from "react";
import axiosInstance from "../service/api";

const FAQContext = createContext();

export const FAQProvider = ({ children }) => {
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqError, setFaqError] = useState("");

  const fetchFAQData = useCallback(async (url) => {
    setFaqLoading(true);
    setFaqError("");
    try {
      const response = await axiosInstance.get(url);
      return response;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to fetch FAQ data";
      setFaqError(errorMessage);
      console.error("Failed to fetch FAQ data:", error);
      return null;
    } finally {
      setFaqLoading(false);
    }
  }, []);

  const postFAQData = useCallback(async (endpoint, data = {}) => {
    setFaqLoading(true);
    setFaqError("");
    try {
      const response = await axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to post FAQ data";
      setFaqError(errorMessage);
      console.error("Failed to post FAQ data:", error);
      return null;
    } finally {
      setFaqLoading(false);
    }
  }, []);

  const putFAQData = useCallback(async (endpoint, data = {}) => {
    setFaqLoading(true);
    setFaqError("");
    try {
      const response = await axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to update FAQ data";
      setFaqError(errorMessage);
      console.error("Failed to update FAQ data:", error);
      return null;
    } finally {
      setFaqLoading(false);
    }
  }, []);

  const deleteFAQData = useCallback(async (endpoint) => {
    setFaqLoading(true);
    setFaqError("");
    try {
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to delete FAQ data";
      setFaqError(errorMessage);
      console.error("Failed to delete FAQ data:", error);
      return null;
    } finally {
      setFaqLoading(false);
    }
  }, []);



  return (
    <FAQContext.Provider value={{
      faqLoading,
      faqError,
      fetchFAQData,
      postFAQData,
      putFAQData,
      deleteFAQData,
      setFaqError
    }}>
      {children}
    </FAQContext.Provider>
  );
};

export const useFAQ = () => {
  const context = useContext(FAQContext);
  if (!context) {
    throw new Error("useFAQ must be used within a FAQProvider");
  }
  return context;
}; 