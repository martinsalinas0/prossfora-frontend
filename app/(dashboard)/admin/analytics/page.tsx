"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    revenue: 0,
    customers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [u, j, p, c] = await Promise.all([
          api.get("users/getAllUsers").catch(() => ({ data: { data: [] } })),
          api.get("jobs/status/open").catch(() => ({ data: { data: [] } })),
          api.get("payments/successful").catch(() => ({ data: { data: [] } })),
          api.get("customers/all").catch(() => ({ data: { data: [] } })),
        ]);
        const payments = (p.data?.data ?? []) as { amount?: number }[];
        const revenue = payments.reduce((sum, x) => sum + Number(x.amount ?? 0), 0);
        setStats({
          users: (u.data?.data ?? []).length,
          jobs: (j.data?.data ?? []).length,
          revenue,
          customers: (c.data?.data ?? []).length,
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cerulean flex items-center gap-2">
          <BarChart3 size={32} />
          Analytics
        </h1>
        <p className="text-pacific-600 mt-1">
          Platform analytics and key metrics
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-cerulean-100 rounded w-1/2" />
                <div className="h-3 bg-cerulean-50 rounded w-3/4 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-cerulean-100 rounded w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-pacific-600">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-pacific-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-cerulean">{stats.users}</p>
                <CardDescription>Registered users</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-pacific-600">
                  Open Jobs
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-pacific-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-cerulean">{stats.jobs}</p>
                <CardDescription>Active jobs</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-pacific-600">
                  Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-pacific-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-cerulean">
                  ${stats.revenue.toFixed(2)}
                </p>
                <CardDescription>Successful payments</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-pacific-600">
                  Customers
                </CardTitle>
                <Users className="h-4 w-4 text-pacific-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-cerulean">{stats.customers}</p>
                <CardDescription>Total customers</CardDescription>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Detailed reports and exports can be added here (e.g. date range, CSV export).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-pacific-600">
                Connect to your reporting API or add charts (e.g. Recharts) to visualize trends over time.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
