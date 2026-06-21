import { SITE_CONFIG } from "@/lib/constants";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 prose prose-slate">
      <h1>Terms & Conditions</h1>
      <p className="text-muted-foreground">Last updated: June 2026</p>

      <h2>Acceptance of Terms</h2>
      <p>
        By using {SITE_CONFIG.name}, you agree to these terms. If you do not
        agree, please do not use the platform.
      </p>

      <h2>Account Responsibilities</h2>
      <ul>
        <li>You are responsible for maintaining the security of your account</li>
        <li>You must provide accurate information during registration</li>
        <li>One account per person — do not share credentials</li>
      </ul>

      <h2>Content Guidelines</h2>
      <p>
        All uploads are subject to our{" "}
        <a href="/content-policy">Content Policy</a> and moderation review.
        Inappropriate content will be rejected.
      </p>

      <h2>Disclaimer</h2>
      <p>
        {SITE_CONFIG.name} is a community-run platform. We do not guarantee the
        accuracy of uploaded materials. Use resources at your own discretion.
        {SITE_CONFIG.disclaimer}
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        The platform is provided &quot;as is&quot; without warranties. We are not
        liable for any damages arising from use of the platform or its content.
      </p>
    </div>
  );
}
