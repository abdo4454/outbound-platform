"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Pricing", href: "#pricing" },
  { label: "Free Audit", href: "/audit" },
  { label: "About", href: "/about" },
  { label: "How We Work", href: "/culture" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="section flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link href="/">
          <Logo dark={scrolled} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-500",
                scrolled ? "text-gray-600" : "text-white/80 hover:text-white"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/sign-in"
            className={cn(
              "text-sm font-medium transition-colors px-4 py-2 rounded-lg",
              scrolled
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                : "text-white/80 hover:text-white"
            )}
          >
            Client Login
          </Link>
          <Link href="/book" className="btn-primary btn-sm">
            Book a Call <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "lg:hidden p-2 rounded-lg transition-colors",
            scrolled ? "text-gray-900" : "text-white"
          )}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="section py-4 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-gray-600 hover:text-gray-900 py-2 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-2 flex flex-col gap-2">
              <Link href="/sign-in" className="btn-ghost btn-sm justify-start">
                Client Login
              </Link>
              <Link href="/book" className="btn-primary btn-sm">
                Book a Call <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
