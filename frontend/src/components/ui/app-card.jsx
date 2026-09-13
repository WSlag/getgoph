import React from "react";
import { cn } from "@/lib/cn";

/**
 * @deprecated Use Card from @/components/ui/card instead.
 * Kept for backwards compatibility — migrates to token-based styling.
 */
export function AppCard({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-200 p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({ className, label, value, valueClassName, icon, ...props }) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-4",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] text-slate-500 dark:text-slate-400">{label}</p>
          <p className={cn("mt-2 text-[18px] font-bold text-slate-950 dark:text-white", valueClassName)}>
            {value}
          </p>
        </div>
        {icon ? <div className="shrink-0 text-slate-400 dark:text-slate-500">{icon}</div> : null}
      </div>
    </div>
  );
}

export default AppCard;