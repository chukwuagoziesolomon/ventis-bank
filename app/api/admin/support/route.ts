export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSupportConversations, addSupportMessage } from "@/lib/support";
import { sendSupportReplyEmail } from "@/lib/email";

export async function GET() {
  try {
    const conversations = getSupportConversations();
    const userIds = Array.from(new Set(conversations.map((conversation) => conversation.userId)));
    const usersResult = userIds.length
      ? await pool.query('SELECT id, name, email FROM "User" WHERE id = ANY($1::text[])', [userIds])
      : { rows: [] };
    const userMap = new Map(usersResult.rows.map((row: any) => [row.id, row]));

    const enriched = conversations.map((conversation) => ({
      ...conversation,
      name: userMap.get(conversation.userId)?.name ?? "Unknown user",
      email: userMap.get(conversation.userId)?.email ?? "unknown@vantis.bank",
    }));

    return NextResponse.json({ ok: true, conversations: enriched });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, text } = await request.json();
    if (!userId || !text?.trim()) {
      return NextResponse.json({ error: "User ID and reply text are required." }, { status: 400 });
    }

    const userResult = await pool.query('SELECT name, email FROM "User" WHERE id = $1', [userId]);
    const user = userResult.rows[0];
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    addSupportMessage(userId, { from: "admin", text: text.trim() });
    try {
      await sendSupportReplyEmail(user.email, user.name, text.trim());
    } catch {
      // ignore outbox failures for demo support notifications
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
