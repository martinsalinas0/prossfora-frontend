"use client";

import api from "@/lib/api";
import { getContractorId } from "@/lib/auth";
import type { JobWithRelations } from "@/lib/types/jobsWithJoins";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function ContractorJobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string | undefined;

  const [job, setJob] = useState<JobWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contractorId = getContractorId();

  const fetchJob = useCallback(async () => {
    if (!jobId) return;
    try {
      const res = await api.get(`jobs/${jobId}`);
      const data = res.data?.data as JobWithRelations | undefined;
      setJob(data ?? null);
      if (!data) {
        setError("Job not found.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load job.");
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    fetchJob();
  }, [jobId, fetchJob]);

  const formatDate = (date?: string | null) =>
    date ? new Date(date).toLocaleDateString() : "—";

  if (!contractorId) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="text-amber-800 mb-4">
            Please sign in as a contractor to view this job.
          </p>
          <Link
            href="/auth/sign-in/contractor"
            className="inline-flex items-center justify-center rounded-lg bg-yarrow px-4 py-2 font-medium text-white hover:bg-yarrow-500"
          >
            Contractor Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-pacific font-semibold text-xl">
        Loading job…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          href="/contractor/jobs"
          className="text-cerulean font-medium hover:underline"
        >
          ← Back to My Jobs
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground mb-4">Job not found.</p>
        <Link
          href="/contractor/jobs"
          className="text-cerulean font-medium hover:underline"
        >
          ← Back to My Jobs
        </Link>
      </div>
    );
  }

  if (job.contractor_id !== contractorId) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-destructive font-medium mb-2">Access denied</p>
          <p className="text-sm text-muted-foreground mb-4">
            This job is not assigned to your account.
          </p>
          <Link
            href="/contractor/jobs"
            className="inline-flex items-center justify-center rounded-lg bg-cerulean px-4 py-2 text-sm font-medium text-white hover:bg-pacific"
          >
            Back to My Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <Link
            href="/contractor/jobs"
            className="text-sm font-medium text-cerulean hover:underline"
          >
            My Jobs
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-cerulean">{job.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 shadow-sm">
              <span className="font-medium uppercase tracking-wider text-muted-foreground">
                ID
              </span>
              <span className="font-mono">{job.id.slice(-8)}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 shadow-sm">
              <span className="font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </span>
              <span className="capitalize text-foreground">
                {job.status.replace(/_/g, " ")}
              </span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 shadow-sm">
              <span className="font-medium uppercase tracking-wider text-muted-foreground">
                Priority
              </span>
              <span className="capitalize">{job.priority}</span>
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-l-4 border-pacific-500 pl-3 text-lg font-semibold text-cerulean">
              Customer
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium text-muted-foreground">Name</dt>
                <dd className="mt-0.5 text-foreground">
                  {job.customer.first_name} {job.customer.last_name}
                </dd>
              </div>
              {job.customer.email && (
                <div>
                  <dt className="font-medium text-muted-foreground">Email</dt>
                  <dd className="mt-0.5">
                    <a
                      href={`mailto:${job.customer.email}`}
                      className="text-cerulean hover:underline"
                    >
                      {job.customer.email}
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="font-medium text-muted-foreground">Phone</dt>
                <dd className="mt-0.5 text-foreground">
                  {job.customer.phone ? (
                    <a
                      href={`tel:${job.customer.phone}`}
                      className="text-cerulean hover:underline"
                    >
                      {job.customer.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Address</dt>
                <dd className="mt-0.5 text-foreground">
                  {job.customer.address}, {job.customer.city},{" "}
                  {job.customer.state} {job.customer.zip_code}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-l-4 border-pacific-500 pl-3 text-lg font-semibold text-cerulean">
              Schedule
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Date</dt>
                <dd className="text-foreground">{formatDate(job.scheduled_date)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Time</dt>
                <dd className="text-foreground">{job.scheduled_time || "—"}</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-l-4 border-border pl-3 text-lg font-semibold text-cerulean">
              Description
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {job.description || "—"}
            </p>
          </section>
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-l-4 border-border pl-3 text-lg font-semibold text-cerulean">
              Job site
            </h2>
            <p className="text-sm text-muted-foreground">{job.address}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {job.city}, {job.state} {job.zip_code}
            </p>
          </section>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 border-l-4 border-border pl-3 text-lg font-semibold text-cerulean">
            Work details
          </h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-4 border-b border-border/50 pb-2">
              <dt className="text-muted-foreground">Pay type</dt>
              <dd className="font-medium">{job.pay_type ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border/50 pb-2">
              <dt className="text-muted-foreground">Hours worked</dt>
              <dd className="font-medium">
                {job.hours_worked != null ? String(job.hours_worked) : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
