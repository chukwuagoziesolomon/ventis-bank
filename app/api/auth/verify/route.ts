export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/verification";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ ok: false, error: "Verification token is required." }, { status: 400 });
    }

    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Invalid or expired verification link." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Email verified successfully." });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
