"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const testimonial = TESTIMONIALS[current];

  return (
    <div className="relative mx-auto max-w-3xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-8 shadow-card md:p-10"
        >
          <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-vault-gold/10" />
          <Quote className="mb-4 h-8 w-8 text-vault-gold" />
          <p className="mb-6 text-lg leading-relaxed text-foreground/90 md:text-xl">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <div className="border-t border-dashed pt-4">
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">
              {testimonial.program} · {testimonial.campus}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() =>
            setCurrent(
              (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
            )
          }
          className="rounded-full border border-border bg-card p-2 shadow-sm transition-colors hover:bg-muted"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-6 bg-vault-gold" : "w-2 bg-muted-foreground/30"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length)}
          className="rounded-full border border-border bg-card p-2 shadow-sm transition-colors hover:bg-muted"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
