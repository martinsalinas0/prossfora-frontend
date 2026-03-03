"use client";

import GenericTable, { Column } from "@/components/forList/GenericTable";
import SearchBar from "@/components/SearchBar";
import api from "@/lib/api";
import { ContractorInvoice } from "@/lib/types/all";
import { getContractorId } from "@/lib/auth";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const getLastSix = (str: string) => str.slice(-6);

export default function ContractorInvoicesPage() {
  const [invoices, setInvoices] = useState<ContractorInvoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contractorId = getContractorId();

  useEffect(() => {
    if (!contractorId) {
      setIsLoading(false);
      return;
    }
    const fetchInvoices = async () => {
      try {
        const response = await api.get(
          `contractor-invoices/contractor/${contractorId}`
        );
        setInvoices(response.data.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load invoices");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [contractorId]);

  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return invoices;

    const q = searchQuery.toLowerCase();
    return invoices.filter(
      (inv) =>
        inv.id.toLowerCase().includes(q) ||
        inv.job_id.toLowerCase().includes(q) ||
        inv.invoice_number.toLowerCase().includes(q) ||
        inv.status.toLowerCase().includes(q) ||
        inv.total.toString().includes(q)
    );
  }, [invoices, searchQuery]);

  const columns: Column<ContractorInvoice>[] = [
    {
      header: "ID",
      accessor: "id",
      render: (v) => `C-${getLastSix(v as string)}`,
    },
    {
      header: "Job",
      accessor: "job_id",
      render: (v, invoice) => (
        <Link
          href={`/admin/list/jobs/${invoice.job_id}`}
          className="hover:text-primary"
        >
          {getLastSix(v as string)}
        </Link>
      ),
    },
    {
      header: "Invoice Number",
      accessor: "invoice_number",
      render: (v) => (
        <span className="font-medium">INV-20{String(v).slice(-7)}</span>
      ),
    },
    {
      header: "Total",
      accessor: "total",
      render: (v) => `$${Number(v).toLocaleString()}`,
    },
    {
      header: "Status",
      accessor: "status",
      render: (v) => (
        <span className="uppercase font-medium">{String(v)}</span>
      ),
    },
    {
      header: "Due Date",
      accessor: "created_at",
      render: (v) => new Date(v as string).toLocaleDateString(),
    },
  ];

  if (!contractorId) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="text-amber-800 mb-4">
            Please sign in as a contractor to view your invoices.
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

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-cerulean mb-2 md:mb-0">
          My Invoices
        </h1>

        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search invoices..."
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-border bg-card">
            <p className="text-muted-foreground">
              {searchQuery
                ? `No invoices found matching "${searchQuery}"`
                : "No invoices yet"}
            </p>
          </div>
        ) : (
          <GenericTable
            data={filteredInvoices}
            columns={columns}
            emptyMessage="No invoices found"
          />
        )}
      </div>
    </div>
  );
}
