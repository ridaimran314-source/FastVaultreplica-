import { Mail } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const LEADERSHIP = [
  {
    name: "M.Harris Tariq",
    role: "Lead",
    email: "f223088@cfd.nu.edu.pk",
  },
  {
    name: "Rida Imran",
    role: "Co-Lead",
    email: "f230051@cfd.nu.edu.pk",
  },
];

function TeamMemberCard({
  name,
  role,
  email,
}: {
  name: string;
  role: string;
  email: string;
}) {
  return (
    <div className="surface-card p-8 text-center">
      <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-vault-gold/20 to-vault-gold/5 text-3xl font-bold text-vault-gold shadow-inner">
        {name.charAt(0)}
      </div>
      <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
      <p className="mb-4 mt-1 text-sm font-semibold uppercase tracking-wider text-vault-gold">
        {role}
      </p>
      <a
        href={`mailto:${email}`}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-vault-gold/50 hover:text-vault-gold"
      >
        <Mail className="h-4 w-4" />
        {email}
      </a>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="The people behind HarriDesk"
        title="Our Team"
        description="Student leaders building practical tools for the FAST-NUCES community."
      />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <section>
          <h2 className="section-eyebrow mb-2">Leadership</h2>
          <h3 className="section-title mb-10">Meet the team</h3>
          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
            {LEADERSHIP.map((member) => (
              <TeamMemberCard key={member.role} {...member} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
