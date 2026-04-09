import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Building2, Home, Landmark, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Demo | Prossfora",
  description: "Explore Prossfora—design preview without signing in.",
};

const nav = [
  { href: "/demo", label: "Overview", icon: Home },
  { href: "/demo/jobs", label: "Jobs", icon: Briefcase },
  { href: "/demo/people", label: "People", icon: Building2 },
  { href: "/demo/financials", label: "Financials", icon: Landmark },
] as const;

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-linear-to-b from-cerulean-50 via-white to-pacific-50 text-foreground">
      <header className="sticky top-0 z-50 border-b border-cerulean-100/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/demo"
            className="flex items-center gap-2 font-semibold text-cerulean"
          >
            <Sparkles className="h-5 w-5 text-yarrow-600" aria-hidden />
            Prossfora
            <span className="rounded-full bg-yarrow-100 px-2 py-0.5 text-xs font-medium text-yarrow-800">
              Demo
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-pacific-700 transition-colors hover:bg-cerulean-50 hover:text-cerulean"
              >
                <Icon className="h-4 w-4 opacity-80" aria-hidden />
                {label}
              </Link>
            ))}
          </nav>
          <p className="w-full text-center text-xs text-pacific-600 sm:w-auto sm:text-right">
            Preview only — no account required
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      <footer className="border-t border-cerulean-100 bg-white/80 py-6 text-center text-sm text-pacific-600">
        <p>
          Interactive features are coming soon. This demo shows layout and typical
          workflows.
        </p>
        <Link
          href="/auth/sign-in"
          className="mt-2 inline-block font-medium text-cerulean hover:underline"
        >
          Sign in to the full app
        </Link>
      </footer>
    </div>
  );
}
