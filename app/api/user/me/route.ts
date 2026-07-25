export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

function getUserFromRequest(request: Request) {
  return request.headers.get("x-user-id");
}

export async function GET(request: Request) {
  const userId = getUserFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await pool.query('SELECT id, name, email, phone, address, "createdAt", image, role FROM "User" WHERE id = $1', [userId]);
  const user = result.rows[0];

  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const initials = (user.name || "")
    .trim()
    .split(" ")
    .map((p: string) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "VB";

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    initials,
    phone: user.phone ?? "",
    address: user.address ?? "",
    createdAt: user.createdAt,
    image: user.image ?? null,
  });
}

export async function PATCH(request: Request) {
  try {
    const userId = getUserFromRequest(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, email, phone, address } = body;

    const now = new Date().toISOString();
    await pool.query(
      'UPDATE "User" SET name = $1, email = $2, phone = $3, address = $4, "updatedAt" = $5 WHERE id = $6',
      [name, email, phone, address, now, userId]
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
