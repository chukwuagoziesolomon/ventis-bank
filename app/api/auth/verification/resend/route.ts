export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { createVerificationCode } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ ok: false, error: "Email is required." }, { status: 400 });
    }

    const userResult = await pool.query('SELECT id, name FROM "User" WHERE email = $1', [email]);
    const user = userResult.rows[0];
    if (!user) {
      // don't leak existence — respond ok
      return NextResponse.json({ ok: true, message: "If an account exists, a verification code was sent." });
    }

    const code = await createVerificationCode(user.id);
    try {
      await sendVerificationEmail(email, user.name, code);
    } catch (err) {
      console.error('Resend verification error:', err);
      return NextResponse.json({ ok: false, error: 'Failed to send verification code.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: 'Verification code sent.' });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 500 });
  }
}
