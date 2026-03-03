"use client";

import QuickActionBar from "@/components/layouts/QuickActionBar";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";
import type {
  Contractor,
  Customer,
  CustomerInvoice,
  Job,
  Payment,
  TaskRequest,
} from "@/lib/types/all";
import {
  AlertCircle,
  ArrowRight,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { format, startOfWeek, subWeeks } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AdminDashboardPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [taskRequests, setTaskRequests] = useState<TaskRequest[]>([]);
  const [customerInvoices, setCustomerInvoices] = useState<CustomerInvoice[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          customersRes,
          openJobsRes,
          paymentsRes,
          contractorsRes,
          taskRequestsRes,
          invoicesRes,
          allJobsRes,
        ] = await Promise.all([
          api.get("customers/all").catch(() => ({ data: { data: [] } })),
          api.get("jobs/status/open").catch(() => ({ data: { data: [] } })),
          api.get("payments/successful").catch(() => ({ data: { data: [] } })),
          api.get("contractors/getAllContractors").catch(() => ({ data: { data: [] } })),
          api.get("task-requests/all").catch(() => ({ data: { data: [] } })),
          api.get("customer-invoices/").catch(() => ({ data: { data: [] } })),
          api.get("jobs/all").catch(() => ({ data: { data: [] } })),
        ]);
        setCustomers((customersRes.data?.data ?? []) as Customer[]);
        setJobs((openJobsRes.data?.data ?? []) as Job[]);
        setPayments((paymentsRes.data?.data ?? []) as Payment[]);
        setContractors((contractorsRes.data?.data ?? []) as Contractor[]);
        setTaskRequests((taskRequestsRes.data?.data ?? []) as TaskRequest[]);
        setCustomerInvoices((invoicesRes.data?.data ?? []) as CustomerInvoice[]);
        setAllJobs((allJobsRes.data?.data ?? []) as Job[]);
      } catch (err) {
        console.error(err);
        setError("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingTaskCount = taskRequests.filter((t) => t.status === "pending").length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueInvoices = customerInvoices.filter((inv) => {
    if (inv.status === "paid" || inv.status === "cancelled") return false;
    const due = new Date(inv.due_date);
    due.setHours(0, 0, 0, 0);
    return due < today;
  });
  const recentJobs = [...allJobs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const revenueByWeek = useMemo(() => {
    const now = new Date();
    const weeks: { weekStart: Date; label: string; revenue: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const start = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      weeks.push({
        weekStart: start,
        label: format(start, "MMM d"),
        revenue: 0,
      });
    }
    payments.forEach((p) => {
      const d = new Date(p.created_at);
      const weekStart = startOfWeek(d, { weekStartsOn: 1 });
      const entry = weeks.find(
        (w) => w.weekStart.getTime() === weekStart.getTime()
      );
      if (entry) entry.revenue += Number(p.amount);
    });
    return weeks;
  }, [payments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <QuickActionBar />
      </div>
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Total Customers</CardTitle>
            <CardDescription>
              Active customers in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-primary">{customers.length}</p>
          </CardContent>
          <CardFooter className="bg-muted/50">
            <Link
              href="/admin/list/customers"
              className="text-sm text-olive-600 font-medium hover:underline"
            >
              View all
            </Link>
          </CardFooter>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Contractors</CardTitle>
            <CardDescription>
              Registered contractors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-primary">{contractors.length}</p>
          </CardContent>
          <CardFooter className="bg-muted/50">
            <Link
              href="/admin/list/contractors"
              className="text-sm text-olive-600 font-medium hover:underline"
            >
              View all
            </Link>
          </CardFooter>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Active Jobs</CardTitle>
            <CardDescription>
              Currently open jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-primary">{jobs.length}</p>
          </CardContent>
          <CardFooter className="bg-muted/50">
            <Link
              href="/admin/list/jobs/active"
              className="text-sm text-cerulean-600 font-medium hover:underline"
            >
              View active
            </Link>
          </CardFooter>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Pending Task Requests</CardTitle>
            <CardDescription>
              Applications awaiting review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-primary">{pendingTaskCount}</p>
          </CardContent>
          <CardFooter className="bg-muted/50">
            <Link
              href="/admin/list/jobs/task-requests"
              className="text-sm text-cerulean-600 font-medium hover:underline flex items-center gap-1"
            >
              Review applications
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Revenue</CardTitle>
            <CardDescription>
              Total from successful payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-primary">
              ${totalPaid.toFixed(2)}
            </p>
          </CardContent>
          <CardFooter className="bg-muted/50">
            <Link
              href="/admin/list/financials/payments"
              className="text-sm text-yarrow-600 font-medium hover:underline"
            >
              View payments
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Needs attention */}
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Needs attention
          </CardTitle>
          <CardDescription>
            Items that may require follow-up
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/admin/list/jobs/task-requests"
              className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent transition-colors"
            >
              <span className="font-medium">Pending task requests</span>
              <span className="text-primary font-bold">{pendingTaskCount}</span>
            </Link>
            <Link
              href="/admin/list/financials/invoices/customers"
              className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent transition-colors"
            >
              <span className="font-medium">Overdue invoices</span>
              <span className="text-primary font-bold">{overdueInvoices.length}</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Recent activity
          </CardTitle>
          <CardDescription>
            Latest jobs by creation date
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {recentJobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No jobs yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentJobs.map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:bg-accent transition-colors"
                  >
                    <span className="font-medium truncate flex-1">{job.title}</span>
                    <span className="text-sm text-muted-foreground shrink-0 ml-2">
                      {format(new Date(job.created_at), "MMM d, yyyy")} · {job.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/list/jobs"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            View all jobs
          </Link>
        </CardContent>
      </Card>

      {/* Revenue over time */}
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Revenue over time</CardTitle>
          <CardDescription>
            Successful payments by week (last 8 weeks)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByWeek} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.weekStart
                      ? format(new Date(payload[0].payload.weekStart), "MMM d, yyyy")
                      : ""
                  }
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b bg-primary text-primary-foreground">
            <CardTitle className="text-xl text-center m-1 tracking-widest uppercase">
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border border-border"
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Link
                href="/admin/users/new"
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors border border-border font-medium"
              >
                Add New User
              </Link>
              <Link
                href="/admin/jobs/new"
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors border border-border font-medium"
              >
                Post New Job
              </Link>
              <Link
                href="/admin/list/jobs/task-requests"
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors border border-border font-medium"
              >
                Review Applications
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
