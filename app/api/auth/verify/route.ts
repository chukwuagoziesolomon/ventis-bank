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

    const result = await pool.query('SELECT id, name, email FROM "User" WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Email verified successfully." });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
