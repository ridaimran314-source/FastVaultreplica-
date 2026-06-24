import { PageHeader } from "@/components/layout/PageHeader";

interface LegalPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div className="pb-16">
      <PageHeader eyebrow="Legal" title={title} />
      <div className="legal-prose mx-auto max-w-3xl px-4 py-10">{children}</div>
    </div>
  );
}
