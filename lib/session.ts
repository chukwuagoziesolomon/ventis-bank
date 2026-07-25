export interface Session {
  userId: string;
  email: string;
  name: string;
}

export function getSessionCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|; )vantis_session=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function setSessionCookie(token: string): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `vantis_session=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Strict`;
}

export function clearSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = "vantis_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict";
}
