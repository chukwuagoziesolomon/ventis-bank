export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupportConversation } from "@/lib/support";

function getUserFromRequest(request: Request) {
  return request.headers.get("x-user-id");
}

export async function GET(request: Request) {
  const userId = getUserFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversation = getSupportConversation(userId);
  return NextResponse.json({ ok: true, conversation });
}
