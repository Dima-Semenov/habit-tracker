import { useState, useCallback } from 'react';

export const useLoading = (defaultValue = false) => {
  const [isLoading, setIsLoading] = useState(defaultValue);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);
  const toggleLoading = useCallback(() => setIsLoading((prev) => !prev), []);

  return { isLoading, startLoading, stopLoading, toggleLoading };
};
