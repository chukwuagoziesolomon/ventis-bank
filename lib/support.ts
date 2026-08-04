import fs from "fs";
import path from "path";
import { SupportConversation } from "./types";

const SUPPORT_PATH = path.resolve(process.cwd(), "data", "support.json");

function ensureSupportFile() {
  if (!fs.existsSync(SUPPORT_PATH)) {
    fs.writeFileSync(SUPPORT_PATH, JSON.stringify([]));
  }
}

export function getSupportConversations(): SupportConversation[] {
  ensureSupportFile();
  return JSON.parse(fs.readFileSync(SUPPORT_PATH, "utf-8"));
}

export function saveSupportConversations(conversations: SupportConversation[]) {
  ensureSupportFile();
  fs.writeFileSync(SUPPORT_PATH, JSON.stringify(conversations, null, 2));
}

export function addSupportMessage(userId: string, message: { from: "user" | "admin"; text: string; }) {
  const conversations = getSupportConversations();
  const now = new Date().toISOString();
  const conversation = conversations.find((c) => c.userId === userId);
  const msg = {
    id: `msg_${Math.random().toString(36).slice(2, 10)}`,
    userId,
    from: message.from,
    text: message.text,
    date: now,
  };
  if (conversation) {
    conversation.messages.push(msg);
    conversation.updatedAt = now;
  } else {
    conversations.push({ userId, messages: [msg], updatedAt: now });
  }
  saveSupportConversations(conversations);
  return msg;
}

export function getSupportConversation(userId: string) {
  const conversations = getSupportConversations();
  return conversations.find((c) => c.userId === userId) ?? { userId, messages: [], updatedAt: new Date().toISOString() };
}
