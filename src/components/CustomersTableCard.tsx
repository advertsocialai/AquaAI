"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const avatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f59e0b&color=000&bold=true`;

export type Customer = {
  id: number | string;
  date: string;
  status: "Paid" | "Pending" | "Refund";
  statusVariant: "success" | "danger" | "warning";
  name: string;
  avatar: string;
  revenue: string;
};

export type CustomersTableCardProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  customers?: Customer[];
};

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 1,
    date: "31 May 2026",
    status: "Paid",
    statusVariant: "success",
    name: "V. Ramana",
    avatar: avatar("V Ramana"),
    revenue: "₹8,94,000",
  },
  {
    id: 2,
    date: "29 May 2026",
    status: "Pending",
    statusVariant: "warning",
    name: "S. Prasad Exports",
    avatar: avatar("S Prasad"),
    revenue: "₹4,20,000",
  },
  {
    id: 3,
    date: "27 May 2026",
    status: "Paid",
    statusVariant: "success",
    name: "K. Lakshmi Farms",
    avatar: avatar("K Lakshmi"),
    revenue: "₹2,40,000",
  },
  {
    id: 4,
    date: "24 May 2026",
    status: "Refund",
    statusVariant: "danger",
    name: "M. Subba Rao",
    avatar: avatar("M Subba Rao"),
    revenue: "₹1,15,000",
  },
];

const Badge = ({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "success" | "danger" | "warning";
}) => {
  const styles =
    variant === "success"
      ? "bg-lime-500/15 text-lime-800 dark:text-lime-300"
      : variant === "danger"
      ? "bg-red-500/15 text-red-800 dark:text-red-300"
      : "bg-yellow-500/15 text-yellow-800 dark:text-yellow-300";

  return (
    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", styles)}>
      {children}
    </span>
  );
};

/**
 * Responsive, polished table wrapped in a card container.
 * - Sticky header on wide screens
 * - Horizontal scroll on small screens
 * - Subtle borders, shadows, and hover states
 */
export default function CustomersTableCard({
  title = "Recent settlements",
  subtitle = "Supplier payouts across the coastal belt this week",
  customers = DEFAULT_CUSTOMERS,
  className,
}: CustomersTableCardProps) {
  return (
    <section
      className={cn(
        "bg-background relative w-full overflow-hidden rounded-2xl border border-border/60 shadow-md ring-1 ring-foreground/5",
        className
      )}
      aria-label={title}
    >
      {/* Header */}
      <div className="space-y-1 border-b border-border/60 p-6">
        <div className="flex items-center gap-1.5">
          <span className="bg-muted size-2 rounded-full border border-black/5" />
          <span className="bg-muted size-2 rounded-full border border-black/5" />
          <span className="bg-muted size-2 rounded-full border border-black/5" />
        </div>
        <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>

      {/* Table wrapper for responsive overflow */}
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full border-collapse text-sm">
          <thead className="bg-muted/50 supports-[backdrop-filter]:backdrop-blur-sm sticky top-0 z-10">
            <tr className="text-muted-foreground *:text-left *:px-3 *:py-3 *:font-medium">
              <th className="w-12">#</th>
              <th className="min-w-[120px]">Date</th>
              <th className="min-w-[120px]">Status</th>
              <th className="min-w-[220px]">Supplier</th>
              <th className="min-w-[120px] text-right pr-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, idx) => (
              <tr
                key={customer.id}
                className="hover:bg-muted/30 transition-colors *:px-3 *:py-2 border-b border-border/60 last:border-0"
              >
                <td className="text-muted-foreground">{idx + 1}</td>
                <td className="whitespace-nowrap">{customer.date}</td>
                <td>
                  <Badge variant={customer.statusVariant}>{customer.status}</Badge>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="size-7 overflow-hidden rounded-full ring-1 ring-border/60">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        width={28}
                        height={28}
                        loading="lazy"
                      />
                    </div>
                    <span className="text-foreground font-medium truncate">{customer.name}</span>
                  </div>
                </td>
                <td className="text-right pr-4 font-medium tabular-nums">{customer.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer (optional) */}
      <div className="flex items-center justify-between border-t border-border/60 p-4 text-xs text-muted-foreground">
        <span>
          Showing <strong>{customers.length}</strong> {customers.length === 1 ? "row" : "rows"}
        </span>
        <span>Updated just now</span>
      </div>
    </section>
  );
}
