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
    const initialBalance = balance ?? 766000;
    await pool.query(
      'INSERT INTO "Account" (id, "userId", name, number, balance, currency, type, apy, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [id, userId, name, number, initialBalance, currency ?? "USD", type ?? "checking", apy ?? null, now, now]
    );

    const fixedTransactions = [
      {
        id: `tx_special_project_${userId}`,
        userId,
        type: "Equipment",
        label: "Project materials from China",
        detail: "China Supplier",
        amount: -161000,
        date: "2026-07-22T09:15:00.000Z",
        status: "completed",
        accountId: id,
        direction: "debit",
      },
      {
        id: `tx_special_food_${userId}`,
        userId,
        type: "Food & Drink",
        label: "Food",
        detail: "Local Restaurant",
        amount: -1000,
        date: "2026-07-21T14:02:00.000Z",
        status: "completed",
        accountId: id,
        direction: "debit",
      },
      {
        id: `tx_special_hotel_${userId}`,
        userId,
        type: "Housing",
        label: "Hotel payment",
        detail: "Grand Hotel",
        amount: -7000,
        date: "2026-07-20T11:22:00.000Z",
        status: "completed",
        accountId: id,
        direction: "debit",
      },
      {
        id: `tx_special_flight_${userId}`,
        userId,
        type: "Travel",
        label: "Flight ticket",
        detail: "Airline",
        amount: -750,
        date: "2026-07-20T16:45:00.000Z",
        status: "completed",
        accountId: id,
        direction: "debit",
      },
    ];

    for (const tx of fixedTransactions) {
      await pool.query(
        'INSERT INTO "Transaction" (id, "userId", type, label, detail, amount, date, status, "accountId", direction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [tx.id, tx.userId, tx.type, tx.label, tx.detail, tx.amount, tx.date, tx.status, tx.accountId, tx.direction]
      );
    }

    return NextResponse.json({ id, name, number, balance: initialBalance, currency, type, apy }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
