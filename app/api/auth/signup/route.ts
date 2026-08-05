export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { generateAccountNumber } from "@/lib/utils";
import { createVerificationCode } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name?.trim() || !email?.includes("@") || !password) {
      return NextResponse.json({ ok: false, error: "Please fill in all fields." }, { status: 400 });
    }

    const existing = await pool.query('SELECT id FROM "User" WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ ok: false, error: "An account with this email already exists." }, { status: 409 });
    }

    const userId = `u_${Math.random().toString(36).slice(2, 10)}`;
    const accountId = `acc_${Math.random().toString(36).slice(2, 10)}`;
    const now = new Date().toISOString();

    await pool.query('BEGIN');

    try {
      await pool.query(
        'INSERT INTO "User" (id, email, name, password, status, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [userId, email, name.trim(), password, "pending", now, now]
      );

      await pool.query(
        'INSERT INTO "Account" (id, "userId", name, number, balance, currency, type, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [accountId, userId, "Primary Checking", generateAccountNumber(), 766000, "USD", "checking", now, now]
      );

      await pool.query('COMMIT');
    } catch (dbError) {
      await pool.query('ROLLBACK');
      console.error("Signup DB error:", dbError);
      return NextResponse.json({ ok: false, error: `Database error: ${dbError instanceof Error ? dbError.message : "Unknown error"}` }, { status: 500 });
    }

    const verificationCode = createVerificationCode(userId);
    try {
      await sendVerificationEmail(email, name.trim(), verificationCode);
    } catch (emailError) {
      console.error("Signup email error:", emailError);
    }

    return NextResponse.json({ ok: true, pending: true, message: "Account created. Pending approval.", verificationSent: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ ok: false, error: `Something went wrong: ${error instanceof Error ? error.message : "Unknown error"}` }, { status: 500 });
  }
}
