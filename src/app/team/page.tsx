import { Github, Linkedin, Globe } from "lucide-react";

const TEAM = {
  founder: {
    name: "Platform Founder",
    role: "Founder & Lead Developer",
    photo: null,
    links: { github: "#", linkedin: "#", portfolio: "#" },
  },
  coreTeam: [
    {
      name: "Core Member 1",
      role: "Backend Developer",
      photo: null,
      links: { github: "#", linkedin: "#" },
    },
    {
      name: "Core Member 2",
      role: "Frontend Developer",
      photo: null,
      links: { github: "#", linkedin: "#" },
    },
  ],
  contributors: [
    { name: "Contributor 1", role: "Content Moderator" },
    { name: "Contributor 2", role: "Campus Ambassador" },
  ],
  developers: [
    { name: "Community Dev 1", role: "Open Source Contributor" },
    { name: "Community Dev 2", role: "Bug Reporter" },
  ],
};

function TeamMemberCard({
  name,
  role,
  links,
}: {
  name: string;
  role: string;
  links?: { github?: string; linkedin?: string; portfolio?: string };
}) {
  return (
    <div className="rounded-xl border bg-card p-6 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-vault-gold/10 text-2xl font-bold text-vault-gold">
        {name.charAt(0)}
      </div>
      <h3 className="font-semibold">{name}</h3>
      <p className="mb-3 text-sm text-muted-foreground">{role}</p>
      {links && (
        <div className="flex justify-center gap-3">
          {links.github && (
            <a href={links.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-vault-gold">
              <Github className="h-4 w-4" />
            </a>
          )}
          {links.linkedin && (
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-vault-gold">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {links.portfolio && (
            <a href={links.portfolio} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-vault-gold">
              <Globe className="h-4 w-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Our Team</h1>
        <p className="text-muted-foreground">
          The students behind FASTVault — building tools for students.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Founder</h2>
        <div className="mx-auto max-w-xs">
          <TeamMemberCard {...TEAM.founder} />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Core Team</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {TEAM.coreTeam.map((member) => (
            <TeamMemberCard key={member.name} {...member} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Contributors</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {TEAM.contributors.map((member) => (
            <TeamMemberCard key={member.name} {...member} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold">Developers & Community</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {TEAM.developers.map((member) => (
            <TeamMemberCard key={member.name} {...member} />
          ))}
        </div>
      </section>
    </div>
  );
}
