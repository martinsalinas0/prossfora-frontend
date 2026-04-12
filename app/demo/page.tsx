import Link from "next/link";
import { ArrowRight, Briefcase, Calendar, Landmark, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const highlights = [
  {
    title: "Jobs",
    description:
      "Track jobs from request through completion—status, assignment, and site details in one place.",
    href: "/demo/jobs",
    icon: Briefcase,
  },
  {
    title: "Customers, contractors, and employees",
    description:
      "Keep homeowners and trade partners organized with profiles, contact info, and history.",
    href: "/demo/people",
    icon: Users,
  },
  {
    title: "Quotes & billing",
    description:
      "See how estimates, invoices, and payments connect to each job for clearer cash flow.",
    href: "/demo/financials",
    icon: Landmark,
  },
];

export default function DemoHomePage() {
  return (
    <div className="space-y-12 sm:space-y-16">
      <section className="text-center sm:text-left">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-cerulean-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-cerulean-700">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          Design preview
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-cerulean sm:text-4xl lg:text-5xl">
          Operations for contractors,{" "}
          <span className="text-pacific-600">
            without the spreadsheet fluff.
          </span>
        </h1>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <Link
            href="/demo/jobs"
            className="inline-flex items-center gap-2 rounded-lg bg-yarrow px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-yarrow-600"
          >
            Explore jobs
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/demo/financials"
            className="inline-flex items-center gap-2 rounded-lg border border-cerulean-200 bg-white px-5 py-2.5 text-sm font-semibold text-cerulean transition-colors hover:bg-cerulean-50"
          >
            See financials
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-semibold text-cerulean sm:text-2xl">
          What you&apos;ll see
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ title, description, href, icon: Icon }) => (
            <Link key={href} href={href} className="group block">
              <Card className="h-full border-cerulean-100 bg-white/90 shadow-sm transition-all hover:border-yarrow-300 hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-cerulean-100 text-cerulean">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <CardTitle className="text-lg text-cerulean group-hover:text-yarrow-800">
                    {title}
                  </CardTitle>
                  <CardDescription className="text-pacific-700">
                    {description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-yarrow-700">
                    Open preview
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
