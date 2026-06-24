"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Calculator,
  Users,
  Calendar,
  Share2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  CAMPUSES,
  FEATURE_CARDS,
  HERO_PHRASES,
  SITE_CONFIG,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { StatsCounter } from "@/components/shared/StatsCounter";
import { TestimonialsCarousel } from "@/components/shared/Testimonials";
import { CampusCard } from "@/components/shared/CampusCard";
import type { StatsSummary } from "@/lib/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  GraduationCap,
  Calculator,
  Users,
  Calendar,
  Share2,
};

const DEFAULT_STATS: StatsSummary = {
  totalFiles: 0,
  totalResources: 0,
  admissionItems: 0,
  campusEvents: 0,
  societies: 0,
  registeredUsers: 0,
};

export default function HomePage() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [stats, setStats] = useState<StatsSummary>(DEFAULT_STATS);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setStatsLoading(false);
      return;
    }

    async function loadStats() {
      const supabase = getSupabase();
      const [resources, admission, events, societies, users] = await Promise.all([
        supabase.from("resources").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("admission_resources").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("societies").select("id", { count: "exact", head: true }),
        supabase.from("users").select("id", { count: "exact", head: true }),
      ]);

      const totalResources = resources.count ?? 0;
      const admissionItems = admission.count ?? 0;
      setStats({
        totalFiles: totalResources + admissionItems,
        totalResources,
        admissionItems,
        campusEvents: events.count ?? 0,
        societies: societies.count ?? 0,
        registeredUsers: users.count ?? 0,
      });
      setStatsLoading(false);
    }

    loadStats();
  }, []);

  return (
    <>
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden bg-vault-navy text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          poster="/grid.svg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-vault-navy/95 via-vault-blue/85 to-vault-navy/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(10,22,40,0.4)_100%)]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <p className="mb-4 inline-flex items-center rounded-full border border-vault-gold/30 bg-vault-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-vault-gold">
            FAST NUCES · Academic Platform
          </p>
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            {SITE_CONFIG.name}
          </h1>
          <motion.p
            key={phraseIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-xl text-white/80 md:text-2xl"
          >
            {HERO_PHRASES[phraseIndex]}
            <span className="animate-pulse">|</span>
          </motion.p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/resources">
                Courses Directory
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-vault-gold font-semibold text-vault-navy shadow-lg hover:bg-vault-gold/90"
              asChild
            >
              <Link href="/admission">Admission Hub</Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10"
              asChild
            >
              <a
                href={SITE_CONFIG.facebookGroup}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook Community
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-2 section-eyebrow">By the numbers</p>
          <h2 className="mb-12 section-title">Platform at a glance</h2>
          {statsLoading ? (
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse text-center">
                  <div className="mx-auto h-10 w-16 rounded bg-muted-foreground/20" />
                  <div className="mx-auto mt-2 h-3 w-20 rounded bg-muted-foreground/20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
              <StatsCounter label="Total files" value={stats.totalFiles} />
              <StatsCounter
                label="Academic resources"
                value={stats.totalResources}
              />
              <StatsCounter
                label="Admission items"
                value={stats.admissionItems}
              />
              <StatsCounter label="Campus events" value={stats.campusEvents} />
              <StatsCounter label="Societies" value={stats.societies} />
              <StatsCounter
                label="Registered users"
                value={stats.registeredUsers}
              />
            </div>
          )}
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-2 section-eyebrow">What you get</p>
          <h2 className="mb-4 section-title">Everything in one place</h2>
          <p className="section-subtitle mb-12">
            Built like a product you&apos;d expect from a serious platform — clear,
            fast, and focused on students.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURE_CARDS.map((card) => {
              const Icon = ICON_MAP[card.icon];
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="surface-card group p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-vault-gold/10">
                    {Icon && <Icon className="h-6 w-6 text-vault-gold" />}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-vault-gold">
                    {card.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {card.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-vault-gold">
                    Explore <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-2 section-eyebrow">Voices</p>
          <h2 className="mb-4 section-title">What students say</h2>
          <p className="section-subtitle mb-12">
            Feedback from across FAST NUCES campuses.
          </p>
          <TestimonialsCarousel />
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-2 section-eyebrow">Nationwide</p>
          <h2 className="mb-4 section-title">Every campus</h2>
          <p className="section-subtitle mb-12">
            Resources, societies, and events from all six FAST NUCES campuses.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CAMPUSES.map((campus) => (
              <CampusCard key={campus.id} {...campus} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="cta-panel">
            <h2 className="mb-4 text-3xl font-bold">Start with one click</h2>
            <p className="mx-auto mb-8 max-w-xl text-white/75">
              Browse courses, admission tools, and campus life — built for Fastians,
              by students who get it.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/resources">Explore courses</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link href="/about">Our story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
