import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-vault-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-vault-gold font-bold text-vault-navy">
                HD
              </div>
              <span className="text-lg font-bold">{SITE_CONFIG.name}</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-white/70">
              {SITE_CONFIG.tagline}
            </p>
            <p className="mt-2 text-xs text-white/50">{SITE_CONFIG.disclaimer}</p>
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="mt-4 inline-block text-sm text-vault-gold hover:underline"
            >
              {SITE_CONFIG.contactEmail}
            </a>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Explore</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-vault-gold">Home</Link></li>
              <li><Link href="/about" className="hover:text-vault-gold">About</Link></li>
              <li><Link href="/admission" className="hover:text-vault-gold">Admission Materials</Link></li>
              <li><Link href="/admission/calculator" className="hover:text-vault-gold">Aggregate Calculator</Link></li>
              <li><Link href="/admission/faq" className="hover:text-vault-gold">Admission FAQ</Link></li>
              <li><Link href="/resources" className="hover:text-vault-gold">Academic Courses</Link></li>
              <li><Link href="/societies" className="hover:text-vault-gold">Societies</Link></li>
              <li><Link href="/events" className="hover:text-vault-gold">Events</Link></li>
              <li><Link href="/team" className="hover:text-vault-gold">Team</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Legal & Account</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/privacy" className="hover:text-vault-gold">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-vault-gold">Terms & Conditions</Link></li>
              <li><Link href="/content-policy" className="hover:text-vault-gold">Content Policy</Link></li>
              <li><Link href="/login" className="hover:text-vault-gold">Login</Link></li>
              <li><Link href="/signup" className="hover:text-vault-gold">Sign Up</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-sm text-white/50">
            Built by{" "}
            <a
              href={SITE_CONFIG.builderPortfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-vault-gold hover:underline"
            >
              {SITE_CONFIG.builderName}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
