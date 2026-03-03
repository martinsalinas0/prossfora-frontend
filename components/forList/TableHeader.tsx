"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

interface TableHeaderProps {
  columns: string[];
  sortConfig?: { key: string; dir: "asc" | "desc" };
  onSort?: (key: string) => void;
  sortKeys?: Record<string, string>;
}

const TableHeader = ({
  columns,
  sortConfig,
  onSort,
  sortKeys,
}: TableHeaderProps) => {
  return (
    <thead className="bg-cerulean-50 uppercase">
      <tr>
        {columns.map((label) => {
          const sortKey = sortKeys?.[label];
          const isSortable = sortKey && onSort;
          const isActive = sortConfig?.key === sortKey;

          return (
            <th
              key={label}
              className={`border-b border-cerulean-100 px-6 py-3 text-center text-sm font-semibold text-cerulean ${
                isSortable ? "cursor-pointer select-none hover:bg-cerulean-100/50" : ""
              }`}
              onClick={() => isSortable && onSort(sortKey)}
            >
              <span className="inline-flex items-center gap-1">
                {label}
                {isSortable &&
                  isActive &&
                  (sortConfig.dir === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  ))}
              </span>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
