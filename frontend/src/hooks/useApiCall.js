import { useState, useCallback } from 'react';

const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const execute = useCallback(async (apiFunction, successMessage = null) => {
    try {
      setLoading(true);
      setError(null);
      if (successMessage) setSuccess(null);

      const result = await apiFunction();

      if (successMessage) {
        setSuccess(successMessage);
        setTimeout(() => setSuccess(null), 3000);
      }

      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  return {
    loading,
    error,
    success,
    execute,
    clearError
  };
};

export default useApiCall;
