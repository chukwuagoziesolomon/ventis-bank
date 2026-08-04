export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { verifyCode } from "@/lib/verification";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ ok: false, error: "Verification code is required." }, { status: 400 });
    }

    const userId = verifyCode(code);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Invalid or expired verification code." }, { status: 400 });
    }

    await pool.query('UPDATE "User" SET status = $1, "updatedAt" = $2 WHERE id = $3', ["approved", new Date().toISOString(), userId]);

    return NextResponse.json({ ok: true, message: "Email verified successfully." });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
