"use client";

import CustomerTableList from "@/components/forList/CustomerTableList";
import SearchBar from "@/components/SearchBar";
import api from "@/lib/api";
import { Customer } from "@/lib/types/customers";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CustomersListPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("customers/all");
        setCustomers(response.data.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.first_name?.toLowerCase().includes(q) ||
        c.last_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-cerulean mb-4">Customer List</h1>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search customers..."
            className="md:w-64"
          />

          <Link
            href="/admin/users/customers/new"
            className="bg-olive-500 hover:bg-olive-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <div className="flex items-center gap-2">
              Add Customer <Plus size={18} />
            </div>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <CustomerTableList data={filteredCustomers} />
      </div>
    </div>
  );
};

export default CustomersListPage;
