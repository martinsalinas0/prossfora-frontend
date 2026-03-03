"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase, FileText, DollarSign } from "lucide-react";
import Link from "next/link";

export default function ContractorDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-cerulean mb-2">
        Contractor Dashboard
      </h1>
      <p className="text-pacific-600 mb-8">
        View your assigned jobs, time entries, and payments.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase size={20} />
              My Jobs
            </CardTitle>
            <CardDescription>
              Assigned and active jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/contractor/jobs"
              className="text-cerulean font-medium hover:underline"
            >
              View jobs →
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText size={20} />
              Invoices
            </CardTitle>
            <CardDescription>
              Contractor invoices and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/contractor/invoices"
              className="text-cerulean font-medium hover:underline"
            >
              View invoices →
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign size={20} />
              Payments
            </CardTitle>
            <CardDescription>
              Payment history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/contractor/invoices"
              className="text-cerulean font-medium hover:underline"
            >
              View invoices →
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick start</CardTitle>
          <CardDescription>
            As a contractor you can view jobs assigned to you, log time, and see invoice status.
            Full contractor-specific features (e.g. mobile time entry) can be added here.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
