"use client";

import React, { useState } from "react";
import { usePrivacyCompliant } from "./use-privacy-compliant";
import type { ConsentCategory, PrivacyRegulation, RetentionPeriod } from "./use-privacy-compliant";
import { DemoBlock } from "../../../components/demoBlock";
import { Button } from "@/components/ui/button";

/**
 * Demo component showcasing privacy-compliant analytics functionality
 */
export default function PrivacyCompliantAnalyticsDemo() {
  const [selectedCategories, setSelectedCategories] = useState<ConsentCategory[]>(["analytics"]);
  const [eventName, setEventName] = useState("page_view");
  const [eventProperties, setEventProperties] = useState('{"page": "/demo", "source": "direct"}');
  const [showExport, setShowExport] = useState(false);
  const [exportData, setExportData] = useState<any>(null);
  const [showConsentBanner, setShowConsentBanner] = useState(true);
  const [customPiiField, setCustomPiiField] = useState("");

  // Initialize analytics with GDPR settings
  const analytics = usePrivacyCompliant();

  const handleTrackEvent = () => {
    try {
      const properties = JSON.parse(eventProperties);
      analytics.trackEvent(eventName, properties, selectedCategories);
    } catch (error) {
      alert("Invalid JSON in event properties");
    }
  };

  const handleRequestConsent = async () => {
    const granted = await analytics.requestConsent(selectedCategories);
    if (granted) {
      alert("Consent granted!");
    } else {
      alert("Consent not updated");
    }
  };

  const handleExportData = () => {
    const data = analytics.exportEvents();
    setExportData(data);
    setShowExport(true);
  };

  const handleDeleteData = async () => {
    const success = await analytics.deleteEvents();
    if (success) {
      alert("Events deleted successfully");
    } else {
      alert("Failed to delete events");
    }
  };

  const handleAnonymizeData = async () => {
    await analytics.anonymizeData();
    alert("Data anonymized successfully");
  };

  const handleWithdrawConsent = () => {
    alert("Consent withdrawn and data removed");
    analytics.withdrawConsent();
  };

  const retentionStatus = analytics.getRetentionStatus();

  return (
    <div>
      <DemoBlock
      >

      {/* Consent Banner */}
      {(showConsentBanner && !analytics.consentState.hasConsent) && (
        <div className="absolute top-0 left-0 right-0 bg-fd-background border-t border-fd-border p-4 shadow-lg z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-fd-foreground">Privacy & Cookies</h3>
              <p className="text-sm text-fd-muted-foreground">
                We use analytics to improve our service. Manage your preferences below.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  analytics.withdrawConsent()
                  setShowConsentBanner(false)
                }}
                className="px-3 py-1 text-xs bg-fd-muted text-fd-foreground rounded hover:bg-fd-muted/80"
              >
                Deny
              </button>
              <button
                onClick={() => {
                  analytics.updateConsent(["analytics", "functional"])
                  setShowConsentBanner(false)
                }}
                className="px-3 py-1 text-xs bg-fd-primary text-fd-primary-foreground rounded hover:bg-fd-primary/90"
              >
                Accept All
              </button>
              <button
                onClick={() => setShowConsentBanner(false)}
                className="px-3 py-1 text-xs text-fd-muted-foreground hover:text-fd-foreground"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

        <div className="w-full">
          {/* Landing Page Header */}
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold text-fd-foreground mb-4">Demo Landing Page</h1>
            <p className="text-lg text-fd-muted-foreground mb-8">
              Experience privacy-compliant analytics in action
            </p>
          </div>

          {/* Privacy Settings */}
          <div>
            <h2 className="text-2xl font-semibold text-fd-foreground mb-4 mt-0">Privacy Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-fd-foreground mb-2">Regulation:</label>
                <select
                  value={analytics.settings.regulation}
                  onChange={(e) => analytics.updateSettings({ regulation: e.target.value as PrivacyRegulation })}
                  className="w-full p-2 border border-fd-border rounded-md bg-fd-background text-fd-foreground"
                >
                  <option value="GDPR">GDPR</option>
                  <option value="CCPA">CCPA</option>
                  <option value="PIPEDA">PIPEDA</option>
                  <option value="LGPD">LGPD</option>
                  <option value="PDPA">PDPA</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-fd-foreground mb-2">Retention Period:</label>
                <select
                  value={analytics.settings.retentionPeriod}
                  onChange={(e) => analytics.updateSettings({ retentionPeriod: e.target.value as RetentionPeriod })}
                  className="w-full p-2 border border-fd-border rounded-md bg-fd-background text-fd-foreground"
                >
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>365 days</option>
                  <option value={730}>730 days</option>
                  <option value="indefinite">Indefinite</option>
                </select>
              </div>
            </div>
          </div>

            {/* Consent Management */}
            <div className="mt-12">
            <h2 className="text-2xl font-semibold text-fd-foreground mb-4 mt-0">Consent Management</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-fd-muted rounded-lg flex flex-col gap-2 col-span-2">
                  <h3 className="font-semibold text-fd-foreground mb-2 mt-0">Current Status</h3>
                  <span className="text-sm text-fd-muted-foreground">
                    <strong>Consent:</strong> {analytics.consentState.hasConsent ? "Granted ✅" : "Not Granted ❌"}
                  </span>
                  <span className="text-sm text-fd-muted-foreground">
                    <strong>Categories:</strong> {analytics.consentState.categories.join(", ") || "None"}
                  </span>
                  <span className="text-sm text-fd-muted-foreground">
                    <strong>Wants Anonymized Data:</strong> {analytics.consentState.wantsAnonymizedData ? "Yes ✅" : "No ❌"}
                  </span>
                  <span className="text-sm text-fd-muted-foreground">
                    <strong>Regulation:</strong> {analytics.settings.regulation}
                  </span>

                  <div className="flex flex-wrap gap-2 mt-4">

                    <Button
                      onClick={handleRequestConsent}
                    >
                      Request Consent
                    </Button>
                    <Button
                      onClick={() => analytics.updateConsent(selectedCategories)}
                    >
                      Update Consent
                    </Button>
                    <Button
                      onClick={handleWithdrawConsent}
                    >
                      Withdraw Consent
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-fd-muted rounded-lg flex flex-col gap-2">
                  <h3 className="font-semibold text-fd-foreground mb-2 mt-0">Data Retention</h3>
                  <span className="text-sm text-fd-muted-foreground">
                    <strong>Total Events:</strong> {retentionStatus.totalEvents}
                  </span>
                  <span className="text-sm text-fd-muted-foreground">
                    <strong>Active Events:</strong> {retentionStatus.activeEvents}
                  </span>
                  <span className="text-sm text-fd-muted-foreground">
                    <strong>Expired Events:</strong> {retentionStatus.expiredEvents}
                  </span>
                  <span className="text-sm text-fd-muted-foreground">
                    <strong>Anonymized Events:</strong> {analytics.metrics.anonymizedEvents}
                  </span>
                  <span className="text-sm text-fd-muted-foreground">
                    <strong>Retention Compliance:</strong> {analytics.metrics.retentionCompliance.complianceRate.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              {/* Anonymization Preference Toggle */}
              <div className="p-4 bg-fd-muted rounded-lg">
                <h3 className="font-medium text-fd-foreground mb-2 mt-0">Anonymization Preference</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymization-preference"
                    checked={analytics.consentState.wantsAnonymizedData}
                    onChange={(e) => analytics.updateAnonymizationPreference(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="anonymization-preference" className="text-base text-fd-foreground">
                    I want my data to be anonymized
                  </label>
                </div>
                <p className="text-sm text-fd-muted-foreground mt-2">
                  When enabled, all future tracked events will have PII fields hashed automatically.
                </p>
              </div>
                          {/* Custom PII Fields Configuration */}
            <div className="mt-6 p-4 bg-fd-muted rounded-lg">
              <h4 className="font-medium text-fd-foreground mb-3">Custom PII Fields Configuration</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {analytics.settings.customPiiFields.map((field, index) => (
                      <span
                        key={index}
                        className="bg-fd-primary text-fd-primary-foreground px-2 py-1 rounded text-sm"
                      >
                        {field}
                        <button
                          onClick={() => {
                            const newFields = analytics.settings.customPiiFields.filter((_, i) => i !== index);
                            analytics.updateCustomPiiFields(newFields);
                          }}
                          className="ml-2 text-fd-primary-foreground hover:text-fd-destructive"
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPiiField}
                    onChange={(e) => setCustomPiiField(e.target.value)}
                    placeholder="Add new PII field (e.g., ssn, creditCard)"
                    className="flex-1 p-2 border border-fd-border rounded-md bg-fd-background text-fd-foreground"
                  />
                  <Button
                    onClick={() => {
                      if (customPiiField.trim() && !analytics.settings.customPiiFields.includes(customPiiField.trim())) {
                        analytics.updateCustomPiiFields([...analytics.settings.customPiiFields, customPiiField.trim()]);
                        setCustomPiiField("");
                      }
                    }}
                  >
                    Add Field
                  </Button>
                </div>
                
                <p className="text-xs text-fd-muted-foreground">
                  These fields will be anonymized when anonymization is enabled. 
                  Common examples: email, phone, name, address, ip, user_id, ssn, creditCard
                </p>
              </div>
            </div>
            </div>
          </div>

          {/* Event Tracking */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-fd-foreground mb-4 mt-4">Event Tracking Test</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="block text-sm font-medium text-fd-foreground mb-2">Event Name:</label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full p-2 border border-fd-border rounded-md bg-fd-background text-fd-foreground"
                    placeholder="e.g., page_view, button_click"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-fd-foreground mb-2">Event Properties (JSON):</label>
                  <textarea
                    value={eventProperties}
                    onChange={(e) => setEventProperties(e.target.value)}
                    className="w-full p-2 border border-fd-border rounded-md h-20 bg-fd-background text-fd-foreground"
                    placeholder='{"page": "/home", "source": "direct"}'
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-fd-foreground mb-2">Consent Categories:</label>
                <div className="flex flex-wrap gap-2">
                  {["analytics", "marketing", "functional", "necessary", "preferences"].map((category) => (
                    <label key={category} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category as ConsentCategory)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category as ConsentCategory]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== category));
                          }
                        }}
                        className="mr-2"
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleTrackEvent}
                className="w-full bg-fd-primary text-fd-primary-foreground px-4 py-2 rounded-md hover:bg-fd-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!analytics.consentState.hasConsent}
              >
                Track Event
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={handleExportData} variant="secondary">
                Export Events
              </Button>
              <Button onClick={handleDeleteData} variant="secondary">
                Delete Events
              </Button>
              <Button onClick={handleAnonymizeData} variant="secondary">
                Anonymize data already tracked
              </Button>
            </div>
          </div>
        </div>
      </DemoBlock>

      {/* Export Data Modal */}
      {showExport && exportData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center rounded-lg p-4 z-50">
          <div className="h-[60vh] min-w-xl shadow-xl overflow-hidden border-fd-border rounded-lg bg-fd-background border max-w-2xl flex">
            <div className="size-full max-h-full overflow-y-scroll flex-1 no-scrollbar">
                <div className="flex justify-between items-center mb-4 bg-fd-background sticky top-0 p-4">
                  <h3 className="text-xl font-semibold text-fd-foreground mt-0 mb-0">Exported Events</h3>
                  <button
                    onClick={() => setShowExport(false)}
                    className="text-fd-muted-foreground hover:text-fd-foreground"
                  >
                    ✕
                  </button>
                </div>
              <div className="p-3">
                <pre className="bg-fd-muted p-4 rounded-md text-sm overflow-auto text-fd-foreground">
                  {JSON.stringify(exportData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
