export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

function getUserFromRequest(request: Request) {
  const userId = request.headers.get("x-user-id");
  if (!userId) return null;
  return userId;
}

export async function GET(request: Request) {
  const userId = getUserFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await pool.query('SELECT * FROM "Account" WHERE "userId" = $1 ORDER BY "createdAt"', [userId]);
  return NextResponse.json({ accounts: result.rows });
}

export async function POST(request: Request) {
  try {
    const userId = getUserFromRequest(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, number, balance, currency, type, apy } = body;

    if (!name || !number) {
      return NextResponse.json({ error: "Name and number are required." }, { status: 400 });
    }

    const id = `acc_${Math.random().toString(36).slice(2, 10)}`;
    const now = new Date().toISOString();
    await pool.query(
      'INSERT INTO "Account" (id, "userId", name, number, balance, currency, type, apy, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [id, userId, name, number, balance ?? 0, currency ?? "USD", type ?? "checking", apy ?? null, now, now]
    );

    return NextResponse.json({ id, name, number, balance, currency, type, apy }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
