import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 flex items-center px-6 bg-white border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">OP</span>
          </div>
          <span className="font-display font-bold text-lg text-gray-900">Accelrated Growth</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        {children}
      </div>

      <footer className="py-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Accelrated Growth. All rights reserved.
      </footer>
    </div>
  );
}
