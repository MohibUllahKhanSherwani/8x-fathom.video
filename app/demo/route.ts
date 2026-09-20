import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, generateSessionId } from "@/lib/session";

export async function GET(request: NextRequest) {
  const url = new URL("/home", request.url);
  const response = NextResponse.redirect(url);

  // Check if session already exists
  const existingSession = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const sessionId = existingSession || generateSessionId();

  // Set httpOnly cookie, 30 days
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return response;
}
