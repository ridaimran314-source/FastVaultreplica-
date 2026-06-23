export type UserRole = "student" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photo?: string;
  campus: string;
  role: UserRole;
  created_at: Date;
}

export type ResourceType =
  | "mid1"
  | "mid2"
  | "final"
  | "past_paper"
  | "notes"
  | "assignment"
  | "lab_manual"
  | "slides"
  | "study_guide"
  | "quiz"
  | "link";

export type ResourceStatus = "pending" | "published" | "rejected";

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  course: string;
  semester: number;
  campus: string;
  department?: string;
  file_url: string;
  downloads: number;
  uploaded_by: string;
  uploader_name?: string;
  status: ResourceStatus;
  search_keywords?: string[];
  created_at: Date;
}

export type AdmissionSubcategory =
  | "past_paper"
  | "guide"
  | "instructions"
  | "test_material";

export interface AdmissionResource {
  id: string;
  title: string;
  description?: string;
  subcategory: AdmissionSubcategory;
  file_url: string;
  downloads: number;
  uploaded_by: string;
  status: ResourceStatus;
  created_at: Date;
}

export type FaqCategory = "student" | "university" | "public";
export type FaqStatus = "pending" | "published";

export interface Faq {
  id: string;
  question: string;
  answer: string | null;
  category: FaqCategory;
  author: string;
  author_email?: string;
  status: FaqStatus;
  answered_by?: string;
  answered_at?: Date;
  created_at: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  venue: string;
  campus: string;
  poster?: string;
  organizer: string;
  registration_url?: string;
  created_at: Date;
}

export interface Society {
  id: string;
  name: string;
  description: string;
  campus: string;
  category?: string;
  logo?: string;
  members: number;
  social_links: Record<string, string>;
  created_at: Date;
}

export interface Bookmark {
  id: string;
  user_id: string;
  resource_id: string;
  type: "resource" | "event";
  created_at: Date;
}

export interface MeritHistory {
  id: string;
  campus: string;
  program: string;
  year: number;
  closing_merit: number;
}

export interface StatsSummary {
  totalFiles: number;
  totalResources: number;
  admissionItems: number;
  campusEvents: number;
  societies: number;
  registeredUsers: number;
}

export type ProgramType = "computing" | "engineering";
export type TestType = "nu_test" | "nat" | "sat";
