import fs from "fs";
import path from "path";

const VERIFICATION_PATH = path.resolve(process.cwd(), "data", "verification.json");

interface VerificationRecord {
  userId: string;
  code: string;
  verified: boolean;
  createdAt: string;
  expiresAt: string;
}

function ensureVerificationFile() {
  if (!fs.existsSync(VERIFICATION_PATH)) {
    fs.writeFileSync(VERIFICATION_PATH, JSON.stringify([]));
  }
}

function loadVerificationRecords(): VerificationRecord[] {
  ensureVerificationFile();
  return JSON.parse(fs.readFileSync(VERIFICATION_PATH, "utf-8") || "[]");
}

function saveVerificationRecords(records: VerificationRecord[]) {
  ensureVerificationFile();
  fs.writeFileSync(VERIFICATION_PATH, JSON.stringify(records, null, 2));
}

export function createVerificationCode(userId: string): string {
  const records = loadVerificationRecords();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
  const record: VerificationRecord = {
    userId,
    code,
    verified: false,
    createdAt: now.toISOString(),
    expiresAt,
  };
  const filtered = records.filter((r) => r.userId !== userId);
  filtered.push(record);
  saveVerificationRecords(filtered);
  return code;
}

export function verifyCode(code: string): string | null {
  const records = loadVerificationRecords();
  const record = records.find((r) => r.code === code && !r.verified);
  if (!record) return null;
  if (new Date(record.expiresAt) < new Date()) return null;
  record.verified = true;
  saveVerificationRecords(records);
  return record.userId;
}

export function createLoginCode(userId: string): string {
  const records = loadVerificationRecords();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
  const record: VerificationRecord = {
    userId,
    code,
    verified: false,
    createdAt: now.toISOString(),
    expiresAt,
  };
  const filtered = records.filter((r) => r.userId !== userId || r.code === code);
  filtered.push(record);
  saveVerificationRecords(filtered);
  return code;
}

export function verifyLoginCode(code: string): string | null {
  const records = loadVerificationRecords();
  const record = records.find((r) => r.code === code && !r.verified);
  if (!record) return null;
  if (new Date(record.expiresAt) < new Date()) return null;
  return record.userId;
}

export function isEmailVerified(userId: string): boolean {
  const records = loadVerificationRecords();
  const record = records.find((r) => r.userId === userId);
  return record?.verified === true;
}
