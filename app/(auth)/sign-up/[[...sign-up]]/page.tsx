import { redirect } from "next/navigation";
import { DEMO_MODE } from "@/lib/demo-mode";
import type { Metadata } from "next";
import SignUpForm from "./form";

export const metadata: Metadata = { title: "Get Started" };

export default function SignUpPage() {
  if (DEMO_MODE) redirect("/dashboard");
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="text-gray-500 mt-2">Get started with Accelrated Growth</p>
      </div>
      <SignUpForm />
    </div>
  );
}
