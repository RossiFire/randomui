"use client";
import { useRef, useCallback, useMemo, useEffect, useState } from "react";
import type { FormStateRef } from "./useQuickForm";

export interface FormAnalytics {
  /** Number of interactions per field */
  fieldInteractions: Record<string, number>;
  /** Time spent on each field in milliseconds */
  timeOnField: Record<string, number>;
  /** Fields that were focused but left empty */
  abandonedFields: string[];
  /** Form completion rate (0-1) */
  completionRate: number;
  /** Error rate per field (0-1) */
  errorRate: Record<string, number>;
  /** Timestamp when form was first interacted with */
  formStartTime: number | null;
  /** Timestamp when form was submitted */
  formEndTime: number | null;
  /** Total time spent on form in milliseconds */
  totalFormTime: number;
}

export interface UseQuickFormAnalyticsReturn {
  /** Current analytics data */
  analytics: FormAnalytics;
  /** Track field focus event */
  trackFocus: (field: string) => void;
  /** Track field blur event */
  trackBlur: (field: string) => void;
  /** Track form submission */
  trackSubmit: () => void;
  /** Reset all analytics */
  resetAnalytics: () => void;
}

/**
 * Type helper to extract form data type from form ref
 */
type ExtractFormDataType<T> = T extends React.RefObject<FormStateRef<
  infer U
> | null>
  ? U
  : never;

/**
 * A performant analytics hook that tracks form interactions and provides insights.
 *
 * @param formRef - Reference to the form state from useQuickForm
 * @returns Analytics data and tracking utilities
 *
 * @example
 * ```tsx
 * const form = useQuickForm(initialData, schema);
 * const analytics = useQuickFormAnalytics(form.ref);
 *
 * <input
 *   onFocus={() => analytics.trackFocus('email')}
 *   onBlur={() => analytics.trackBlur('email')}
 * />
 *
 * <button onClick={() => {
 *   handleSubmit();
 *   analytics.trackSubmit();
 * }}>Submit</button>
 * ```
 */
export function useQuickFormAnalytics<
  T extends React.RefObject<FormStateRef<any> | null>
>(formRef: T): UseQuickFormAnalyticsReturn {
  const fieldInteractionsRef = useRef<Record<string, number>>({});
  const timeOnFieldRef = useRef<Record<string, number>>({});
  const fieldFocusTimeRef = useRef<Record<string, number>>({});
  const abandonedFieldsRef = useRef<Set<string>>(new Set());
  const fieldErrorCountRef = useRef<Record<string, number>>({});
  const fieldTotalCountRef = useRef<Record<string, number>>({});
  const formStartTimeRef = useRef<number | null>(null);
  const formEndTimeRef = useRef<number | null>(null);
  const previousErrorsRef = useRef<Record<string, string | undefined>>({});

  const [updateCounter, setUpdateCounter] = useState(0);
  const triggerUpdate = useCallback(() => {
    setUpdateCounter((c) => c + 1);
  }, []);

  /**
   * Track field focus
   */
  const trackFocus = useCallback((field: string) => {
    const now = Date.now();

    // Initialize form start time on first interaction
    if (!formStartTimeRef.current) {
      formStartTimeRef.current = now;
    }

    // Track interaction count
    fieldInteractionsRef.current[field] =
      (fieldInteractionsRef.current[field] || 0) + 1;

    // Record focus time for calculating time on field
    fieldFocusTimeRef.current[field] = now;

    // Initialize total count for error rate calculation
    if (!fieldTotalCountRef.current[field]) {
      fieldTotalCountRef.current[field] = 0;
    }
  }, []);

  /**
   * Track field blur - O(1) operation
   */
  const trackBlur = useCallback(
    (field: string) => {
      const now = Date.now();
      const focusTime = fieldFocusTimeRef.current[field];

      if (focusTime) {
        // Accumulate time spent on field
        const duration = now - focusTime;
        timeOnFieldRef.current[field] =
          (timeOnFieldRef.current[field] || 0) + duration;
        delete fieldFocusTimeRef.current[field];
      }

      // Check if field was abandoned (focused but left empty)
      const formState = formRef.current;
      if (formState) {
        const value = formState.data[field as keyof ExtractFormDataType<T>];
        const isEmpty =
          value === "" ||
          value === null ||
          value === undefined ||
          (Array.isArray(value) && value.length === 0);

        if (isEmpty && fieldInteractionsRef.current[field] > 0) {
          abandonedFieldsRef.current.add(field);
        } else {
          abandonedFieldsRef.current.delete(field);
        }
      }

      triggerUpdate();
    },
    [formRef, triggerUpdate]
  );

  /**
   * Track form submission
   */
  const trackSubmit = useCallback(() => {
    formEndTimeRef.current = Date.now();
    triggerUpdate();
  }, [triggerUpdate]);

  /**
   * Track error and data changes efficiently
   */
  useEffect(() => {
    const formState = formRef.current;
    if (!formState) return;

    const currentErrors = formState.errors;

    // Compare with previous errors
    Object.keys(currentErrors).forEach((field) => {
      const hadError = previousErrorsRef.current[field];
      const hasError = currentErrors[field];

      // Increment error count if new error appeared
      if (hasError && !hadError) {
        fieldErrorCountRef.current[field] =
          (fieldErrorCountRef.current[field] || 0) + 1;
        fieldTotalCountRef.current[field] =
          (fieldTotalCountRef.current[field] || 0) + 1;
      } else if (!hasError && hadError) {
        // Increment total count when error is fixed
        fieldTotalCountRef.current[field] =
          (fieldTotalCountRef.current[field] || 0) + 1;
      }
    });

    previousErrorsRef.current = { ...currentErrors };
    triggerUpdate();
  }, [
    formRef,
    JSON.stringify(formRef.current?.data),
    JSON.stringify(formRef.current?.errors),
    triggerUpdate,
  ]);

  const analytics = useMemo((): FormAnalytics => {
    const formState = formRef.current;
    if (!formState) {
      return {
        fieldInteractions: {},
        timeOnField: {},
        abandonedFields: [],
        completionRate: 0,
        errorRate: {},
        formStartTime: null,
        formEndTime: null,
        totalFormTime: 0,
      };
    }

    // Calculate completion rate
    const allFields = Object.keys(formState.data);
    const filledFields = allFields.filter((key) => {
      const value = formState.data[key as keyof typeof formState.data];
      const hasError = (formState.errors as Record<string, string | undefined>)[
        key
      ];

      if (hasError) {
        return false;
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== "" && value !== null && value !== undefined;
    });
    const completionRate =
      allFields.length > 0 ? filledFields.length / allFields.length : 0;

    // Calculate error rate per field
    const errorRate: Record<string, number> = {};
    Object.keys(fieldTotalCountRef.current).forEach((field) => {
      const total = fieldTotalCountRef.current[field];
      const errors = fieldErrorCountRef.current[field] || 0;
      errorRate[field] = total > 0 ? errors / total : 0;
    });

    // Calculate total form time
    const totalFormTime =
      formStartTimeRef.current && formEndTimeRef.current
        ? formEndTimeRef.current - formStartTimeRef.current
        : formStartTimeRef.current
        ? Date.now() - formStartTimeRef.current
        : 0;

    return {
      fieldInteractions: { ...fieldInteractionsRef.current },
      timeOnField: { ...timeOnFieldRef.current },
      abandonedFields: Array.from(abandonedFieldsRef.current),
      completionRate,
      errorRate,
      formStartTime: formStartTimeRef.current,
      formEndTime: formEndTimeRef.current,
      totalFormTime,
    };
  }, [formRef, updateCounter]);

  /**
   * Reset analytics
   */
  const resetAnalytics = useCallback(() => {
    fieldInteractionsRef.current = {};
    timeOnFieldRef.current = {};
    fieldFocusTimeRef.current = {};
    abandonedFieldsRef.current.clear();
    fieldErrorCountRef.current = {};
    fieldTotalCountRef.current = {};
    formStartTimeRef.current = null;
    formEndTimeRef.current = null;
    previousErrorsRef.current = {};
    triggerUpdate();
  }, [triggerUpdate]);

  return {
    analytics,
    trackFocus,
    trackBlur,
    trackSubmit,
    resetAnalytics,
  };
}