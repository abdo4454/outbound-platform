"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "icp", title: "Ideal Customer Profile", description: "Who should we target?" },
  { id: "messaging", title: "Messaging & Tone", description: "How should we sound?" },
  { id: "integration", title: "Connect Your Tool", description: "Sync your campaign data" },
  { id: "confirm", title: "All Set", description: "You're ready to go" },
];

const INDUSTRIES = [
  "SaaS", "FinTech", "HealthTech", "E-commerce", "Cybersecurity",
  "HR Tech", "MarTech", "EdTech", "Real Estate", "Professional Services",
  "Manufacturing", "Logistics", "Other",
];
const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const TITLES = [
  "CEO / Founder", "CTO / VP Engineering", "VP Sales", "VP Marketing",
  "Head of Growth", "Director of Operations", "CFO / Finance",
];
const TOOLS = [
  { value: "instantly", label: "Instantly.ai" },
  { value: "apollo", label: "Apollo.io" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // ICP
    industries: [] as string[],
    companySizes: [] as string[],
    geographies: "",
    titles: [] as string[],
    exclusions: "",
    // Messaging
    valueProps: "",
    tone: "professional",
    painPoints: "",
    avoidPhrases: "",
    // Integration
    toolType: "instantly",
    apiKey: "",
  });

  const toggleArrayItem = (field: "industries" | "companySizes" | "titles", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  async function saveStep(step: string) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, data: formData }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Save failed");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      throw e;
    } finally {
      setSaving(false);
    }
  }

  async function saveIntegration() {
    if (!formData.apiKey.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: formData.toolType, apiKey: formData.apiKey }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to connect tool");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      throw e;
    } finally {
      setSaving(false);
    }
  }

  async function handleNext() {
    try {
      if (currentStep === 0) await saveStep("icp");
      if (currentStep === 1) await saveStep("messaging");
      if (currentStep === 2) {
        if (formData.apiKey.trim()) await saveIntegration();
      }
      if (currentStep === STEPS.length - 1) {
        router.push("/dashboard");
        return;
      }
      setCurrentStep((s) => s + 1);
    } catch {
      // error already set
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="section py-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">OP</span>
            </div>
            <span className="font-display font-bold text-lg text-gray-900">Client Onboarding</span>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap",
                    i === currentStep
                      ? "bg-brand-50 text-brand-700"
                      : i < currentStep
                      ? "text-green-600"
                      : "text-gray-400"
                  )}
                >
                  {i < currentStep ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className={cn("w-4 h-4", i === currentStep && "text-brand-500")} />
                  )}
                  {step.title}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("w-8 h-px mx-1", i < currentStep ? "bg-green-300" : "bg-gray-200")} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="section py-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
            {STEPS[currentStep].title}
          </h2>
          <p className="text-gray-500 mb-8">{STEPS[currentStep].description}</p>

          {error && (
            <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: ICP */}
          {currentStep === 0 && (
            <div className="space-y-8">
              <div>
                <label className="label">Target Industries</label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => toggleArrayItem("industries", ind)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                        formData.industries.includes(ind)
                          ? "bg-brand-50 border-brand-300 text-brand-700"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Target Company Sizes (employees)</label>
                <div className="flex flex-wrap gap-2">
                  {COMPANY_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleArrayItem("companySizes", size)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                        formData.companySizes.includes(size)
                          ? "bg-brand-50 border-brand-300 text-brand-700"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Target Job Titles</label>
                <div className="flex flex-wrap gap-2">
                  {TITLES.map((title) => (
                    <button
                      key={title}
                      type="button"
                      onClick={() => toggleArrayItem("titles", title)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                        formData.titles.includes(title)
                          ? "bg-brand-50 border-brand-300 text-brand-700"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      {title}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Target Geographies</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., United States, Canada, Western Europe"
                  value={formData.geographies}
                  onChange={(e) => setFormData({ ...formData, geographies: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Exclusions (optional)</label>
                <textarea
                  className="input min-h-[80px]"
                  placeholder="Any companies, industries, or types to exclude?"
                  value={formData.exclusions}
                  onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 2: Messaging */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <label className="label">Your Key Value Propositions</label>
                <textarea
                  className="input min-h-[100px]"
                  placeholder="What makes your product/service valuable? List your top 3-5 value props, one per line."
                  value={formData.valueProps}
                  onChange={(e) => setFormData({ ...formData, valueProps: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Preferred Tone</label>
                <div className="grid grid-cols-2 gap-3">
                  {["professional", "casual", "bold", "consultative"].map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setFormData({ ...formData, tone })}
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-medium border text-left capitalize transition-all",
                        formData.tone === tone
                          ? "bg-brand-50 border-brand-300 text-brand-700"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Pain Points Your ICP Faces</label>
                <textarea
                  className="input min-h-[100px]"
                  placeholder="What problems do your ideal customers struggle with?"
                  value={formData.painPoints}
                  onChange={(e) => setFormData({ ...formData, painPoints: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Phrases to Avoid (optional)</label>
                <input
                  type="text"
                  className="input"
                  placeholder='e.g., "synergy", "disrupt", "leverage"'
                  value={formData.avoidPhrases}
                  onChange={(e) => setFormData({ ...formData, avoidPhrases: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Integration */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="label">Which tool are you using?</label>
                <div className="flex gap-3">
                  {TOOLS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, toolType: t.value })}
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-medium border transition-all",
                        formData.toolType === t.value
                          ? "bg-brand-50 border-brand-300 text-brand-700"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">API Key</label>
                <input
                  type="password"
                  className="input"
                  placeholder={`Paste your ${TOOLS.find((t) => t.value === formData.toolType)?.label} API key…`}
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Your key is stored securely. Campaign data will sync within 15 minutes.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Don&apos;t have your API key handy?{" "}
                <button
                  type="button"
                  className="text-brand-600 hover:underline"
                  onClick={() => setCurrentStep(3)}
                >
                  Skip for now
                </button>{" "}
                — you can connect later from the Integrations page.
              </p>
            </div>
          )}

          {/* Step 4: Confirm */}
          {currentStep === 3 && (
            <div className="card text-center py-12">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-2">You&apos;re all set!</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Your onboarding is complete. Your agency will review your ICP and messaging and get campaigns running.
                {formData.apiKey && " Your first campaign data will sync within 15 minutes."}
              </p>
              <div className="flex flex-col gap-3 items-center">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  ICP saved
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  Messaging saved
                </div>
                {formData.apiKey && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    {TOOLS.find((t) => t.value === formData.toolType)?.label} connected
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || saving}
              className="btn-ghost btn-sm disabled:opacity-30 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="btn-primary btn-sm flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {currentStep === STEPS.length - 1 ? "Go to Dashboard" : "Continue"}
              {!saving && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
