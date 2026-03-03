"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import type { JobWithRelations } from "@/lib/types/jobsWithJoins";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";

const JOB_STATUSES = [
  "open",
  "needs_quote",
  "quote_pending",
  "quote_rejected",
  "approved",
  "in_progress",
  "completed",
  "paid",
  "cancelled",
] as const;

const editJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  customerId: z.string().min(1, "Customer is required"),
  contractorId: z.string(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  zipCode: z.string().min(1, "Zip code is required"),
  status: z.enum(JOB_STATUSES),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  payType: z.enum(["hourly", "flat", ""]).optional(),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
});

type EditJobFormData = z.infer<typeof editJobSchema>;

function toDateInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

const EditJobPage = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;

  const [job, setJob] = useState<JobWithRelations | null>(null);
  const [customers, setCustomers] = useState<{ id: string; first_name: string; last_name: string }[]>([]);
  const [contractors, setContractors] = useState<{ id: string; first_name: string; last_name: string; company_name?: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sameAsCustomerAddress, setSameAsCustomerAddress] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    reset,
    setValue,
    watch,
    getValues,
  } = useForm<EditJobFormData>({
    resolver: zodResolver(editJobSchema),
  });

  const customerId = watch("customerId");

  const getCustomerAddress = useCallback(
    async (
      cid: string,
      currentJob: JobWithRelations,
    ): Promise<{ address: string; city: string; state: string; zip_code: string }> => {
      const fallback = { address: "", city: "", state: "", zip_code: "" };
      if (cid === currentJob.customer.id) {
        const c = currentJob.customer;
        return {
          address: c.address ?? fallback.address,
          city: c.city ?? fallback.city,
          state: c.state ?? fallback.state,
          zip_code: c.zip_code ?? fallback.zip_code,
        };
      }
      const res = await api.get(`customers/${cid}`);
      const c = res.data.data as { address?: string; city?: string; state?: string; zip_code?: string };
      return {
        address: c.address ?? fallback.address,
        city: c.city ?? fallback.city,
        state: c.state ?? fallback.state,
        zip_code: c.zip_code ?? fallback.zip_code,
      };
    },
    [apiBase],
  );

  const applyCustomerAddress = useCallback(
    (addr: { address?: string | null; city?: string | null; state?: string | null; zip_code?: string | null }) => {
      const current = getValues();
      const address = (addr.address ?? "").trim() || current.address || "";
      const city = (addr.city ?? "").trim() || current.city || "";
      const state = (addr.state ?? "").trim().toUpperCase() || current.state || "";
      const zipCode = (addr.zip_code ?? "").trim() || current.zipCode || "";
      setValue("address", address, { shouldValidate: true });
      setValue("city", city, { shouldValidate: true });
      setValue("state", state, { shouldValidate: true });
      setValue("zipCode", zipCode, { shouldValidate: true });
    },
    [setValue, getValues],
  );

  useEffect(() => {
    if (!jobId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [jobRes, customersRes, contractorsRes] = await Promise.all([
          api.get(`jobs/${jobId}`),
          api.get("customers/all"),
          api.get("contractors/getAllContractors"),
        ]);

        const jobData = jobRes.data.data as JobWithRelations;
        setJob(jobData);
        setCustomers(customersRes.data.data ?? []);
        setContractors(contractorsRes.data.data ?? []);

        reset({
          title: jobData.title,
          description: jobData.description,
          customerId: jobData.customer_id,
          contractorId: jobData.contractor_id ?? "",
          address: jobData.address,
          city: jobData.city,
          state: jobData.state,
          zipCode: jobData.zip_code,
          status: jobData.status as EditJobFormData["status"],
          priority: jobData.priority as EditJobFormData["priority"],
          payType: (jobData.pay_type ?? "") as EditJobFormData["payType"],
          scheduledDate: toDateInputValue(jobData.scheduled_date),
          scheduledTime: jobData.scheduled_time ?? "",
        });

        const c = jobData.customer;
        const isSame =
          c &&
          (jobData.address ?? "").trim() === (c.address ?? "").trim() &&
          (jobData.city ?? "").trim() === (c.city ?? "").trim() &&
          (jobData.state ?? "").trim().toUpperCase() === (c.state ?? "").trim().toUpperCase() &&
          (jobData.zip_code ?? "").trim() === (c.zip_code ?? "").trim();
        setSameAsCustomerAddress(!!isSame);
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.message : "Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, apiBase, reset]);

  useEffect(() => {
    if (!job || !sameAsCustomerAddress || !customerId) return;
    getCustomerAddress(customerId, job).then(applyCustomerAddress);
  }, [job, customerId, sameAsCustomerAddress, getCustomerAddress, applyCustomerAddress]);

  const onSubmit = async (data: EditJobFormData) => {
    if (!jobId) return;
    try {
      await api.patch(`jobs/update/${jobId}`, {
        title: data.title,
        description: data.description,
        customer_id: data.customerId,
        contractor_id: data.contractorId || null,
        address: data.address,
        city: data.city,
        state: data.state.toUpperCase(),
        zip_code: data.zipCode,
        status: data.status,
        priority: data.priority,
        pay_type: data.payType || null,
        scheduled_date: data.scheduledDate || null,
        scheduled_time: data.scheduledTime || null,
      });
      router.push(`/admin/jobs/${jobId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError("root", {
          message: err.response?.data?.message ?? "Failed to update job",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-muted/30 px-4">
        <p className="text-lg font-medium text-muted-foreground">
          Loading job…
        </p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-muted/30 px-4">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">
            {error ?? "Job not found"}
          </p>
          <Link
            href={`/admin/jobs/${jobId}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to job
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href={`/admin/jobs/${jobId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="text-xs text-muted-foreground">Edit job</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Edit Job
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update job details below. Changes are saved when you click Save.
        </p>

        <section className="mt-6">
          <h2 className="mb-3 border-l-4 border-border pl-3 text-lg font-semibold text-foreground">
            Customer
          </h2>
          <div className="border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-base font-medium text-foreground">
                {job.customer.first_name} {job.customer.last_name}
              </p>
              <Link
                href={`/admin/users/customers/${job.customer.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                View customer
              </Link>
            </div>
            <dl className="mt-4 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
              {job.customer.email && (
                <>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="text-foreground">{job.customer.email}</dd>
                </>
              )}
              {job.customer.phone != null && job.customer.phone !== "" && (
                <>
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="text-foreground">{job.customer.phone}</dd>
                </>
              )}
              <dt className="text-muted-foreground">Address</dt>
              <dd className="text-foreground">
                {[
                  job.customer.address,
                  [job.customer.city, job.customer.state, job.customer.zip_code].filter(Boolean).join(", "),
                ]
                  .filter(Boolean)
                  .join(", ")}
              </dd>
            </dl>
          </div>
        </section>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
          {errors.root && (
            <div className="border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {errors.root.message}
            </div>
          )}

          <section>
            <h2 className="mb-3 border-l-4 border-border pl-3 text-lg font-semibold text-foreground">
              Basic info
            </h2>
            <div className="border border-border bg-card p-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. Kitchen Remodel"
                  {...register("title")}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  placeholder="Job description..."
                  rows={4}
                  {...register("description")}
                  className={`w-full border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${errors.description ? "border-destructive" : "border-input"
                    }`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 border-l-4 border-border pl-3 text-lg font-semibold text-foreground">
              Assignment
            </h2>
            <div className="border border-border bg-card p-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Customer <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("customerId")}
                  className={`w-full border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${errors.customerId ? "border-destructive" : "border-input"
                    }`}
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name}
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.customerId.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Contractor
                </label>
                <select
                  {...register("contractorId")}
                  className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">No contractor</option>
                  {contractors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name}
                      {c.company_name ? ` · ${c.company_name}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {JOB_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Priority
                  </label>
                  <select
                    {...register("priority")}
                    className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Pay type
                </label>
                <select
                  {...register("payType")}
                  className="w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Not set</option>
                  <option value="hourly">Hourly</option>
                  <option value="flat">Flat</option>
                </select>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 border-l-4 border-border pl-3 text-lg font-semibold text-foreground">
              Schedule
            </h2>
            <div className="border border-border bg-card p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Scheduled date
                  </label>
                  <Input type="date" {...register("scheduledDate")} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Scheduled time
                  </label>
                  <Input type="time" {...register("scheduledTime")} />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 border-l-4 border-border pl-3 text-lg font-semibold text-foreground">
              Location
            </h2>
            <div className="border border-border bg-card p-5 space-y-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={sameAsCustomerAddress}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSameAsCustomerAddress(checked);
                    if (checked && job) {
                      const cid = getValues("customerId");
                      if (cid) {
                        getCustomerAddress(cid, job).then(applyCustomerAddress);
                      }
                    }
                  }}
                  className="h-4 w-4 rounded border-input"
                />
                <span className="text-sm font-medium text-foreground">
                  Same as customer address
                </span>
              </label>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Address <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="123 Main St"
                  {...register("address")}
                  disabled={sameAsCustomerAddress}
                  className={errors.address ? "border-destructive" : ""}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    City <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Austin"
                    {...register("city")}
                    disabled={sameAsCustomerAddress}
                    className={errors.city ? "border-destructive" : ""}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    State <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="TX"
                    maxLength={2}
                    {...register("state")}
                    disabled={sameAsCustomerAddress}
                    className={errors.state ? "border-destructive" : ""}
                  />
                  {errors.state && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Zip <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="78701"
                    {...register("zipCode")}
                    disabled={sameAsCustomerAddress}
                    className={errors.zipCode ? "border-destructive" : ""}
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/admin/jobs/${jobId}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Link
              href={`/admin/jobs/${jobId}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Back to job
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobPage;
