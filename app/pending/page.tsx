import { redirect } from "next/navigation";
import { Clock, Mail } from "lucide-react";
import { DEMO_MODE } from "@/lib/demo-mode";
import { getSession } from "@/lib/session";

export default async function PendingPage() {
  if (DEMO_MODE) redirect("/dashboard");

  const session = await getSession();
  if (!session) redirect("/sign-in");
  if (session.orgId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-brand-600" />
        </div>

        <h1 className="font-display text-2xl font-bold text-gray-900 mb-3">
          Almost there
        </h1>

        <p className="text-gray-500 mb-8 leading-relaxed">
          Your account is set up, but you haven&apos;t been added to a client
          workspace yet. Your account manager will send you an invite shortly.
        </p>

        <div className="card text-left mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">What happens next?</h3>
          <ol className="space-y-3 text-sm text-gray-500">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              Your account manager creates your workspace
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              You&apos;ll receive an email invitation to join
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              Accept the invite and access your dashboard
            </li>
          </ol>
        </div>

        <a
          href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@accelratedgrowth.com"}`}
          className="btn-ghost btn-sm inline-flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          Contact support
        </a>

        <p className="text-xs text-gray-400 mt-6">Signed in as {session.email}</p>
      </div>
    </div>
  );
}
