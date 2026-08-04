export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { addSupportMessage, getSupportConversation } from "@/lib/support";

function getUserFromRequest(request: Request) {
  return request.headers.get("x-user-id");
}

export async function POST(request: Request) {
  try {
    const userId = getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await request.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "Message text is required." }, { status: 400 });
    }

    addSupportMessage(userId, { from: "user", text: text.trim() });
    const conversation = getSupportConversation(userId);
    return NextResponse.json({ ok: true, conversation });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
