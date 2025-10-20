"use client";

import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  type FormEvent,
} from "react";
import { type ZodSchema, ZodError } from "zod/v3";

/**
 * Performance optimization utilities
 */
const shallowEqual = <T extends Record<string, any>>(
  obj1: T,
  obj2: T
): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

const deepEqual = <T extends Record<string, any>>(
  obj1: T,
  obj2: T
): boolean => {
  if (obj1 === obj2) return true;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    // Handle arrays properly
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) return false;
      for (let i = 0; i < val1.length; i++) {
        if (
          typeof val1[i] === "object" &&
          val1[i] !== null &&
          typeof val2[i] === "object" &&
          val2[i] !== null
        ) {
          if (!deepEqual(val1[i], val2[i])) return false;
        } else if (val1[i] !== val2[i]) {
          return false;
        }
      }
    } else if (
      typeof val1 === "object" &&
      val1 !== null &&
      typeof val2 === "object" &&
      val2 !== null
    ) {
      if (!deepEqual(val1, val2)) {
        return false;
      }
    } else if (val1 !== val2) {
      return false;
    }
  }

  return true;
};

/**
 * Custom validation function type that takes form data and returns validation result
 * @template T - The type of the form data
 * @param data - The current form data
 * @returns true if valid, false if invalid, or object with field-specific errors
 */
export type CustomValidator<T> = (data: T) => boolean | Partial<FormErrors<T>>;

/**
 * Union type for validation options - either a Zod schema or custom validator function
 * @template T - The type of the form data
 */
export type ValidationOption<T> = ZodSchema<T> | CustomValidator<T>;

/**
 * Type for form errors that maps form field keys to error messages
 * @template T - The type of the form data
 */
export type FormErrors<T> = {
  [K in keyof T]?: string;
};

/**
 * Form state interface containing the current form data and validation state
 * @template T - The type of the form data
 */
export interface FormState<T> {
  /** Current form data */
  data: T;
  /** Object containing field-specific error messages */
  errors: FormErrors<T>;
  /** Whether the form is currently valid */
  isValid: boolean;
  /** Whether the form has been modified from its initial state */
  isDirty: boolean;
}

/**
 * Form actions interface containing methods to manipulate form data and validation
 * @template T - The type of the form data
 */
export interface FormActions<T> {
  /** Set a single field value */
  set: <K extends keyof T>(field: K, value: T[K]) => void;
  /** Set multiple fields at once */
  setData: (data: Partial<T>) => void;
  /** Clear a specific field (reset to initial value) */
  clearField: <K extends keyof T>(field: K) => void;
  /** Clear all error messages */
  clearErrors: () => void;
  /** Clear error message for a specific field */
  clearFieldError: <K extends keyof T>(field: K) => void;
  /** Reset form to original state */
  reset: () => void;
  /** Handle the form submission, avoiding the default form submission redirection */
  submit: (fn: () => void) => (event: FormEvent<HTMLFormElement>) => void;
  /** Toggle a value in an array field */
  toggleInArray: <K extends keyof T>(
    field: K,
    value: T[K] extends (infer U)[] ? U : never
  ) => void;
}

/**
 * Internal form state interface for module interconnection
 * @template T - The type of the form data
 */
export interface FormStateRef<T> {
  data: T;
  errors: FormErrors<T>;
  originalData: T;
  isDirty: boolean;
  isValid: boolean;
}

/**
 * Complete form hook return type combining state, actions, and utilities
 * @template T - The type of the form data
 */
export interface UseQuickFormReturn<T> extends FormState<T>, FormActions<T> {
  /** Get the current value of a specific field */
  get: <K extends keyof T>(field: K) => T[K];
  /** Check if the form has any errors */
  hasError: () => boolean;
  /** Check if a specific field has been changed from its initial value */
  touched: <K extends keyof T>(field: K) => boolean;
  /** Reference to form state for module interconnection */
  ref: React.MutableRefObject<FormStateRef<T> | null>;
}

/**
 * A powerful React hook for form management with flexible validation
 *
 * @template T - The type of the form data
 * @param initialData - The initial form data object
 * @param validationOption - Either a Zod schema or custom validation function
 * @returns Form state, actions, and utilities for managing the form
 *
 * @example
 * ```tsx
 * // With Zod schema
 * const form = useQuickForm(initialData, zodSchema);
 *
 * // With custom validator
 * const form = useQuickForm(initialData, (data) => data.email.includes('@'));
 * ```
 */
export const useQuickForm = <T extends Record<string, any>>(
  initialData: T,
  validationOption: ValidationOption<T>
): UseQuickFormReturn<T> => {
  const [data, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [originalData] = useState<T>(initialData);

  // Performance optimization: Use refs to avoid unnecessary re-renders
  const validationCacheRef = useRef<{
    data: T;
    result: boolean;
    errors: FormErrors<T>;
  } | null>(null);
  const fieldCacheRef = useRef<Map<keyof T, T[keyof T]>>(new Map());

  // Ref for module interconnection
  const formStateRef = useRef<FormStateRef<T> | null>(null);

  /**
   * Check if form is dirty (has changes from original data)
   * @returns true if the form has been modified from its initial state
   */
  const isDirty = useMemo(() => {
    return !deepEqual(data, originalData);
  }, [data, originalData]);

  /**
   * Helper function to check if validation option is a Zod schema
   * @param option - The validation option to check
   * @returns true if the option is a Zod schema
   */
  const isZodSchema = useCallback(
    (option: ValidationOption<T>): option is ZodSchema<T> => {
      return typeof option === "object" && "parse" in option;
    },
    []
  );

  /**
   * Optimized validation function with caching
   */
  const validateForm = useCallback(() => {
    // Check cache first
    if (
      validationCacheRef.current &&
      deepEqual(validationCacheRef.current.data, data)
    ) {
      return validationCacheRef.current;
    }

    let isValid = false;
    let newErrors: FormErrors<T> = {};

    if (isZodSchema(validationOption)) {
      try {
        validationOption.parse(data);
        isValid = true;
        newErrors = {};
      } catch (error) {
        isValid = false;
        if (error instanceof ZodError) {
          error.errors.forEach((err) => {
            const path = err.path.join(".");
            (newErrors as any)[path] = err.message;
          });
        }
      }
    } else {
      const result = validationOption(data);

      if (typeof result === "boolean") {
        isValid = result;
        if (!result) {
          newErrors = { form: "Form validation failed" } as FormErrors<T>;
        }
      } else {
        newErrors = result;
        isValid = Object.keys(result).length === 0;
      }
    }

    // Cache the result
    validationCacheRef.current = {
      data: { ...data },
      result: isValid,
      errors: newErrors,
    };

    return { result: isValid, errors: newErrors };
  }, [data, validationOption, isZodSchema]);

  /**
   * Check if form is valid based on current data and validation option
   * @returns true if the form is valid, false otherwise
   */
  const isValid = useMemo(() => {
    return validateForm().result;
  }, [validateForm]);

  /**
   * Automatic validation effect - triggers validation whenever form data changes
   */
  useEffect(() => {
    const { errors: newErrors } = validateForm();

    // Only update errors if they've actually changed using shallow comparison
    setErrors((prev) => {
      if (shallowEqual(prev, newErrors)) {
        return prev; // No changes, return previous state
      }
      return newErrors;
    });
  }, [validateForm]);

  /**
   * Update form state ref for module interconnection
   */
  useEffect(() => {
    formStateRef.current = {
      data,
      errors,
      originalData,
      isDirty,
      isValid,
    };
  }, [data, errors, originalData, isDirty, isValid]);

  /**
   * Set a single field value with optimized state update
   * @param field - The field to set
   * @param value - The new value for the field
   */
  const set = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => {
      // Early return if value hasn't changed
      if (prev[field] === value) {
        return prev;
      }

      // Clear validation cache when data changes
      validationCacheRef.current = null;

      return {
        ...prev,
        [field]: value,
      };
    });
  }, []);

  /**
   * Set multiple fields at once with optimized state update
   * @param newData - Partial data object containing fields to update
   */
  const setMultipleData = useCallback((newData: Partial<T>) => {
    setFormData((prev) => {
      let hasChanges = false;
      const updatedData = { ...prev };

      // Check if any values have actually changed
      for (const [key, value] of Object.entries(newData)) {
        if (prev[key as keyof T] !== value) {
          updatedData[key as keyof T] = value as T[keyof T];
          hasChanges = true;
        }
      }

      // Early return if no changes
      if (!hasChanges) {
        return prev;
      }

      // Clear validation cache when data changes
      validationCacheRef.current = null;

      return updatedData;
    });
  }, []);

  /**
   * Clear a specific field (reset to initial value and clear its error)
   * @param field - The field to clear
   */
  const clearField = useCallback(
    <K extends keyof T>(field: K) => {
      setFormData((prev) => {
        // Early return if value is already the initial value
        if (prev[field] === initialData[field]) {
          return prev;
        }

        // Clear validation cache when data changes
        validationCacheRef.current = null;

        return {
          ...prev,
          [field]: initialData[field],
        };
      });

      setErrors((prev) => {
        // Early return if field has no error
        if (!((field as string) in prev)) {
          return prev;
        }

        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    },
    [initialData]
  );

  /**
   * Clear all error messages
   */
  const clearErrors = useCallback(() => {
    setErrors((prev) => {
      // Early return if no errors exist
      if (Object.keys(prev).length === 0) {
        return prev;
      }
      return {};
    });
  }, []);

  /**
   * Clear error message for a specific field
   * @param field - The field to clear the error for
   */
  const clearFieldError = useCallback(<K extends keyof T>(field: K) => {
    setErrors((prev) => {
      // Early return if field has no error
      if (!((field as string) in prev)) {
        return prev;
      }

      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  /**
   * Reset form to original state (same as clear but more explicit)
   */
  const reset = useCallback(() => {
    setFormData((prev) => {
      // Early return if already at original state
      if (deepEqual(prev, originalData)) {
        return prev;
      }

      // Clear validation cache when data changes
      validationCacheRef.current = null;

      return originalData;
    });

    setErrors((prev) => {
      // Early return if no errors exist
      if (Object.keys(prev).length === 0) {
        return prev;
      }
      return {};
    });
  }, [originalData]);

  /**
   * Get the current value of a specific field with memoization
   * @param field - The field to get the value for
   * @returns The current value of the field
   */
  const get = useCallback(
    <K extends keyof T>(field: K): T[K] => {
      // Use field cache for better performance
      const cachedValue = fieldCacheRef.current.get(field);
      const currentValue = data[field];

      if (cachedValue === currentValue) {
        return cachedValue as T[K];
      }

      fieldCacheRef.current.set(field, currentValue);
      return currentValue;
    },
    [data]
  );

  /**
   * Check if the form has any errors with memoization
   * @returns True if the form has any errors, false otherwise
   */
  const hasError = useCallback((): boolean => {
    return Object.values(errors).some((error) => !!error);
  }, [errors]);

  /**
   * Check if a specific field has been changed from its initial value
   * @param field - The field to check
   * @returns True if the field has been changed, false otherwise
   */
  const touched = useCallback(
    <K extends keyof T>(field: K): boolean => {
      return data[field] !== originalData[field];
    },
    [data, originalData]
  );

  /**
   * Toggle a value in an array field
   * @param field - The array field to toggle the value in
   * @param value - The value to toggle
   */
  const toggleInArray = useCallback(
    <K extends keyof T>(
      field: K,
      value: T[K] extends (infer U)[] ? U : never
    ) => {
      setFormData((prev) => {
        const currentArray = prev[field] as any[];

        if (!Array.isArray(currentArray)) {
          console.warn(
            `Field '${String(field)}' is not an array. Cannot toggle value.`
          );
          return prev;
        }

        const index = currentArray.findIndex((item) => {
          if (
            typeof item === "object" &&
            item !== null &&
            typeof value === "object" &&
            value !== null
          ) {
            return deepEqual(item, value as any);
          }
          return item === value;
        });

        let newArray: any[];
        if (index === -1) {
          // Value not found, add it
          newArray = [...currentArray, value];
        } else {
          // Value found, remove it
          newArray = currentArray.filter((_, i) => i !== index);
        }

        // Early return if array hasn't changed
        if (
          currentArray.length === newArray.length &&
          currentArray.every((item, i) => {
            if (
              typeof item === "object" &&
              item !== null &&
              typeof newArray[i] === "object" &&
              newArray[i] !== null
            ) {
              return deepEqual(item, newArray[i]);
            }
            return item === newArray[i];
          })
        ) {
          return prev;
        }

        // Clear validation cache when data changes
        validationCacheRef.current = null;

        return {
          ...prev,
          [field]: newArray as T[K],
        };
      });
    },
    []
  );

  /**
   * Submit the form - returns a function that can be used as onSubmit handler
   * @param fn - The function to execute on form submission
   * @returns A function that handles the form event and calls the provided function
   */
  const submit = useCallback((fn: () => void) => {
    return (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      fn();
    };
  }, []);

  return {
    // State
    data,
    errors,
    isValid,
    isDirty,

    // Actions
    set,
    setData: setMultipleData,
    clearField,
    clearErrors,
    clearFieldError,
    reset,
    toggleInArray,

    // Utilities
    get,
    hasError,
    touched,
    submit,

    // Module interconnection
    ref: formStateRef,
  };
};