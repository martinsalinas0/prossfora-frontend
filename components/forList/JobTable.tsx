"use client";

import React from "react";
import Link from "next/link";
import TableHeader from "./TableHeader";

import { JobWithRelations } from "@/lib/types/jobsWithJoins";

interface JobTableProps {
  data: JobWithRelations[];
  /** Base path for job detail links, e.g. "/admin/jobs" or "/contractor/jobs" */
  jobBasePath?: string;
}

const JobTable: React.FC<JobTableProps> = ({
  data,
  jobBasePath = "/admin/jobs",
}) => {
  const columns = ["Title", "Status", "Customer", "City", "ID", "Contractor"];

  return (
    <div className="overflow-x-auto rounded-xl text-center border border-border bg-card shadow-sm">
      <table className="min-w-full border-collapse">
        <TableHeader columns={columns} />

        <tbody>
          {data.map((job) => (
            <tr key={job.id} className="transition hover:bg-muted/50">
              <td className="border-b border-border px-6 py-4 text-sm text-foreground hover:text-primary">
                <Link href={`${jobBasePath}/${job.id}`}>{job.title}</Link>
              </td>

              <td className="border-b border-border px-6 py-4 text-sm uppercase tracking-wide text-muted-foreground">
                {job.status}
              </td>

              <td className="border-b border-border px-6 py-4 text-sm text-cerulean-800">
                {job.customer ? (
                  <>
                    {job.customer.first_name} {job.customer.last_name}
                  </>
                ) : (
                  <span className="italic text-cerulean-400">Unassigned</span>
                )}
              </td>

              <td className="border-b border-border px-6 py-4 text-sm text-muted-foreground">
                {job.city ?? "—"}
              </td>

              <td className="border-b border-border px-6 py-4 text-sm font-medium text-foreground">
                <Link
                  href={`${jobBasePath}/${job.id}`}
                  className="hover:underline"
                >
                  {job.id.slice(-6)}
                </Link>
              </td>

              <td className="border-b border-border px-6 py-4 text-sm text-muted-foreground">
                {job.contractor?.first_name ?? "—"}
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-sm text-cerulean-500"
              >
                No jobs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
