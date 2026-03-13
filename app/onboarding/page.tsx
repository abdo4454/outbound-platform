"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "icp", title: "Ideal Customer Profile", description: "Who should we target?" },
  { id: "messaging", title: "Messaging & Tone", description: "How should we sound?" },
  { id: "domains", title: "Domains & Email", description: "Sending infrastructure" },
  { id: "assets", title: "Brand Assets", description: "Logos, collateral, case studies" },
  { id: "crm", title: "CRM Connection", description: "Where meetings land" },
  { id: "calendar", title: "Calendar Setup", description: "Booking availability" },
  { id: "review", title: "Review & Launch", description: "Final approval" },
];

const INDUSTRIES = [
  "SaaS", "FinTech", "HealthTech", "E-commerce", "Cybersecurity",
  "HR Tech", "MarTech", "EdTech", "Real Estate", "Professional Services",
  "Manufacturing", "Logistics", "Other",
];

const COMPANY_SIZES = [
  "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+",
];

const TITLES = [
  "CEO / Founder", "CTO / VP Engineering", "VP Sales", "VP Marketing",
  "Head of Growth", "Director of Operations", "CFO / Finance",
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    industries: [] as string[],
    companySizes: [] as string[],
    geographies: "",
    titles: [] as string[],
    exclusions: "",
    valueProps: "",
    tone: "professional",
    painPoints: "",
    differentiators: "",
    avoidPhrases: "",
  });

  const toggleArrayItem = (field: "industries" | "companySizes" | "titles", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="section py-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">OP</span>
            </div>
            <span className="font-display font-bold text-lg text-gray-900">
              Client Onboarding
            </span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(i)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
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
                </button>
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

          {/* Step 1: ICP */}
          {currentStep === 0 && (
            <div className="space-y-8">
              <div>
                <label className="label">Target Industries</label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
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
                  placeholder="What makes your product/service valuable? List your top 3-5 value props."
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

          {/* Placeholder for steps 3-7 */}
          {currentStep >= 2 && currentStep <= 6 && (
            <div className="card text-center py-16">
              <p className="text-gray-400 text-lg">
                {STEPS[currentStep].title} — form content to be built.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                This step will be implemented with the full form fields, file uploads, and OAuth connections.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="btn-ghost btn-sm disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
              className="btn-primary btn-sm"
            >
              {currentStep === STEPS.length - 1 ? "Submit for Approval" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
