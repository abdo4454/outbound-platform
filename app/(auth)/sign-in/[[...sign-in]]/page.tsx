import { redirect } from "next/navigation";
import { DEMO_MODE } from "@/lib/demo-mode";
import type { Metadata } from "next";
import SignInForm from "./form";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  if (DEMO_MODE) redirect("/dashboard");
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 mt-2">Sign in to your Accelerated Growth dashboard</p>
      </div>
      <SignInForm />
    </div>
  );
}
