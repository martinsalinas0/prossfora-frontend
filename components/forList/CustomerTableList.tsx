"use client";

import { Customer } from "@/lib/types/customers";
import TableHeader from "./TableHeader";
import Link from "next/link";

interface CustomerTableListProps {
  data: Customer[];
}

const CustomerTableList: React.FC<CustomerTableListProps> = ({ data }) => {
  const columns = ["Name", "Email", "Phone", "Address", "Status"];

  return (
    <div className="overflow-x-auto text-center">
      <table className="min-w-full bg-card border border-border">
        <TableHeader columns={columns} />
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-4 text-sm text-foreground"
              >
                No customers found
              </td>
            </tr>
          ) : (
            data.map((c) => (
              <tr key={c.id} className="hover:bg-muted/50 text-center">
                <td className="border-b border-border px-6 py-4 text-sm text-foreground ">
                  <Link
                    href={`/admin/users/customers/${c.id}`}
                    className="hover:text-primary"
                  >
                    {c.first_name} {c.last_name}
                  </Link>
                </td>
                <td className="border-b border-border px-6 py-4 text-sm text-foreground ">
                  {c.email}
                </td>
                <td className="border-b border-border px-6 py-4 text-sm text-foreground ">
                  {c.phone}
                </td>
                <td className="border-b border-border px-6 py-4 text-sm text-foreground ">
                  {c.address}, {}
                  {c.city}
                </td>
                <td className="border-b border-border px-6 py-4 text-sm text-foreground ">
                  {c.is_active ? "ACTIVE" : "INACTIVE"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTableList;
