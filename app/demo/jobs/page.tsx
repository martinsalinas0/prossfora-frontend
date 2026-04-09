import { MapPin, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockJobs = [
  {
    title: "Kitchen faucet & disposal",
    customer: "Jordan Lee",
    status: "In progress",
    city: "Austin",
    id: "…8f2a",
  },
  {
    title: "AC tune-up (spring)",
    customer: "Sam Rivera",
    status: "Approved",
    city: "Dripping Springs",
    id: "…91bc",
  },
  {
    title: "Bathroom leak investigation",
    customer: "Pat Ng",
    status: "Needs quote",
    city: "Cedar Park",
    id: "…44d1",
  },
  {
    title: "Garage door sensor",
    customer: "Alex Chen",
    status: "Completed",
    city: "Austin",
    id: "…02e9",
  },
];

const stats = [
  { label: "Active", value: "12", hint: "This week" },
  { label: "Needs quote", value: "3", hint: "Follow up" },
  { label: "Scheduled", value: "8", hint: "Next 7 days" },
];

export default function DemoJobsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cerulean sm:text-3xl">Jobs</h1>
        <p className="mt-1 text-pacific-700">
          Sample job board—status, customer, and location as your team would see them.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-cerulean-100 bg-white/90">
            <CardHeader className="pb-2">
              <p className="text-sm font-medium text-pacific-600">{s.label}</p>
              <CardTitle className="text-3xl font-bold text-cerulean">{s.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-pacific-500">{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border-cerulean-100 bg-white/95 shadow-sm">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg text-cerulean">All jobs (sample)</CardTitle>
          <p className="text-sm font-normal text-pacific-600">
            Rows are static—filters and actions are visual placeholders.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-cerulean-50/50 text-xs uppercase tracking-wide text-pacific-600">
                  <th className="px-4 py-3 font-medium">Job</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="w-10 px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {mockJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-border/80 transition-colors hover:bg-cerulean-50/30"
                  >
                    <td className="px-4 py-3 font-medium text-cerulean">{job.title}</td>
                    <td className="px-4 py-3 text-pacific-800">{job.customer}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-olive-50 px-2 py-0.5 text-xs font-medium text-olive-800 ring-1 ring-olive-200/60">
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 opacity-70" aria-hidden />
                        {job.city}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {job.id}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <button
                        type="button"
                        className="rounded p-1 hover:bg-muted"
                        aria-label="Actions (demo)"
                        disabled
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
