import { SITE_CONFIG } from "@/lib/constants";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p className="text-sm text-muted-foreground">Last updated: June 2026</p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Account information: name, email address, campus selection</li>
        <li>Uploaded files: academic resources you submit to the platform</li>
        <li>Usage data: pages visited, features used (via analytics)</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To provide and maintain the platform&apos;s features</li>
        <li>To moderate uploaded content before publication</li>
        <li>To communicate about your account or submitted content</li>
        <li>To improve the platform based on aggregate usage patterns</li>
      </ul>

      <h2>Data Storage</h2>
      <p>
        Your data is stored securely using Supabase (PostgreSQL + Storage).
        Files are stored in Supabase Storage and profile/metadata in the database.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request deletion of your account and associated data by
        contacting us at {SITE_CONFIG.contactEmail}.
      </p>

      <p className="mt-8 text-sm">{SITE_CONFIG.disclaimer}</p>
    </LegalPageLayout>
  );
}
