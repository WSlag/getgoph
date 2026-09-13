import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-muted", className)}
      {...props}
    />
  );
}

export function CardSkeleton({ className }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 lg:p-6 shadow-sm", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-10 w-20 rounded-xl" />
      </div>
      <Skeleton className="h-16 w-full rounded-xl mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="size-16 rounded-xl" />
        <Skeleton className="size-16 rounded-xl" />
        <Skeleton className="size-16 rounded-xl" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
