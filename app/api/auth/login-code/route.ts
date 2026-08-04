export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { createLoginCode } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ ok: false, error: "Email is required." }, { status: 400 });
    }

    const result = await pool.query('SELECT id, name FROM "User" WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return NextResponse.json({ ok: false, error: "No account found with this email." }, { status: 404 });
    }

    const code = createLoginCode(user.id);
    try {
      sendVerificationEmail(email, user.name, code);
    } catch {
      // ignore outbox errors
    }

    return NextResponse.json({ ok: true, message: "If an account exists, a login code has been sent." });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
