export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { verifyLoginCode } from "@/lib/verification";
import { createSessionToken } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ ok: false, error: "Code is required." }, { status: 400 });
    }

    const userId = await verifyLoginCode(code);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Invalid or expired code." }, { status: 400 });
    }

    const result = await pool.query('SELECT id, name, email, role, image, phone, address, "createdAt" FROM "User" WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
    }

    const initials = user.name
      .trim()
      .split(" ")
      .map((p: string) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "VB";

    const token = createSessionToken(user.id);
    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        initials,
        phone: user.phone ?? "",
        address: user.address ?? "",
        createdAt: user.createdAt,
        role: user.role || "user",
        image: user.image ?? null,
      },
    });
    response.cookies.set("vantis_session", token, {
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
