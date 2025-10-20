"use client";
import { useState, useCallback, useRef, useEffect } from "react";

/**
 * History entry representing a snapshot of form data
 * @template T - The type of the form data
 */
interface HistoryEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Configuration options for history management
 */
interface HistoryOptions {
  /** Maximum number of history entries to keep (default: 50) */
  maxSize?: number;
  /** Debounce delay in ms to avoid tracking rapid changes (default: 300) */
  debounceMs?: number;
}

/**
 * Return type for the useQuickFormHistory hook
 * @template T - The type of the form data
 */
export interface UseQuickFormHistoryReturn<T> {
  /** Undo the last change */
  undo: () => void;
  /** Redo the last undone change */
  redo: () => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Clear all history */
  clearHistory: () => void;
  /** Number of items in undo stack */
  historySize: number;
  /** Number of items in redo stack */
  redoSize: number;
  /** Jump to a specific history index */
  jumpTo: (index: number) => void;
}

/**
 * A modular hook that provides undo/redo functionality for form state.
 * Efficiently tracks changes with debouncing and configurable history size.
 * @param data - Current form data (to trigger tracking on changes)
 * @param setData - The setData function from useQuickForm to update form data
 * @param options - Configuration options for history behavior
 * @returns History management utilities
 *
 * @example
 * ```tsx
 * const form = useQuickForm(initialData, schema);
 * const history = useQuickFormHistory(form.data, form.setData, { maxSize: 100 });
 *
 * // Undo/redo actions
 * <button onClick={history.undo} disabled={!history.canUndo}>Undo</button>
 * <button onClick={history.redo} disabled={!history.canRedo}>Redo</button>
 * ```
 */
export function useQuickFormHistory<T extends Record<string, any>>(
  data: T,
  setData: (data: Partial<T>) => void,
  options: HistoryOptions = {}
): UseQuickFormHistoryReturn<T> {
  const { maxSize = 50, debounceMs = 300 } = options;

  const [undoStack, setUndoStack] = useState<HistoryEntry<T>[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryEntry<T>[]>([]);

  // Refs for performance optimization
  const isUndoRedoAction = useRef(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTrackedData = useRef<T | null>(null);
  const isInitialized = useRef(false);
  const hasUserInteracted = useRef(false);

  // Deep comparison with array support
  const hasDataChanged = useCallback((prev: T, current: T): boolean => {
    if (prev === current) return false;

    const keys1 = Object.keys(prev);
    const keys2 = Object.keys(current);

    if (keys1.length !== keys2.length) return true;

    for (const key of keys1) {
      const val1 = prev[key];
      const val2 = current[key];

      // Handle arrays properly
      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (val1.length !== val2.length) return true;
        for (let i = 0; i < val1.length; i++) {
          if (
            typeof val1[i] === "object" &&
            val1[i] !== null &&
            typeof val2[i] === "object" &&
            val2[i] !== null
          ) {
            if (!hasDataChanged(val1[i] as any, val2[i] as any)) continue;
            return true;
          } else if (val1[i] !== val2[i]) {
            return true;
          }
        }
      } else if (
        typeof val1 === "object" &&
        val1 !== null &&
        typeof val2 === "object" &&
        val2 !== null
      ) {
        if (!hasDataChanged(val1 as any, val2 as any)) continue;
        return true;
      } else if (val1 !== val2) {
        return true;
      }
    }

    return false;
  }, []);

  /**
   * Add current state to history with debouncing
   */
  const addToHistory = useCallback(
    (data: T) => {
      // Skip if this is an undo/redo action
      if (isUndoRedoAction.current) return;

      // Skip if user hasn't interacted yet
      if (!hasUserInteracted.current) return;

      // Skip first rerender
      if (
        lastTrackedData.current &&
        !hasDataChanged(lastTrackedData.current, data)
      ) {
        return;
      }

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        const entry: HistoryEntry<T> = {
          data: { ...lastTrackedData.current! },
          timestamp: Date.now(),
        };

        setUndoStack((prev) => {
          const newStack = [...prev, entry];
          if (newStack.length > maxSize) {
            return newStack.slice(newStack.length - maxSize);
          }
          return newStack;
        });

        setRedoStack([]);

        lastTrackedData.current = { ...data };
      }, debounceMs);
    },
    [debounceMs, maxSize, hasDataChanged]
  );

  useEffect(() => {
    if (isInitialized.current) return;

    // Store initial state without adding to history
    lastTrackedData.current = { ...data };
    isInitialized.current = true;
  }, []);

  useEffect(() => {
    if (!isInitialized.current) return;

    if (
      lastTrackedData.current &&
      hasDataChanged(lastTrackedData.current, data)
    ) {
      hasUserInteracted.current = true;
      addToHistory(data);
    }
  }, [data, addToHistory, hasDataChanged]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  /**
   * Undo the last change
   */
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    isUndoRedoAction.current = true;
    const currentData = data;
    const previousEntry = undoStack[undoStack.length - 1];

    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [
      ...prev,
      { data: { ...currentData }, timestamp: Date.now() },
    ]);

    setData(previousEntry.data);
    lastTrackedData.current = previousEntry.data;

    isUndoRedoAction.current = false;
  }, [undoStack, data, setData]);

  /**
   * Redo the last undone change
   */
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    isUndoRedoAction.current = true;
    const currentData = data;
    const nextEntry = redoStack[redoStack.length - 1];

    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [
      ...prev,
      { data: { ...currentData }, timestamp: Date.now() },
    ]);

    setData(nextEntry.data);
    lastTrackedData.current = nextEntry.data;

    isUndoRedoAction.current = false;
  }, [redoStack, data, setData]);

  /**
   * Jump to a specific history index
   */
  const jumpTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= undoStack.length) return;

      isUndoRedoAction.current = true;

      const targetEntry = undoStack[index];
      const currentData = data;

      // Split stack at index
      const newUndoStack = undoStack.slice(0, index);
      const newRedoStack = [
        ...undoStack.slice(index + 1).reverse(),
        { data: { ...currentData }, timestamp: Date.now() },
      ];

      setUndoStack(newUndoStack);
      setRedoStack(newRedoStack);

      // Apply target state
      setData(targetEntry.data);
      lastTrackedData.current = targetEntry.data;

      setTimeout(() => {
        isUndoRedoAction.current = false;
      }, 0);
    },
    [undoStack, data, setData]
  );

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
    lastTrackedData.current = null;
  }, []);

  return {
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    clearHistory,
    historySize: undoStack.length,
    redoSize: redoStack.length,
    jumpTo,
  };
}