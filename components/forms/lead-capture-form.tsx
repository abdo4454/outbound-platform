"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { leadFormSchema, type LeadFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";

interface LeadCaptureFormProps {
  variant?: "full" | "compact" | "inline";
  source?: string;
  className?: string;
}

export function LeadCaptureForm({ variant = "full", source, className }: LeadCaptureFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [utmData, setUtmData] = useState<Record<string, string>>({});

  // Capture UTM params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmData({
      source: params.get("utm_source") || "",
      medium: params.get("utm_medium") || "",
      campaign: params.get("utm_campaign") || "",
      content: params.get("utm_content") || "",
      term: params.get("utm_term") || "",
      gclid: params.get("gclid") || "",
      fbclid: params.get("fbclid") || "",
      landingPage: window.location.pathname,
      referrer: document.referrer,
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          ...utmData,
          source: utmData.source || source || "website",
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        // Track conversion in PostHog / GTM
        if (typeof window !== "undefined") {
          (window as any).posthog?.capture("lead_submitted", {
            source: utmData.source || source,
            variant,
          });
          (window as any).dataLayer?.push({
            event: "lead_form_submit",
            lead_source: utmData.source || source,
          });
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  if (submitted) {
    return (
      <div className={cn("text-center py-8", className)}>
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
          We&apos;ll be in touch!
        </h3>
        <p className="text-gray-500">
          Expect to hear from us within 24 hours. Check your inbox for next steps.
        </p>
      </div>
    );
  }

  // Inline variant (just email)
  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={cn("flex gap-2", className)}>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter your work email"
          className="input flex-1"
        />
        <input type="hidden" {...register("name")} value="—" />
        <button type="submit" disabled={isSubmitting} className="btn-primary btn-sm">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Get Started <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>
    );
  }

  // Full and compact variants
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
      <div className={variant === "full" ? "grid sm:grid-cols-2 gap-4" : "space-y-4"}>
        <div>
          <label className="label">Full Name</label>
          <input {...register("name")} type="text" className={cn("input", errors.name && "input-error")} placeholder="John Smith" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="label">Work Email</label>
          <input {...register("email")} type="email" className={cn("input", errors.email && "input-error")} placeholder="john@company.com" />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      {variant === "full" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Company</label>
              <input {...register("company")} type="text" className="input" placeholder="Acme Corp" />
            </div>
            <div>
              <label className="label">Company Size</label>
              <select {...register("companySize")} className="input">
                <option value="">Select...</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">What are you interested in?</label>
            <select {...register("interest")} className="input">
              <option value="">Select...</option>
              <option value="cold_email">Cold Email Campaigns</option>
              <option value="linkedin">LinkedIn Outreach</option>
              <option value="multi_channel">Multi-Channel (Email + LinkedIn)</option>
              <option value="lead_research">Lead Research Only</option>
              <option value="full_service">Full Service Outbound</option>
            </select>
          </div>

          <div>
            <label className="label">Anything else we should know? (optional)</label>
            <textarea {...register("message")} className="input min-h-[80px]" placeholder="Tell us about your goals..." />
          </div>
        </>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>Book a Discovery Call <ArrowRight className="w-5 h-5" /></>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Free consultation · No commitment · We respond within 24 hours
      </p>
    </form>
  );
}
