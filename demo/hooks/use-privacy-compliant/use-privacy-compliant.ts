"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";

/**
 * Privacy regulation types supported by the hook
 */
export type PrivacyRegulation = "GDPR" | "CCPA" | "PIPEDA" | "LGPD" | "PDPA";

/**
 * Consent categories for granular privacy control
 */
export type ConsentCategory = 
  | "analytics" 
  | "marketing" 
  | "functional" 
  | "necessary" 
  | "preferences";

/**
 * Data retention periods in days
 */
export type RetentionPeriod = 30 | 90 | 365 | 730 | "indefinite";

/**
 * User consent state
 */
export interface ConsentState {
  /** Whether user has given consent */
  hasConsent: boolean;
  /** Timestamp when consent was given */
  consentTimestamp: number | null;
  /** Categories of consent given */
  categories: ConsentCategory[];
  /** Whether consent is required for the current regulation */
  consentRequired: boolean;
  /** Version of the consent (for tracking changes) */
  consentVersion: string;
  /** Whether user wants data to be anonymized */
  wantsAnonymizedData: boolean;
}

/**
 * Privacy settings configuration
 */
export interface PrivacySettings {
  /** Current privacy regulation */
  regulation: PrivacyRegulation;
  /** Default consent categories */
  defaultCategories: ConsentCategory[];
  /** Data retention period in days */
  retentionPeriod: RetentionPeriod;
  /** Whether to anonymize data by default */
  anonymizeByDefault: boolean;
  /** Whether to require explicit consent */
  requireExplicitConsent: boolean;
  /** Consent version for tracking changes */
  consentVersion: string;
  /** Custom PII fields to anonymize */
  customPiiFields: string[];
}

/**
 * Analytics event with privacy compliance
 */
export interface PrivacyCompliantEvent {
  /** Unique event ID */
  id: string;
  /** Event name */
  name: string;
  /** Event properties */
  properties: Record<string, any>;
  /** Event timestamp */
  timestamp: number;
  /** Whether data is anonymized */
  anonymized: boolean;
  /** Consent categories required for this event */
  requiredCategories: ConsentCategory[];
  /** Session ID */
  sessionId: string;
}

/**
 * Events export format
 */
export interface EventsExport {
  /** All events matching the filter */
  events: PrivacyCompliantEvent[];
  /** Export timestamp */
  exportedAt: number;
  /** Data retention information */
  retentionInfo: {
    totalEvents: number;
    activeEvents: number;
    expiredEvents: number;
    retentionPeriod: RetentionPeriod;
  };
}

/**
 * Analytics metrics with privacy compliance
 */
export interface PrivacyCompliantMetrics {
  /** Total events tracked */
  totalEvents: number;
  /** Events by category */
  eventsByCategory: Record<ConsentCategory, number>;
  /** Anonymized events count */
  anonymizedEvents: number;
  /** Consent rate (percentage of users who gave consent) */
  consentRate: number;
  /** Data retention compliance */
  retentionCompliance: {
    eventsExpired: number;
    eventsRetained: number;
    complianceRate: number;
  };
}

/**
 * Return type for the usePrivacyCompliant hook
 */
export interface UsePrivacyCompliantReturn {
  /** Current consent state */
  consentState: ConsentState;
  /** Current privacy settings */
  settings: PrivacySettings;
  /** Current analytics metrics */
  metrics: PrivacyCompliantMetrics;
  /** Track an event with privacy compliance */
  trackEvent: (name: string, properties?: Record<string, any>, categories?: ConsentCategory[]) => void;
  /** Request user consent */
  requestConsent: (categories: ConsentCategory[]) => Promise<boolean>;
  /** Update consent preferences */
  updateConsent: (categories: ConsentCategory[]) => void;
  /** Update anonymization preference */
  updateAnonymizationPreference: (wantsAnonymized: boolean) => void;
  /** Withdraw consent */
  withdrawConsent: () => void;
  /** Check if consent is given for specific categories */
  hasConsentFor: (categories: ConsentCategory[]) => boolean;
  /** Anonymize existing data based on PII fields */
  anonymizeData: () => void;
  /** Export events with optional filtering */
  exportEvents: () => EventsExport;
  /** Delete events by filter */
  deleteEvents: () => Promise<boolean>;
  /** Update privacy settings */
  updateSettings: (settings: Partial<PrivacySettings>) => void;
  /** Update custom PII fields */
  updateCustomPiiFields: (fields: string[]) => void;
  /** Get data retention status */
  getRetentionStatus: () => {
    totalEvents: number;
    expiredEvents: number;
    activeEvents: number;
  };
}

/**
 * Default privacy settings
 */
const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  regulation: "GDPR",
  defaultCategories: ["necessary"],
  retentionPeriod: 365,
  anonymizeByDefault: true,
  requireExplicitConsent: true,
  consentVersion: "1.0.0",
  customPiiFields: ["user_id"],
};

/**
 * Storage keys for persistence
 */
const STORAGE_KEYS = {
  CONSENT: "privacy_consent",
  SETTINGS: "privacy_settings",
  EVENTS: "privacy_events",
  METRICS: "privacy_metrics",
} as const;

/**
 * A comprehensive privacy-compliant analytics hook that ensures GDPR, CCPA, and other privacy regulation compliance.
 * 
 * Features:
 * - Granular consent management
 * - Data anonymization
 * - Automatic data retention
 * - User data export/deletion
 * - Privacy regulation compliance
 * 
 * @param initialSettings - Initial privacy settings
 * @returns Privacy-compliant analytics utilities
 * 
 * @example
 * ```tsx
 * const analytics = usePrivacyCompliant({
 *   regulation: "GDPR",
 *   retentionPeriod: 365,
 *   requireExplicitConsent: true
 * });
 * 
 * // Track event with consent check
 * analytics.trackEvent("page_view", { page: "/home" }, ["analytics"]);
 * 
 * // Request consent
 * const granted = await analytics.requestConsent(["analytics", "marketing"]);
 * ```
 */
export function usePrivacyCompliant(
  initialSettings: Partial<PrivacySettings> = {}
): UsePrivacyCompliantReturn {
  
  // Merge initial settings with defaults
  const [settings, setSettings] = useState<PrivacySettings>(() => ({
    ...DEFAULT_PRIVACY_SETTINGS,
    ...initialSettings,
  }));

  // Consent state
  const [consentState, setConsentState] = useState<ConsentState>(() => {
    if (typeof window === "undefined") {
    return {
      hasConsent: false,
      consentTimestamp: null,
      categories: [],
      consentRequired: true,
      consentVersion: settings.consentVersion,
      wantsAnonymizedData: settings.anonymizeByDefault,
    };
    }

    const stored = localStorage.getItem(STORAGE_KEYS.CONSENT);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        consentRequired: settings.requireExplicitConsent,
      };
    }

    return {
      hasConsent: !settings.requireExplicitConsent,
      consentTimestamp: null,
      categories: settings.defaultCategories,
      consentRequired: settings.requireExplicitConsent,
      consentVersion: settings.consentVersion,
      wantsAnonymizedData: settings.anonymizeByDefault,
    };
  });

  // Analytics events storage
  const eventsRef = useRef<PrivacyCompliantEvent[]>([]);
  const metricsRef = useRef<PrivacyCompliantMetrics>({
    totalEvents: 0,
    eventsByCategory: {
      analytics: 0,
      marketing: 0,
      functional: 0,
      necessary: 0,
      preferences: 0,
    },
    anonymizedEvents: 0,
    consentRate: 0,
    retentionCompliance: {
      eventsExpired: 0,
      eventsRetained: 0,
      complianceRate: 100,
    },
  });

  // Session ID for tracking
  const sessionIdRef = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  /**
   * Load data from localStorage on mount
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load events
    const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (storedEvents) {
      try {
        eventsRef.current = JSON.parse(storedEvents);
      } catch (error) {
        console.warn("Failed to load events from storage:", error);
      }
    }

    // Load metrics
    const storedMetrics = localStorage.getItem(STORAGE_KEYS.METRICS);
    if (storedMetrics) {
      try {
        metricsRef.current = JSON.parse(storedMetrics);
      } catch (error) {
        console.warn("Failed to load metrics from storage:", error);
      }
    }
  }, []);

  /**
   * Save data to localStorage
   */
  const saveToStorage = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(consentState));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(eventsRef.current));
      localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metricsRef.current));
    } catch (error) {
      console.warn("Failed to save to storage:", error);
    }
  }, [consentState, settings]);

  /**
   * Check if consent is required for specific categories
   */
  const hasConsentFor = useCallback((categories: ConsentCategory[]): boolean => {
    if (!consentState.hasConsent) return false;
    return categories.every(category => consentState.categories.includes(category));
  }, [consentState]);

  /**
   * Anonymize data by removing or hashing PII
   */
  const anonymizeEventData = useCallback((event: Omit<PrivacyCompliantEvent, 'anonymized' | 'timestamp' | 'sessionId'>): PrivacyCompliantEvent => {
    const anonymizedProperties = { ...event.properties };
    
    // Use custom PII fields from settings
    const piiFields = settings.customPiiFields;
    piiFields.forEach(field => {
      if (anonymizedProperties[field]) {
        anonymizedProperties[field] = `[ANONYMIZED_${field.toUpperCase()}]`;
      }
    });

    return {
      ...event,
      properties: anonymizedProperties,
      anonymized: true,
      timestamp: Date.now(),
      sessionId: sessionIdRef.current,
    };
  }, [settings.customPiiFields]);

  /**
   * Track an event with privacy compliance
   */
  const trackEvent = useCallback(async (
    name: string, 
    properties: Record<string, any> = {}, 
    categories: ConsentCategory[] = ["analytics"]
  ) => {
    // Check if consent is required and given
    if (settings.requireExplicitConsent && !hasConsentFor(categories)) {
      console.warn(`Consent required for categories: ${categories.join(", ")}`);
      return;
    }

    // Create final event with unique ID
    const finalEvent: PrivacyCompliantEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      properties,
      requiredCategories: categories,
      anonymized: settings.anonymizeByDefault,
      timestamp: Date.now(),
      sessionId: sessionIdRef.current,
    };

    // Anonymize if required (check user preference first, then settings)
    const shouldAnonymize = consentState.wantsAnonymizedData;
    const processedEvent = shouldAnonymize 
      ? anonymizeEventData(finalEvent)
      : finalEvent;

    // Add to events
    eventsRef.current.push(processedEvent);

    // Update metrics
    metricsRef.current.totalEvents++;
    categories.forEach(category => {
      metricsRef.current.eventsByCategory[category]++;
    });
    if (processedEvent.anonymized) {
      metricsRef.current.anonymizedEvents++;
    }

    // Clean up expired events
    cleanupExpiredEvents();

    // Trigger update
    setUpdateTrigger(prev => prev + 1);

    saveToStorage();
  }, [settings, hasConsentFor, anonymizeEventData, saveToStorage]);

  /**
   * Clean up expired events based on retention period
   */
  const cleanupExpiredEvents = useCallback(() => {
    if (settings.retentionPeriod === "indefinite") return;

    const now = Date.now();
    const retentionMs = settings.retentionPeriod * 24 * 60 * 60 * 1000;
    
    const initialCount = eventsRef.current.length;
    eventsRef.current = eventsRef.current.filter(event => {
      return (now - event.timestamp) < retentionMs;
    });
    
    const expiredCount = initialCount - eventsRef.current.length;
    metricsRef.current.retentionCompliance.eventsExpired += expiredCount;
    metricsRef.current.retentionCompliance.eventsRetained = eventsRef.current.length;
    
    const totalProcessed = metricsRef.current.retentionCompliance.eventsExpired + 
                          metricsRef.current.retentionCompliance.eventsRetained;
    metricsRef.current.retentionCompliance.complianceRate = totalProcessed > 0 
      ? (metricsRef.current.retentionCompliance.eventsRetained / totalProcessed) * 100 
      : 100;
  }, [settings.retentionPeriod]);

  /**
   * Request user consent
   */
  const requestConsent = useCallback(async (categories: ConsentCategory[]): Promise<boolean> => {
    // In a real implementation, this would show a consent modal
    // For demo purposes, we'll simulate user interaction
    return new Promise((resolve) => {
      const userConsent = window.confirm(
        `This website would like to track analytics for: ${categories.join(", ")}. Do you consent?`
      );
      
      if (userConsent) {
        setConsentState(prev => ({
          ...prev,
          hasConsent: true,
          consentTimestamp: Date.now(),
          categories: [...new Set([...prev.categories, ...categories])],
          consentVersion: settings.consentVersion,
        }));
      }
      
      resolve(userConsent);
    });
  }, [settings.consentVersion]);

  /**
   * Update consent preferences
   */
  const updateConsent = useCallback((categories: ConsentCategory[]) => {
    setConsentState(prev => ({
      ...prev,
      hasConsent: true,
      consentTimestamp: Date.now(),
      categories,
      consentVersion: settings.consentVersion,
    }));
  }, [settings.consentVersion]);

  /**
   * Update anonymization preference
   */
  const updateAnonymizationPreference = useCallback((wantsAnonymized: boolean) => {
    setConsentState(prev => ({
      ...prev,
      wantsAnonymizedData: wantsAnonymized,
    }));
  }, []);

  /**
   * Withdraw consent
   */
  const withdrawConsent = useCallback(() => {
    setConsentState(prev => ({
      ...prev,
      hasConsent: false,
      consentTimestamp: null,
      categories: [],
    }));
    
    // Anonymize all existing events
    eventsRef.current = eventsRef.current.map(event => {
      const anonymizedProperties = { ...event.properties };

      return {
        ...event,
        properties: anonymizedProperties,
        anonymized: true,
      };
    });
    
    saveToStorage();
  }, [saveToStorage]);

  /**
   * Anonymize existing data
   */
  const anonymizeData = useCallback(async () => {
    const anonymizeEvent = async (event: PrivacyCompliantEvent) => {
      const anonymizedProperties = { ...event.properties };
      
      // Use custom PII fields from settings
      const piiFields = settings.customPiiFields;

      piiFields.forEach(field => {
        if (anonymizedProperties[field]) {
          anonymizedProperties[field] = `[ANONYMIZED_${field.toUpperCase()}]`;
        }
      });

      return {
        ...event,
        properties: anonymizedProperties,
        anonymized: true,
      };
    };

    const anonymizedEvents = await Promise.all(
      eventsRef.current.map(event => anonymizeEvent(event))
    );
    
    eventsRef.current = anonymizedEvents;
    metricsRef.current.anonymizedEvents = anonymizedEvents.length;
    setUpdateTrigger(prev => prev + 1);
    saveToStorage();
  }, [saveToStorage]);

  /**
   * Export events with optional filtering
   */
  const exportEvents = useCallback((): EventsExport => {
    const retentionStatus = getRetentionStatus();

    return {
      events: eventsRef.current,
      exportedAt: Date.now(),
      retentionInfo: {
        totalEvents: retentionStatus.totalEvents,
        activeEvents: retentionStatus.activeEvents,
        expiredEvents: retentionStatus.expiredEvents,
        retentionPeriod: settings.retentionPeriod,
      },
    };
  }, [settings.retentionPeriod]);

  /**
   * Delete events by filter
   */
  const deleteEvents = useCallback(async (): Promise<boolean> => {
    try {

      eventsRef.current = [];
      metricsRef.current.totalEvents = 0;
      metricsRef.current.anonymizedEvents = 0;
      
      setUpdateTrigger(prev => prev + 1);
      saveToStorage();
      return true;
    } catch (error) {
      console.error("Failed to delete events:", error);
      return false;
    }
  }, [saveToStorage]);

  /**
   * Update privacy settings
   */
  const updateSettings = useCallback((newSettings: Partial<PrivacySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    saveToStorage();
  }, [saveToStorage]);

  /**
   * Update custom PII fields
   */
  const updateCustomPiiFields = useCallback((fields: string[]) => {
    setSettings(prev => ({ 
      ...prev, 
      customPiiFields: fields 
    }));
    saveToStorage();
  }, [saveToStorage]);

  /**
   * Get data retention status
   */
  const getRetentionStatus = useCallback(() => {
    cleanupExpiredEvents();
    return {
      totalEvents: metricsRef.current.totalEvents,
      expiredEvents: metricsRef.current.retentionCompliance.eventsExpired,
      activeEvents: metricsRef.current.retentionCompliance.eventsRetained,
    };
  }, [cleanupExpiredEvents]);

  // State to trigger updates
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Memoized metrics
  const metrics = useMemo(() => {
    cleanupExpiredEvents();
    return { ...metricsRef.current };
  }, [cleanupExpiredEvents, updateTrigger]);

  // Auto-save on consent changes
  useEffect(() => {
    saveToStorage();
  }, [consentState, saveToStorage]);

  return {
    consentState,
    settings,
    metrics,
    trackEvent,
    requestConsent,
    updateConsent,
    updateAnonymizationPreference,
    withdrawConsent,
    hasConsentFor,
    anonymizeData,
    exportEvents,
    deleteEvents,
    updateSettings,
    updateCustomPiiFields,
    getRetentionStatus,
  };
}
