import { cookies } from "next/headers";
export { SESSION_COOKIE_NAME, DEMO_USER } from "./constants";
import { SESSION_COOKIE_NAME } from "./constants";

export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  return sessionCookie ? sessionCookie.value : null;
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}
