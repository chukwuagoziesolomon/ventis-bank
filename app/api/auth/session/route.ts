export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

const SESSION_SECRET = process.env.SESSION_SECRET || "vantis-session-secret-change-in-production";

function createSessionToken(userId: string): string {
  const data = `${userId}:${Date.now()}:${Math.random()}`;
  return Buffer.from(`${data}:${Buffer.from(data).toString("base64")}`).toString("base64");
}

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionToken = cookieHeader.split(";").find(c => c.trim().startsWith("vantis_session="))?.split("=")[1];

    if (!sessionToken) {
      return NextResponse.json({ user: null });
    }

    try {
      const decoded = Buffer.from(decodeURIComponent(sessionToken), "base64").toString("utf-8");
      const [userId] = decoded.split(":");

      if (!userId) {
        return NextResponse.json({ user: null });
      }

      const result = await pool.query('SELECT id, name, email, role FROM "User" WHERE id = $1', [userId]);
      const user = result.rows[0];

      if (!user) {
        return NextResponse.json({ user: null });
      }

      const initials = user.name
        .trim()
        .split(" ")
        .map((p: string) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "VB";

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          initials,
          phone: "",
          address: "",
          createdAt: new Date().toISOString(),
          role: user.role || "user",
        },
      });
    } catch {
      return NextResponse.json({ user: null });
    }
  } catch {
    return NextResponse.json({ user: null });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const result = await pool.query('SELECT id, name, email FROM "User" WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = createSessionToken(userId);
    const response = NextResponse.json({ ok: true });
    response.cookies.set("vantis_session", token, {
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("vantis_session", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  return response;
}
