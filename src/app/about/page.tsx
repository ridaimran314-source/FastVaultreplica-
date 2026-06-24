import Link from "next/link";
import {
  BookOpen,
  Globe,
  GraduationCap,
  Users,
  Share2,
  Heart,
  Target,
  Lightbulb,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";

const TIMELINE = [
  {
    title: "Started with Google Drive",
    description:
      "A shared folder at the CFD campus where students uploaded past papers and notes for each other.",
  },
  {
    title: "Explored Beyond Our Campus",
    description:
      "Discovered that other FAST campuses had similar resources — but no central place to find them.",
  },
  {
    title: "Added Admission Tools",
    description:
      "Built an aggregate calculator and admission resource hub to help prospective students.",
  },
  {
    title: "Built a Central Platform",
    description:
      "Launched HarriDesk — one login, all campuses, resources, societies, and events together.",
  },
];

const PILLARS = [
  {
    icon: Share2,
    title: "Resource Sharing",
    description:
      "Students upload and discover academic materials from every campus in one searchable directory.",
  },
  {
    icon: Globe,
    title: "Central Platform",
    description:
      "One hub for courses, admission tools, societies, and events — no more scattered Google Drives.",
  },
  {
    icon: GraduationCap,
    title: "Admission Support",
    description:
      "Calculator, FAQs, and test materials to guide prospective students through the admission process.",
  },
  {
    icon: Users,
    title: "Community Building",
    description:
      "Connect with societies, stay updated on events, and be part of a student-driven community.",
  },
];

const VALUES = [
  {
    icon: Heart,
    title: "Student-Driven",
    description:
      "Built by students who understand the challenges of university life firsthand.",
  },
  {
    icon: Lightbulb,
    title: "Knowledge Sharing",
    description:
      "Every upload helps the next student — pay it forward with notes, papers, and guides.",
  },
  {
    icon: Target,
    title: "Community First",
    description:
      "We prioritize what students actually need over flashy features nobody uses.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="About HarriDesk"
        title="Our Story"
        description="From a campus Google Drive folder to a nationwide student platform for every FAST-NUCES campus."
      />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <section className="mb-16 text-center">
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            HarriDesk started as a shared Google Drive folder at the Chiniot-Faisalabad
            campus. Students needed past papers and notes — so they shared them with
            each other. When we discovered other campuses had the same problem, we
            built a platform to bring everyone together.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="section-eyebrow mb-2">Timeline</h2>
          <h3 className="section-title mb-10">How we got here</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {TIMELINE.map((item, i) => (
              <div key={i} className="surface-card p-6">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-vault-gold">
                  Step {i + 1}
                </div>
                <h4 className="mb-2 text-lg font-semibold">{item.title}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="section-eyebrow mb-2">Mission</h2>
          <h3 className="section-title mb-10">What we do</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="surface-card flex gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-vault-gold/15">
                  <pillar.icon className="h-6 w-6 text-vault-gold" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">{pillar.title}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="section-eyebrow mb-2">Values</h2>
          <h3 className="section-title mb-10">Why we do it</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="surface-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-vault-gold/15">
                  <value.icon className="h-7 w-7 text-vault-gold" />
                </div>
                <h4 className="mb-2 font-semibold">{value.title}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-panel">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-vault-gold" />
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">Join the community</h2>
          <p className="mx-auto mb-8 max-w-xl text-white/75">
            Explore resources or share your own materials with students across all
            campuses.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/resources">Start Exploring</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/resources/upload">Share Resources</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
