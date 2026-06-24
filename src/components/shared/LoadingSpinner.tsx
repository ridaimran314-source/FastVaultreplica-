import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-vault-gold border-t-transparent",
        sizes[size],
        className
      )}
    />
  );
}

export function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <div className="rounded-2xl border border-border/80 bg-card p-8 shadow-card">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="mt-4 text-sm font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-border/80 bg-card p-6 shadow-card">
      <div className="mb-4 h-4 w-3/4 rounded bg-muted" />
      <div className="mb-2 h-3 w-1/2 rounded bg-muted" />
      <div className="h-3 w-full rounded bg-muted" />
    </div>
  );
}
