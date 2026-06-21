/**
 * Seed script for FASTVault replica demo data.
 *
 * Prerequisites:
 * 1. Download service account key from Firebase Console
 * 2. Save as serviceAccountKey.json in project root
 * 3. Run: npm run seed
 */

import * as admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const serviceAccountPath = resolve(
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json"
);

if (!existsSync(serviceAccountPath)) {
  console.error(
    "Missing serviceAccountKey.json — download from Firebase Console > Project Settings > Service Accounts"
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function seed() {
  console.log("Seeding FASTVault demo data...");

  await db.collection("stats").doc("summary").set({
    totalFiles: 150,
    totalResources: 120,
    admissionItems: 30,
    campusEvents: 25,
    societies: 45,
    registeredUsers: 500,
  });

  const societies = [
    {
      name: "ACM Student Chapter",
      description:
        "Association for Computing Machinery — promoting computer science education and professional development.",
      campus: "islamabad",
      category: "Technical",
      members: 150,
      social_links: { instagram: "https://instagram.com", facebook: "https://facebook.com" },
    },
    {
      name: "IEEE Student Branch",
      description:
        "Institute of Electrical and Electronics Engineers — connecting engineering students with industry.",
      campus: "lahore",
      category: "Technical",
      members: 120,
      social_links: { linkedin: "https://linkedin.com" },
    },
    {
      name: "Drama Society",
      description: "Performing arts and theatrical productions across campus.",
      campus: "karachi",
      category: "Cultural",
      members: 80,
      social_links: { instagram: "https://instagram.com" },
    },
  ];

  for (const society of societies) {
    await db.collection("societies").add({
      ...society,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  const events = [
    {
      title: "Intro to Machine Learning Workshop",
      description:
        "Hands-on workshop covering ML fundamentals with Python and scikit-learn.",
      date: new Date("2026-07-15T14:00:00"),
      venue: "Lab 301, SE Building",
      campus: "islamabad",
      organizer: "ACM Student Chapter",
    },
    {
      title: "Annual Hackathon 2026",
      description: "24-hour coding competition open to all FAST campuses.",
      date: new Date("2026-08-01T09:00:00"),
      venue: "Main Auditorium",
      campus: "lahore",
      organizer: "IEEE Student Branch",
      registration_url: "https://example.com/register",
    },
  ];

  for (const event of events) {
    await db.collection("events").add({
      ...event,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  const meritHistory = [
    { campus: "Lahore", program: "BS Computer Science", year: 2025, closing_merit: 72.4 },
    { campus: "Islamabad", program: "BS Computer Science", year: 2025, closing_merit: 74.1 },
    { campus: "Karachi", program: "BS Software Engineering", year: 2025, closing_merit: 70.8 },
    { campus: "Lahore", program: "BS Electrical Engineering", year: 2025, closing_merit: 68.5 },
    { campus: "Islamabad", program: "BBA", year: 2025, closing_merit: 65.2 },
  ];

  for (const merit of meritHistory) {
    await db.collection("merit_history").add(merit);
  }

  const faqs = [
    {
      question: "What is the minimum aggregate required for BS CS?",
      answer:
        "The closing merit varies by campus and year. Use our Merit Explorer in the Aggregate Calculator to check historical cutoffs. Generally, 70%+ is competitive for top campuses.",
      category: "student",
      author: "Admin",
      status: "published",
    },
    {
      question: "Can I apply with NAT instead of NU Test?",
      answer:
        "Yes, FAST-NUCES accepts both NU Test and NAT scores. Use the NAT calculator on our platform to compute your aggregate with NAT marks.",
      category: "university",
      author: "Admin",
      status: "published",
    },
    {
      question: "How long does resource upload review take?",
      answer:
        "Uploads are typically reviewed within 2–5 business days. You'll see your resource in the directory once approved.",
      category: "public",
      author: "Admin",
      status: "published",
    },
  ];

  for (const faq of faqs) {
    await db.collection("faqs").add({
      ...faq,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  const resources = [
    {
      title: "Data Structures Past Paper Fall 2024",
      description: "Complete past paper with solutions for CS2001.",
      type: "past_paper",
      course: "Data Structures",
      semester: 3,
      campus: "islamabad",
      department: "CS",
      file_url: "https://example.com/sample.pdf",
      downloads: 45,
      uploaded_by: "seed",
      uploader_name: "Demo User",
      status: "published",
      search_keywords: ["data structures", "ds", "cs2001"],
    },
    {
      title: "Operating Systems Notes",
      description: "Comprehensive lecture notes covering all OS topics.",
      type: "notes",
      course: "Operating Systems",
      semester: 5,
      campus: "lahore",
      department: "CS",
      file_url: "https://example.com/sample.pdf",
      downloads: 89,
      uploaded_by: "seed",
      uploader_name: "Demo User",
      status: "published",
      search_keywords: ["operating systems", "os"],
    },
  ];

  for (const resource of resources) {
    await db.collection("resources").add({
      ...resource,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  const admissionResources = [
    {
      title: "FAST Entry Test Guide 2025",
      subcategory: "guide",
      file_url: "https://example.com/admission-guide.pdf",
      downloads: 120,
      uploaded_by: "seed",
      status: "published",
    },
    {
      title: "NU Test Past Paper 2024",
      subcategory: "past_paper",
      file_url: "https://example.com/nu-test.pdf",
      downloads: 200,
      uploaded_by: "seed",
      status: "published",
    },
  ];

  for (const item of admissionResources) {
    await db.collection("admission_resources").add({
      ...item,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  const testimonials = [
    {
      quote: "FASTVault has been a game-changer for my studies.",
      name: "Sarah Ahmed",
      program: "Computer Science Student",
      campus: "Islamabad Campus",
      approved: true,
    },
  ];

  for (const t of testimonials) {
    await db.collection("testimonials").add({
      ...t,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
