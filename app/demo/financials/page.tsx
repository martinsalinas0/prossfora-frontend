import { FileText, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const quotes = [
  { job: "Bathroom leak investigation", amount: "$1,240", status: "Sent" },
  { job: "Garage door sensor", amount: "$385", status: "Approved" },
  { job: "AC tune-up (spring)", amount: "$189", status: "Draft" },
];

const invoices = [
  { job: "Kitchen faucet & disposal", amount: "$612", status: "Paid" },
  { job: "AC tune-up (spring)", amount: "$189", status: "Sent" },
];

export default function DemoFinancialsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cerulean sm:text-3xl">Financials</h1>
        <p className="mt-1 text-pacific-700">
          Quotes and invoices tied to jobs—amounts and statuses are for layout only.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-cerulean-100 bg-white/95">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cerulean-100 text-cerulean">
              <FileText className="h-4 w-4" aria-hidden />
            </div>
            <CardTitle className="text-lg">Quotes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quotes.map((q) => (
              <div
                key={q.job}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card/50 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-cerulean">{q.job}</p>
                  <p className="text-xs text-muted-foreground">{q.status}</p>
                </div>
                <p className="font-mono text-sm font-semibold text-pacific-800">
                  {q.amount}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-cerulean-100 bg-white/95">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yarrow-100 text-yarrow-800">
              <Receipt className="h-4 w-4" aria-hidden />
            </div>
            <CardTitle className="text-lg">Invoices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv.job}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card/50 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-cerulean">{inv.job}</p>
                  <p className="text-xs text-muted-foreground">{inv.status}</p>
                </div>
                <p className="font-mono text-sm font-semibold text-pacific-800">
                  {inv.amount}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed border-yarrow-300/60 bg-yarrow-50/40">
        <CardContent className="py-6 text-center text-sm text-pacific-700">
          Payment tracking and exports would appear here in the live product—this block is
          a placeholder for “revenue / paid / outstanding” summaries.
        </CardContent>
      </Card>
    </div>
  );
}
