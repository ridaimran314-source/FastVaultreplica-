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
      "Launched FASTVault — one login, all campuses, resources, societies, and events together.",
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
    <div className="mx-auto max-w-4xl px-4 py-16">
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold">Our Story</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          FASTVault started as a shared Google Drive folder at the Chiniot-Faisalabad
          campus. Students needed past papers and notes — so they shared them with
          each other. When we discovered other campuses had the same problem, we
          built a platform to bring everyone together.
        </p>
      </section>

      <section className="mb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {TIMELINE.map((item, i) => (
            <div key={i} className="rounded-xl border bg-card p-6">
              <div className="mb-2 text-sm font-medium text-vault-gold">
                Step {i + 1}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">What We Do</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="flex gap-4 rounded-xl border p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-vault-gold/10">
                <pillar.icon className="h-6 w-6 text-vault-gold" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Why We Do It</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((value) => (
            <div key={value.title} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-vault-gold/10">
                <value.icon className="h-7 w-7 text-vault-gold" />
              </div>
              <h3 className="mb-2 font-semibold">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-vault-navy p-8 text-center text-white">
        <BookOpen className="mx-auto mb-4 h-10 w-10 text-vault-gold" />
        <h2 className="mb-4 text-2xl font-bold">Join the community</h2>
        <p className="mb-6 text-white/70">
          Explore resources or share your own materials with students across all
          campuses.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/resources">
            <Button size="lg">Start Exploring</Button>
          </Link>
          <Link href="/resources/upload">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Share Resources
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
