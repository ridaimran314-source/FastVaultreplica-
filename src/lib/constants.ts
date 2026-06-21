export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "FASTVault",
  tagline:
    "A comprehensive platform for FAST-NUCES students to access academic resources, campus events, and connect with student societies.",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@fastvault.example.com",
  facebookGroup:
    process.env.NEXT_PUBLIC_FACEBOOK_GROUP ||
    "https://facebook.com/groups/fastvault",
  builderName: process.env.NEXT_PUBLIC_BUILDER_NAME || "Developer",
  builderPortfolio:
    process.env.NEXT_PUBLIC_BUILDER_PORTFOLIO || "https://github.com",
  disclaimer:
    "FASTVault is an independent, student-run project and is not officially affiliated with FAST-NUCES.",
};

export const CAMPUSES = [
  { id: "islamabad", name: "Islamabad", students: "6000+", established: 2000 },
  { id: "karachi", name: "Karachi", students: "4800+", established: 1998 },
  { id: "lahore", name: "Lahore", students: "5500+", established: 2000 },
  { id: "faisalabad", name: "Faisalabad", students: "3200+", established: 2012 },
  { id: "peshawar", name: "Peshawar", students: "2800+", established: 2001 },
  { id: "multan", name: "Multan", students: "200+", established: 2025 },
] as const;

export type CampusId = (typeof CAMPUSES)[number]["id"];

export const DEPARTMENTS = ["CS", "SE", "EE", "BBA", "AI", "DS"] as const;

export const RESOURCE_TYPES = [
  { value: "past_paper", label: "Past Papers" },
  { value: "notes", label: "Notes" },
  { value: "assignment", label: "Assignments" },
  { value: "lab_manual", label: "Lab Manuals" },
  { value: "slides", label: "Slides" },
  { value: "study_guide", label: "Study Guides" },
  { value: "link", label: "Links" },
] as const;

export const ADMISSION_SUBCATEGORIES = [
  { value: "past_paper", label: "Past Papers" },
  { value: "guide", label: "Guides" },
  { value: "instructions", label: "Instructions" },
  { value: "test_material", label: "Test Material" },
] as const;

export const SOCIETY_CATEGORIES = [
  "Technical",
  "Cultural",
  "Sports",
  "Literary",
  "Entrepreneurship",
] as const;

export const FAQ_CATEGORIES = [
  { value: "student", label: "Student FAQs" },
  { value: "university", label: "University FAQs" },
  { value: "public", label: "Public Questions" },
] as const;

export const HERO_PHRASES = [
  "Your central hub for admission resources",
  "Academic resources across all campuses",
  "Connect with societies and events",
  "Built by students, for students",
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/admission", label: "Admission" },
  { href: "/societies", label: "Societies" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
];

export const FEATURE_CARDS = [
  {
    title: "Academic Resources",
    description:
      "Access past papers, course materials, study guides, and academic resources shared by students across all campuses.",
    href: "/resources",
    icon: "BookOpen",
  },
  {
    title: "Admission Resources",
    description:
      "Find admission test materials, past papers, and guidance for FAST-NUCES admission process.",
    href: "/admission",
    icon: "GraduationCap",
  },
  {
    title: "Aggregate Calculator",
    description:
      "Calculate your admission test scores and aggregate for FAST-NUCES with our comprehensive calculator tool.",
    href: "/admission/calculator",
    icon: "Calculator",
  },
  {
    title: "Student Societies",
    description:
      "Discover and connect with various student societies, clubs, and organizations across all campuses.",
    href: "/societies",
    icon: "Users",
  },
  {
    title: "Campus Events",
    description:
      "Stay updated with events, workshops, competitions, and activities happening across all campuses.",
    href: "/events",
    icon: "Calendar",
  },
  {
    title: "Resource Sharing",
    description:
      "Share and discover academic resources, study materials, and helpful links from all FAST-NUCES campuses.",
    href: "/resources/upload",
    icon: "Share2",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "FASTVault has been a game-changer for my studies. The past papers and study materials helped me ace my exams. The community is incredibly supportive!",
    name: "Sarah Ahmed",
    program: "Computer Science Student",
    campus: "Islamabad Campus",
  },
  {
    quote:
      "I found all the admission resources I needed in one place. The aggregate calculator was especially helpful during my admission process. Highly recommended!",
    name: "Ahmed Hassan",
    program: "Software Engineering Student",
    campus: "Karachi Campus",
  },
  {
    quote:
      "The academic resources and society information helped me connect with like-minded students. FASTVault made my university experience so much better.",
    name: "Fatima Khan",
    program: "Data Science Student",
    campus: "Lahore Campus",
  },
  {
    quote:
      "As a new student, FASTVault helped me navigate campus life. The event updates and resource sharing features are fantastic. Great platform!",
    name: "Muhammad Ali",
    program: "Computer Science Student",
    campus: "Faisalabad Campus",
  },
  {
    quote:
      "The study materials and past papers saved me countless hours. The platform is well-organized and easy to use. Thank you FASTVault!",
    name: "Ayesha Malik",
    program: "AI Student",
    campus: "Islamabad Campus",
  },
  {
    quote:
      "Even though our campus is new, FASTVault provides access to resources from all campuses. It's like having a complete university library online!",
    name: "Hassan Raza",
    program: "Computer Science Student",
    campus: "Multan Campus",
  },
];
