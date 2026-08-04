export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

function getUserFromRequest(request: Request) {
  return request.headers.get("x-user-id");
}

export async function GET(request: Request) {
  const userId = getUserFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const direction = url.searchParams.get("direction");
  const query = url.searchParams.get("q");
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
  const offset = (page - 1) * limit;

  let sql = 'SELECT * FROM "Transaction" WHERE "userId" = $1';
  const params: any[] = [userId];

  if (direction) {
    sql += ` AND direction = $${params.length + 1}`;
    params.push(direction);
  }

  sql += ' ORDER BY date DESC';

  const result = await pool.query(sql, params);
  let transactions = result.rows;

  if (query) {
    const lower = query.toLowerCase();
    transactions = transactions.filter(
      (tx: any) => tx.label.toLowerCase().includes(lower) || tx.type.toLowerCase().includes(lower)
    );
  }

  const total = transactions.length;
  const paginated = transactions.slice(offset, offset + limit);

  const mapped = paginated.map((tx: any) => ({
    id: tx.id,
    userId: tx.userId,
    title: tx.label,
    category: tx.type,
    amount: tx.amount,
    date: tx.date,
    accountId: tx.accountId,
    direction: tx.direction,
    counterparty: tx.detail,
    status: tx.status,
  }));

  return NextResponse.json({ transactions: mapped, total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: Request) {
  try {
    const userId = getUserFromRequest(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userResult = await pool.query('SELECT status, locked FROM "User" WHERE id = $1', [userId]);
    const userStatus = userResult.rows[0]?.status;
    const userLocked = userResult.rows[0]?.locked;
    if (userStatus === "blocked") {
      return NextResponse.json({ error: "Your account has been blocked due to suspicious activity.", blocked: true }, { status: 403 });
    }

    if (userLocked) {
      return NextResponse.json({ error: "Your account is locked. Please contact support.", locked: true }, { status: 403 });
    }

    const body = await request.json();
    const { title, category, amount, date, accountId, direction, counterparty } = body;

    if (!title || !amount || !direction) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const status = direction === "debit" ? "pending" : "completed";

    const id = `tx_${Math.random().toString(36).slice(2, 10)}`;
    const now = date ? new Date(date).toISOString() : new Date().toISOString();

    await pool.query('BEGIN');

    try {
      await pool.query(
        'INSERT INTO "Transaction" (id, "userId", type, label, detail, amount, date, status, "accountId", direction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [id, userId, category ?? "Transfer", title, counterparty ?? "", amount, now, status, accountId ?? null, direction]
      );

      if (accountId && direction) {
        await pool.query(
          'UPDATE "Account" SET balance = balance + $1, "updatedAt" = $2 WHERE id = $3',
          [amount, now, accountId]
        );
      }

      await pool.query('COMMIT');
    } catch (dbError) {
      await pool.query('ROLLBACK');
      throw dbError;
    }

    return NextResponse.json({ id, status }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
