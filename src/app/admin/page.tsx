"use client";

import {
  Upload,
  MessageCircleQuestion,
  Calendar,
  Users,
  BarChart3,
} from "lucide-react";
import { ProtectedRoute } from "@/lib/auth/useProtectedRoute";
import { PageHeader } from "@/components/layout/PageHeader";
import { HubLinkCard } from "@/components/shared/HubLinkCard";

const ADMIN_LINKS = [
  {
    href: "/admin/uploads",
    title: "Upload Moderation",
    description: "Review and approve pending resource uploads",
    icon: Upload,
  },
  {
    href: "/admin/faq",
    title: "FAQ Moderation",
    description: "Answer and publish pending questions",
    icon: MessageCircleQuestion,
  },
  {
    href: "/admin/events",
    title: "Manage Events",
    description: "Create and edit campus events",
    icon: Calendar,
  },
  {
    href: "/admin/societies",
    title: "Manage Societies",
    description: "Add and edit society entries",
    icon: Users,
  },
  {
    href: "/admin/merit",
    title: "Merit History",
    description: "Update closing merit records",
    icon: BarChart3,
  },
];

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="pb-12">
        <PageHeader
          eyebrow="Administration"
          title="Admin Dashboard"
          description="Manage uploads, content, events, societies, and admission data."
        />

        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            {ADMIN_LINKS.map((link) => (
              <HubLinkCard key={link.href} {...link} />
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
