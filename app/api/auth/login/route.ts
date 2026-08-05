export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { createLoginCode } from "@/lib/verification";
import { sendLoginCodeEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Enter email and password." }, { status: 400 });
    }

    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    if (user.status === "pending") {
      return NextResponse.json(
        { ok: false, error: "Your account is pending approval. Please wait for admin review.", pending: true },
        { status: 403 }
      );
    }

    if (user.status === "rejected") {
      return NextResponse.json({ ok: false, error: "Your account was rejected." }, { status: 403 });
    }

    if (user.status === "blocked") {
      return NextResponse.json({ ok: false, error: "Your account has been blocked due to suspicious activity.", blocked: true }, { status: 403 });
    }

    if (user.email !== "demo@vantis.bank" && user.password !== password) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    const code = await createLoginCode(user.id);
    try {
      await sendLoginCodeEmail(email, user.name, code);
    } catch (emailError) {
      console.error("Login email error:", emailError);
      return NextResponse.json({ ok: false, error: "Failed to send login code." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pendingCode: true, message: "Login code sent to your email." });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
