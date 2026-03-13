"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How quickly can we start seeing meetings?",
    a: "Most clients see their first booked meetings within 2-3 weeks. The first week is domain warm-up and campaign setup, week two is when emails start going out, and meetings typically start flowing by week three.",
  },
  {
    q: "Do we need to provide our own tools and domains?",
    a: "No. We handle everything — domain purchasing, email account setup, warm-up, and all the tooling. You don't need to buy any software. We do need access to your calendar for meeting booking.",
  },
  {
    q: "What makes you different from other outbound agencies?",
    a: "Three things: transparency (real-time dashboard, not monthly PDF reports), performance guarantees (we put skin in the game), and genuine personalization (no spray-and-pray, every email is researched and tailored).",
  },
  {
    q: "Can I see exactly what emails you're sending?",
    a: "Absolutely. You approve all messaging before anything goes out. You can also see every email sent, every reply received, and every sequence in your client dashboard in real time.",
  },
  {
    q: "What if we already have an SDR team?",
    a: "We work alongside internal teams all the time. We can handle specific segments, geographies, or channels while your team focuses on others. Many clients use us to augment their existing efforts or test new markets.",
  },
  {
    q: "What's your contract structure?",
    a: "Month-to-month, cancel anytime. We don't lock you into long-term contracts because we believe our results speak for themselves. Most clients stay for 12+ months because it's working.",
  },
  {
    q: "How do you handle deliverability?",
    a: "Deliverability is our obsession. We manage domain reputation, inbox warm-up, sending limits, bounce monitoring, and blacklist checks. If something goes sideways, we catch it within hours, not weeks.",
  },
  {
    q: "Do you integrate with our CRM?",
    a: "Yes. We integrate with HubSpot, Salesforce, Pipedrive, Close, and most major CRMs. Meetings and qualified leads flow directly into your pipeline with full attribution data.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="section-narrow">
        <div className="text-center mb-16">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            FAQ
          </p>
          <h2 className="font-display text-display-sm sm:text-display-md text-gray-900 mb-4">
            Common questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "rounded-2xl border transition-all duration-200",
                openIndex === i
                  ? "border-brand-200 bg-brand-50/30 shadow-sm"
                  : "border-gray-100 bg-white hover:border-gray-200"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-display font-semibold text-gray-900 pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-200",
                    openIndex === i && "rotate-180 text-brand-600"
                  )}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 -mt-2">
                  <p className="text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
