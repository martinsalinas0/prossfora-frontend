"use client";

import JobTable from "@/components/forList/JobTable";
import type { JobWithRelations } from "@/lib/types/jobsWithJoins";
import api from "@/lib/api";
import { getContractorId } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ContractorJobsPage() {
  const [jobs, setJobs] = useState<JobWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const contractorId = getContractorId();

  useEffect(() => {
    if (!contractorId) {
      setLoading(false);
      return;
    }
    api
      .get(`jobs/contractors/${contractorId}`)
      .then((response) => {
        setJobs(response.data.data ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load jobs");
        setLoading(false);
      });
  }, [contractorId]);

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    const q = searchQuery.toLowerCase();
    return jobs.filter((job) => {
      const customerName = job.customer
        ? `${job.customer.first_name} ${job.customer.last_name}`.toLowerCase()
        : "";
      return (
        job.title.toLowerCase().includes(q) ||
        job.status.toLowerCase().includes(q) ||
        (job.city ?? "").toLowerCase().includes(q) ||
        job.id.toLowerCase().includes(q) ||
        customerName.includes(q)
      );
    });
  }, [jobs, searchQuery]);

  if (!contractorId) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="text-amber-800 mb-4">
            Please sign in as a contractor to view your jobs.
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
      <div className="p-6 text-pacific justify-center text-center font-extrabold text-4xl">
        Loading jobs...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-yarrow-800">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-cerulean mb-2">My Jobs</h1>
        <p className="text-pacific-600 mb-4">
          Jobs assigned to you
        </p>
        <div className="flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-input px-4 py-1 bg-card">
            <Image src="/search.png" alt="Search" width={14} height={14} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 p-2 bg-transparent outline-none text-cerulean-800 placeholder:text-pacific-400"
            />
          </div>
        </div>
      </div>
      <JobTable data={filteredJobs} jobBasePath="/contractor/jobs" />
    </div>
  );
}
