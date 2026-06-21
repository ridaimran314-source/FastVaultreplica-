export default function ContentPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 prose prose-slate">
      <h1>Content Policy</h1>
      <p className="text-muted-foreground">Last updated: June 2026</p>

      <h2>What You Can Upload</h2>
      <ul>
        <li>Past papers, notes, assignments, lab manuals, slides, study guides</li>
        <li>Admission test materials and preparation guides</li>
        <li>Helpful academic links and resources</li>
      </ul>

      <h2>What You Cannot Upload</h2>
      <ul>
        <li>Copyrighted material you do not have permission to share</li>
        <li>Leaked or unauthorized exam content</li>
        <li>Personal information of other students or faculty</li>
        <li>Offensive, discriminatory, or inappropriate content</li>
        <li>Malware, spam, or unrelated commercial content</li>
      </ul>

      <h2>Review Process</h2>
      <p>
        All uploads enter a moderation queue and are reviewed within 2–5 business
        days. You will be notified if your upload is rejected, along with a reason.
      </p>

      <h2>Reporting</h2>
      <p>
        If you find content that violates this policy, please contact our team
        immediately so we can review and remove it.
      </p>
    </div>
  );
}
