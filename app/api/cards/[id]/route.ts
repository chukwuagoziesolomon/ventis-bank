export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { frozen } = body;

    const result = await pool.query('SELECT * FROM "Card" WHERE id = $1 AND "userId" = $2', [params.id, userId]);
    const card = result.rows[0];
    if (!card) return NextResponse.json({ error: "Card not found." }, { status: 404 });

    await pool.query('UPDATE "Card" SET frozen = $1, "updatedAt" = $2 WHERE id = $3', [frozen, new Date().toISOString(), params.id]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await pool.query('SELECT * FROM "Card" WHERE id = $1 AND "userId" = $2', [params.id, userId]);
    const card = result.rows[0];
    if (!card) return NextResponse.json({ error: "Card not found." }, { status: 404 });

    await pool.query('DELETE FROM "Card" WHERE id = $1', [params.id]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
