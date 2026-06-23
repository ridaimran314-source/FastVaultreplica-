import { Mail } from "lucide-react";

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
    <div className="rounded-xl border bg-card p-6 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-vault-gold/10 text-2xl font-bold text-vault-gold">
        {name.charAt(0)}
      </div>
      <h3 className="font-semibold">{name}</h3>
      <p className="mb-3 text-sm font-medium text-vault-gold">{role}</p>
      <a
        href={`mailto:${email}`}
        className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-vault-gold"
      >
        <Mail className="h-4 w-4" />
        {email}
      </a>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Our Team</h1>
        <p className="text-muted-foreground">
          The students leading HarriDesk — building tools for students.
        </p>
      </div>

      <section>
        <h2 className="mb-6 text-center text-2xl font-bold">Leadership</h2>
        <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
          {LEADERSHIP.map((member) => (
            <TeamMemberCard key={member.role} {...member} />
          ))}
        </div>
      </section>
    </div>
  );
}
