import type {
  AdmissionResource,
  Event,
  Faq,
  MeritHistory,
  Resource,
  Society,
  UserProfile,
} from "@/lib/types";

export function mapUser(row: Record<string, unknown>): UserProfile {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    photo: row.photo as string | undefined,
    campus: row.campus as string,
    role: row.role as UserProfile["role"],
    created_at: new Date(row.created_at as string),
  };
}

export function mapResource(row: Record<string, unknown>): Resource {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? "",
    type: row.type as Resource["type"],
    course: row.course as string,
    semester: row.semester as number,
    campus: row.campus as string,
    department: row.department as string | undefined,
    file_url: row.file_url as string,
    downloads: (row.downloads as number) ?? 0,
    uploaded_by: row.uploaded_by as string,
    uploader_name: row.uploader_name as string | undefined,
    status: row.status as Resource["status"],
    search_keywords: row.search_keywords as string[] | undefined,
    created_at: new Date(row.created_at as string),
  };
}

export function mapAdmissionResource(
  row: Record<string, unknown>
): AdmissionResource {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string | undefined,
    subcategory: row.subcategory as AdmissionResource["subcategory"],
    file_url: row.file_url as string,
    downloads: (row.downloads as number) ?? 0,
    uploaded_by: row.uploaded_by as string,
    status: row.status as AdmissionResource["status"],
    created_at: new Date(row.created_at as string),
  };
}

export function mapEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    date: new Date(row.date as string),
    venue: row.venue as string,
    campus: row.campus as string,
    poster: row.poster as string | undefined,
    organizer: row.organizer as string,
    registration_url: row.registration_url as string | undefined,
    created_at: new Date(row.created_at as string),
  };
}

export function mapSociety(row: Record<string, unknown>): Society {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    campus: row.campus as string,
    category: row.category as string | undefined,
    logo: row.logo as string | undefined,
    members: (row.members as number) ?? 0,
    social_links: (row.social_links as Record<string, string>) ?? {},
    created_at: new Date(row.created_at as string),
  };
}

export function mapFaq(row: Record<string, unknown>): Faq {
  return {
    id: row.id as string,
    question: row.question as string,
    answer: row.answer as string | null,
    category: row.category as Faq["category"],
    author: row.author as string,
    author_email: row.author_email as string | undefined,
    status: row.status as Faq["status"],
    answered_by: row.answered_by as string | undefined,
    answered_at: row.answered_at
      ? new Date(row.answered_at as string)
      : undefined,
    created_at: new Date(row.created_at as string),
  };
}

export function mapMerit(row: Record<string, unknown>): MeritHistory {
  return {
    id: row.id as string,
    campus: row.campus as string,
    program: row.program as string,
    year: row.year as number,
    closing_merit: Number(row.closing_merit),
  };
}
