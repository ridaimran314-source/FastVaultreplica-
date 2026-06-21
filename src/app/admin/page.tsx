"use client";

import Link from "next/link";
import {
  Upload,
  MessageCircleQuestion,
  Calendar,
  Users,
  BarChart3,
} from "lucide-react";
import { ProtectedRoute } from "@/lib/auth/useProtectedRoute";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {ADMIN_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full transition-all hover:border-vault-gold/50 hover:shadow-md">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-vault-gold/10">
                    <link.icon className="h-6 w-6 text-vault-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{link.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
