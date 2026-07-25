export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { generateCardNumber } from "@/lib/utils";

function getUserFromRequest(request: Request) {
  return request.headers.get("x-user-id");
}

export async function GET(request: Request) {
  const userId = getUserFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await pool.query('SELECT * FROM "Card" WHERE "userId" = $1 ORDER BY "createdAt"', [userId]);
  return NextResponse.json({ cards: result.rows });
}

export async function POST(request: Request) {
  try {
    const userId = getUserFromRequest(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { label, type, network, limit, color, accountId, holder } = body;

    if (!label || !type || !network || !accountId) {
      return NextResponse.json({ error: "Missing required fields: label, type, network, and accountId are required." }, { status: 400 });
    }

    let cardHolder = holder;
    if (!cardHolder && userId) {
      const userResult = await pool.query('SELECT name FROM "User" WHERE id = $1', [userId]);
      cardHolder = userResult.rows[0]?.name ?? "You";
    }

    const id = `card_${Math.random().toString(36).slice(2, 10)}`;
    const now = new Date().toISOString();
    const last4 = generateCardNumber();
    const expiry = "12/30";

    await pool.query(
      'INSERT INTO "Card" (id, "userId", label, holder, last4, expiry, type, network, frozen, "limit", spent, color, "accountId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
      [id, userId, label, cardHolder, last4, expiry, type, network, false, limit ?? 1000, 0, color ?? "gold", accountId, now, now]
    );

    return NextResponse.json({ id, label, holder: cardHolder, last4, expiry, type, network, frozen: false, limit: limit ?? 1000, spent: 0, color: color ?? "gold", accountId }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
