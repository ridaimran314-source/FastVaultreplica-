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
import { doc, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
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
    if (!isFirebaseConfigured() || !db) {
      setStatsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "stats", "summary"),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setStats({
            totalFiles: data.totalFiles ?? 0,
            totalResources: data.totalResources ?? 0,
            admissionItems: data.admissionItems ?? 0,
            campusEvents: data.campusEvents ?? 0,
            societies: data.societies ?? 0,
            registeredUsers: data.registeredUsers ?? 0,
          });
        }
        setStatsLoading(false);
      },
      () => setStatsLoading(false)
    );

    return unsubscribe;
  }, []);

  return (
    <>
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-vault-navy text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          poster="/grid.svg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-vault-navy/90 via-vault-blue/80 to-vault-navy/90" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-vault-gold">
            FAST NUCES · Academic platform
          </p>
          <h1 className="mb-6 text-5xl font-bold md:text-7xl">
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

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/resources">
              <Button size="lg">
                Courses Directory
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admission">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Admission Hub
              </Button>
            </Link>
            <a
              href={SITE_CONFIG.facebookGroup}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                Facebook Community
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-2 text-center text-sm font-medium uppercase tracking-widest text-vault-gold">
            By the numbers
          </p>
          <h2 className="mb-12 text-center text-3xl font-bold">
            Platform at a glance
          </h2>
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
          <p className="mb-2 text-center text-sm font-medium uppercase tracking-widest text-vault-gold">
            What you get
          </p>
          <h2 className="mb-4 text-center text-3xl font-bold">
            Everything in one place
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
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
                  className="group rounded-2xl border bg-card p-6 transition-all hover:border-vault-gold/50 hover:shadow-lg"
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
          <p className="mb-2 text-center text-sm font-medium uppercase tracking-widest text-vault-gold">
            Voices
          </p>
          <h2 className="mb-4 text-center text-3xl font-bold">
            What students say
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Feedback from across FAST NUCES campuses.
          </p>
          <TestimonialsCarousel />
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-2 text-center text-sm font-medium uppercase tracking-widest text-vault-gold">
            Nationwide
          </p>
          <h2 className="mb-4 text-center text-3xl font-bold">Every campus</h2>
          <p className="mb-12 text-center text-muted-foreground">
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
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Start with one click.</h2>
          <p className="mb-8 text-muted-foreground">
            Browse courses, admission tools, and campus life — built for Fastians,
            by students who get it.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/resources">
              <Button size="lg">Explore courses</Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Our story
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
