import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "border-b bg-gradient-to-br from-vault-navy via-vault-blue to-vault-navy px-4 py-10 text-white",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-vault-gold">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm text-white/75 md:text-base">
              {description}
            </p>
          )}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </div>
  );
}
