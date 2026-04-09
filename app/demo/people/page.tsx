import { Mail, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const customers = [
  { name: "Jordan Lee", email: "jordan@example.com", phone: "(512) 555-0142", jobs: 2 },
  { name: "Sam Rivera", email: "sam@example.com", phone: "(512) 555-0199", jobs: 4 },
  { name: "Pat Ng", email: "pat@example.com", phone: "(512) 555-0108", jobs: 1 },
];

const contractors = [
  { name: "Molina Home Repair", trade: "Plumbing / general", active: true },
  { name: "Summit HVAC", trade: "HVAC", active: true },
  { name: "Northside Electric", trade: "Electrical", active: false },
];

export default function DemoPeoplePage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-cerulean sm:text-3xl">People</h1>
        <p className="mt-1 text-pacific-700">
          Customers and contractors shown the way admin screens group them—demo data
          only.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cerulean">Customers</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {customers.map((c) => (
            <Card key={c.email} className="border-cerulean-100 bg-white/90">
              <CardHeader>
                <CardTitle className="text-base text-cerulean">{c.name}</CardTitle>
                <CardDescription>
                  {c.jobs} job{c.jobs === 1 ? "" : "s"} on file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-pacific-700">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                  {c.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                  {c.phone}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cerulean">Contractors</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {contractors.map((x) => (
            <Card key={x.name} className="border-cerulean-100 bg-white/90">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base text-cerulean">{x.name}</CardTitle>
                  <CardDescription>{x.trade}</CardDescription>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    x.active
                      ? "bg-green-50 text-green-800 ring-1 ring-green-600/20"
                      : "bg-muted text-muted-foreground ring-1 ring-border"
                  }`}
                >
                  {x.active ? "Active" : "Inactive"}
                </span>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
