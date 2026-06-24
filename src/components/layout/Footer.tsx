import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-vault-navy text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-vault-gold/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-vault-gold to-amber-400 font-bold text-vault-navy">
                HD
              </div>
              <div>
                <span className="block text-lg font-bold">{SITE_CONFIG.name}</span>
                <span className="text-xs text-white/50">FAST-NUCES Academic Hub</span>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
              {SITE_CONFIG.tagline}
            </p>
            <p className="mt-3 text-xs text-white/45">{SITE_CONFIG.disclaimer}</p>
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="mt-5 inline-block text-sm font-medium text-vault-gold hover:underline"
            >
              {SITE_CONFIG.contactEmail}
            </a>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-vault-gold">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-white">About</Link></li>
              <li><Link href="/admission" className="transition-colors hover:text-white">Admission</Link></li>
              <li><Link href="/resources" className="transition-colors hover:text-white">Resources</Link></li>
              <li><Link href="/societies" className="transition-colors hover:text-white">Societies</Link></li>
              <li><Link href="/events" className="transition-colors hover:text-white">Events</Link></li>
              <li><Link href="/team" className="transition-colors hover:text-white">Team</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-vault-gold">
              Legal & Account
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/content-policy" className="transition-colors hover:text-white">Content Policy</Link></li>
              <li><Link href="/login" className="transition-colors hover:text-white">Login</Link></li>
              <li><Link href="/signup" className="transition-colors hover:text-white">Sign Up</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/45">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-sm text-white/45">
            Built by{" "}
            <a
              href={SITE_CONFIG.builderPortfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-vault-gold hover:underline"
            >
              {SITE_CONFIG.builderName}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
