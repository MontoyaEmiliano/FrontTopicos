// src/hooks/useFetch.js
import { useState, useCallback } from "react";

export default function useFetch(apiFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (err) {
      const message = err.response?.data?.detail || err.message || "Error desconocido";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  return { data, loading, error, load, setData };
}