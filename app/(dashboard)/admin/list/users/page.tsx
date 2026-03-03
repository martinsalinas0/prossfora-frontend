"use client";

import TableHeader from "@/components/forList/TableHeader";
import QuickActionBar from "@/components/layouts/QuickActionBar";
import SearchBar from "@/components/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import type { Contractor } from "@/lib/types/contractor";
import type { Customer } from "@/lib/types/customers";
import type { User } from "@/lib/types/user";
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Info, PlusCircle, UserPlus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export type ListPersonRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  roleOrType: string;
  is_active: boolean;
  detailUrl: string;
};

type RoleFilter = "all" | "employee" | "customer" | "contractor";
type StatusFilter = "all" | "active" | "inactive";
type SortKey = "name" | "email" | "roleOrType" | "is_active" | null;

function normalizeUser(u: User): ListPersonRow {
  return {
    id: u.id,
    first_name: u.first_name,
    last_name: u.last_name,
    email: u.email,
    phone: u.phone ?? null,
    roleOrType: u.role,
    is_active: u.is_active,
    detailUrl: `/admin/users/${u.id}`,
  };
}

function normalizeCustomer(c: Customer): ListPersonRow {
  return {
    id: c.id,
    first_name: c.first_name,
    last_name: c.last_name,
    email: c.email,
    phone: c.phone ?? null,
    roleOrType: "customer",
    is_active: c.is_active,
    detailUrl: `/admin/users/customers/${c.id}`,
  };
}

function normalizeContractor(c: Contractor): ListPersonRow {
  return {
    id: c.id,
    first_name: c.first_name,
    last_name: c.last_name,
    email: c.email,
    phone: c.phone ?? null,
    roleOrType: "contractor",
    is_active: c.is_active,
    detailUrl: `/admin/users/contractors/${c.id}`,
  };
}

function getRoleBadgeClass(role: string): string {
  switch (role.toLowerCase()) {
    case "employee":
    case "admin":
    case "manager":
      return "bg-cerulean-100 text-cerulean-800";
    case "customer":
      return "bg-olive-100 text-olive-800";
    case "contractor":
      return "bg-yarrow-100 text-yarrow-800";
    default:
      return "bg-muted text-muted-foreground";
  }
}

const PAGE_SIZE = 25;
const COLUMNS = ["Name", "Email", "Phone", "Role / Type", "Status", "ID"];
const SORT_KEYS: Record<string, string> = {
  Name: "name",
  Email: "email",
  "Role / Type": "roleOrType",
  Status: "is_active",
};

const UsersListPage = () => {
  const [allPeople, setAllPeople] = useState<ListPersonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, employeesRes, customersRes, contractorsRes] =
        await Promise.all([
          api.get("users/getAllUsers"),
          api.get("users/role/employee"),
          api.get("customers/all"),
          api.get("contractors/getAllContractors"),
        ]);

      const users: User[] = usersRes.data.data ?? [];
      const employees: User[] = employeesRes.data.data ?? [];
      const customers: Customer[] = customersRes.data.data ?? [];
      const contractors: Contractor[] = contractorsRes.data.data ?? [];

      const userById = new Map<string, User>();
      users.forEach((u) => userById.set(u.id, u));
      employees.forEach((e) => userById.set(e.id, e));
      const mergedUsers = [...userById.values()];

      const rows: ListPersonRow[] = [
        ...mergedUsers.map(normalizeUser),
        ...customers.map(normalizeCustomer),
        ...contractors.map(normalizeContractor),
      ];
      setAllPeople(rows);
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filteredPeople = useMemo(() => {
    let result = allPeople;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.first_name.toLowerCase().includes(q) ||
          p.last_name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          (p.phone ?? "").toLowerCase().includes(q) ||
          p.roleOrType.toLowerCase().includes(q) ||
          (p.is_active ? "active" : "inactive").includes(q),
      );
    }

    if (roleFilter !== "all") {
      result = result.filter(
        (p) => p.roleOrType.toLowerCase() === roleFilter.toLowerCase(),
      );
    }

    if (statusFilter !== "all") {
      const wantActive = statusFilter === "active";
      result = result.filter((p) => p.is_active === wantActive);
    }

    if (sortKey) {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        if (sortKey === "name") {
          const aName = `${a.first_name} ${a.last_name}`.toLowerCase();
          const bName = `${b.first_name} ${b.last_name}`.toLowerCase();
          cmp = aName.localeCompare(bName);
        } else if (sortKey === "email") {
          cmp = a.email.toLowerCase().localeCompare(b.email.toLowerCase());
        } else if (sortKey === "roleOrType") {
          cmp = a.roleOrType.localeCompare(b.roleOrType);
        } else if (sortKey === "is_active") {
          cmp = (a.is_active ? 1 : 0) - (b.is_active ? 1 : 0);
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [allPeople, searchQuery, roleFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filteredPeople.length / PAGE_SIZE) || 1;
  const paginatedPeople = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPeople.slice(start, start + PAGE_SIZE);
  }, [filteredPeople, page]);

  const handleSort = (key: string) => {
    const k = key as SortKey;
    if (sortKey === k) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(k);
      setSortDir("asc");
    }
    setPage(1);
  };

  const clearFilters = () => {
    setRoleFilter("all");
    setStatusFilter("all");
    setSearchQuery("");
    setPage(1);
  };

  const hasActiveFilters =
    roleFilter !== "all" || statusFilter !== "all" || searchQuery.trim() !== "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-primary">Users List</h1>

        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users, customers, contractors..."
            className="md:w-64"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Role / Type</DropdownMenuLabel>
              {(["all", "employee", "customer", "contractor"] as const).map(
                (r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => {
                      setRoleFilter(r);
                      setPage(1);
                    }}
                  >
                    {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
                  </DropdownMenuItem>
                ),
              )}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              {(["all", "active", "inactive"] as const).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setPage(1);
                  }}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </DropdownMenuItem>
              ))}
              {hasActiveFilters && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters}>
                    Clear filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <QuickActionBar />

          <div className="flex gap-2">
            <Link href="/admin/users/customers/new">
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-1" /> Customer
              </Button>
            </Link>
            <Link href="/admin/users/contractors/new">
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-1" /> Contractor
              </Button>
            </Link>
            <Link href="/admin/users/new/">
              <Button>
                <PlusCircle className="w-5 h-5 mr-2" /> Add User
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-card rounded-lg border border-border shadow-sm">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-16" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchAll} variant="outline">
              Retry
            </Button>
          </div>
        ) : filteredPeople.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="mb-4">
              {hasActiveFilters
                ? "No users match your filters."
                : "No users found."}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <table className="min-w-full bg-card border border-border">
              <TableHeader
                columns={COLUMNS}
                sortConfig={
                  sortKey ? { key: sortKey, dir: sortDir } : undefined
                }
                onSort={handleSort}
                sortKeys={SORT_KEYS}
              />
              <tbody className="text-center">
                {paginatedPeople.map((person) => (
                  <tr
                    key={`${person.roleOrType}-${person.id}`}
                    className="hover:bg-muted/50"
                  >
                    <td className="border-b border-border px-6 py-4 text-sm text-foreground">
                      <Link
                        href={person.detailUrl}
                        className="hover:text-primary"
                      >
                        {person.first_name} {person.last_name}
                      </Link>
                    </td>
                    <td className="border-b border-border px-6 py-4 text-sm text-foreground">
                      {person.email}
                    </td>
                    <td className="border-b border-border px-6 py-4 text-sm text-foreground">
                      {person.phone ?? "—"}
                    </td>
                    <td className="border-b border-border px-6 py-4 text-sm">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-medium ${getRoleBadgeClass(person.roleOrType)}`}
                      >
                        {person.roleOrType.toUpperCase()}
                      </span>
                    </td>
                    <td className="border-b border-border px-6 py-4 text-sm">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-medium ${person.is_active ? "bg-olive-100 text-olive-800" : "bg-red-100 text-red-800"}`}
                      >
                        {person.is_active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="border-b border-border flex px-6 py-4 text-sm text-foreground justify-center items-center">
                      {person.id.slice(-6)}
                      <Link href={person.detailUrl} className="ml-2">
                        <Info className="h-4 w-4 hover:text-primary" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filteredPeople.length)} of{" "}
                {filteredPeople.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UsersListPage;
