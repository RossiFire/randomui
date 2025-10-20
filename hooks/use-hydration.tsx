"use client";
import { useEffect, useState } from "react";

/**
 * Hook to check if we're in client-side context
 * @returns {boolean} isMounted
 */
export const useHydration = (): boolean => {
  const [isMounted, setIsMounded] = useState(false);

  useEffect(() => {
    setIsMounded(true);
  }, []);

  return isMounted;
};