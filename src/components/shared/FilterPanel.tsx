import { Card, CardContent } from "@/components/ui/card";

interface FilterPanelProps {
  title?: string;
  children: React.ReactNode;
  onClear?: () => void;
  showClear?: boolean;
}

export function FilterPanel({
  title = "Filter & search",
  children,
  onClear,
  showClear,
}: FilterPanelProps) {
  return (
    <Card className="mb-8 border-border/80 shadow-card">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {showClear && onClear && (
            <button
              type="button"
              className="text-sm font-medium text-vault-gold hover:underline"
              onClick={onClear}
            >
              Clear all
            </button>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
