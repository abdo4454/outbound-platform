"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    setStatus("loading");

    fetch("/api/auth/invite/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.status === 401) {
          router.push(`/sign-up?invite=${token}`);
          return;
        }
        const d = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(d.orgName ?? "your workspace");
          setTimeout(() => router.push(d.redirectTo ?? "/onboarding"), 2000);
        } else {
          setStatus("error");
          setMessage(d.error ?? "Something went wrong");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token, router]);

  if (!token) {
    return (
      <div className="card max-w-md w-full text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="font-display text-xl font-bold text-gray-900 mb-2">Invalid invite link</h1>
        <p className="text-gray-500 mb-6">This invite link is missing a token.</p>
        <Link href="/" className="btn-primary">Go home</Link>
      </div>
    );
  }

  return (
    <div className="card max-w-md w-full text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-12 h-12 text-brand-600 mx-auto mb-4 animate-spin" />
          <h1 className="font-display text-xl font-bold text-gray-900 mb-2">Verifying your invite…</h1>
          <p className="text-gray-500">Just a moment</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="font-display text-xl font-bold text-gray-900 mb-2">
            Welcome to {message}!
          </h1>
          <p className="text-gray-500">Redirecting you to your dashboard…</p>
        </>
      )}

      {status === "error" && (
        <>
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="font-display text-xl font-bold text-gray-900 mb-2">Invite error</h1>
          <p className="text-gray-500 mb-6">{message}</p>
          <Link href="/sign-in" className="btn-primary">Sign in</Link>
        </>
      )}
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="card max-w-md w-full text-center">
            <Loader2 className="w-12 h-12 text-brand-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading…</p>
          </div>
        }
      >
        <AcceptInviteContent />
      </Suspense>
    </div>
  );
}
