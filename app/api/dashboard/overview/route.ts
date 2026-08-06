export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

function getUserFromRequest(request: Request) {
  return request.headers.get("x-user-id");
}

export async function GET(request: Request) {
  const userId = getUserFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [userResult, accountsResult, cardsResult, transactionsResult] = await Promise.all([
    pool.query('SELECT id, name, email, phone, address, "createdAt", image, role FROM "User" WHERE id = $1', [userId]),
    pool.query('SELECT * FROM "Account" WHERE "userId" = $1 ORDER BY "createdAt"', [userId]),
    pool.query('SELECT * FROM "Card" WHERE "userId" = $1 ORDER BY "createdAt"', [userId]),
    pool.query('SELECT * FROM "Transaction" WHERE "userId" = $1 AND date <= $2 ORDER BY date DESC LIMIT 100', [userId, '2026-08-01T11:00:00.000Z']),
  ]);

  const user = userResult.rows[0];
  const accounts = accountsResult.rows;
  const cards = cardsResult.rows;
  const recentTransactions = transactionsResult.rows.map((tx: any) => ({
    id: tx.id,
    title: tx.label,
    category: tx.type,
    amount: tx.amount,
    date: tx.date,
    accountId: tx.accountId,
    direction: tx.direction,
    counterparty: tx.detail,
    status: tx.status,
  }));

  const fixedPriority = [
    `tx_special_exchange_${user.id}`,
    `tx_special_project_${user.id}`,
    `tx_special_food_${user.id}`,
    `tx_special_hotel_${user.id}`,
    `tx_special_flight_${user.id}`,
    `tx_special_supplies_${user.id}`,
    `tx_special_utilities_${user.id}`,
  ];

  recentTransactions.sort((a, b) => {
    const aIndex = fixedPriority.indexOf(a.id);
    const bIndex = fixedPriority.indexOf(b.id);
    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const initials = (user.name || "")
    .trim()
    .split(" ")
    .map((p: string) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "VB";

  const weeklySpend = await computeWeeklySpend(userId);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      initials,
      phone: user.phone ?? "",
      address: user.address ?? "",
      createdAt: user.createdAt,
      image: user.image ?? null,
    },
    accounts,
    cards,
    recentTransactions,
    weeklySpend,
  });
}

async function computeWeeklySpend(userId: string) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const result: { label: string; value: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();

    const txResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM "Transaction" WHERE "userId" = $1 AND date >= $2 AND date < $3 AND direction = $4',
      [userId, start, end, "debit"]
    );

    result.push({ label: days[d.getDay()], value: Math.abs(txResult.rows[0]?.total ?? 0) });
  }

  return result;
}
