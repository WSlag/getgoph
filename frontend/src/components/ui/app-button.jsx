import React from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] shadow-[0_6px_12px_rgba(28,25,23,0.10)]",
  secondary:
    "border border-border bg-secondary text-secondary-foreground hover:bg-accent dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:hover:bg-stone-700",
  outline:
    "border border-primary bg-transparent text-primary hover:bg-primary-soft dark:text-primary dark:hover:bg-orange-950/20",
  success:
    "bg-[var(--success)] text-white hover:brightness-95 shadow-[0_6px_12px_rgba(28,25,23,0.10)]",
  danger:
    "bg-destructive text-white hover:bg-destructive/90 shadow-[0_6px_12px_rgba(28,25,23,0.10)]",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground dark:text-stone-300 dark:hover:bg-stone-800",
};

const sizes = {
  sm: "h-9 rounded-[10px] px-3 text-sm",
  md: "h-11 rounded-[10px] px-4 text-sm",
  lg: "h-12 rounded-[10px] px-5 text-base",
  icon: "h-11 w-11 rounded-[10px] p-0",
};

export function AppButton({
  asChild = false,
  type = "button",
  variant = "primary",
  size = "lg",
  className,
  children,
  disabled,
  ...props
}) {
  const Component = asChild ? "span" : "button";

  return (
    <Component
      type={asChild ? undefined : type}
      disabled={asChild ? undefined : disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:ring-offset-2 dark:focus-visible:ring-orange-900",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default AppButton;