export const SITE_ACCESS_COOKIE = "fastvault-site-access";
export const SITE_ACCESS_VALUE = "granted";

export function isSitePasswordEnabled(): boolean {
  return Boolean(process.env.SITE_ACCESS_PASSWORD?.trim());
}

export function isAdminEmail(email: string): boolean {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) return false;
  return email.trim().toLowerCase() === adminEmail;
}
