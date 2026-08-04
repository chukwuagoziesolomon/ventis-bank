import fs from "fs";
import path from "path";

const VERIFICATION_PATH = path.resolve(process.cwd(), "data", "verification.json");

interface VerificationRecord {
  userId: string;
  token: string;
  verified: boolean;
  createdAt: string;
  verifiedAt?: string;
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

export function createVerificationToken(userId: string) {
  const records = loadVerificationRecords();
  const token = `verify_${Math.random().toString(36).slice(2, 16)}`;
  const now = new Date().toISOString();
  const record: VerificationRecord = { userId, token, verified: false, createdAt: now };
  const filtered = records.filter((r) => r.userId !== userId);
  filtered.push(record);
  saveVerificationRecords(filtered);
  return token;
}

export function markEmailVerified(userId: string) {
  const records = loadVerificationRecords();
  const record = records.find((r) => r.userId === userId);
  if (!record) return false;
  record.verified = true;
  record.verifiedAt = new Date().toISOString();
  saveVerificationRecords(records);
  return true;
}

export function verifyToken(token: string) {
  const records = loadVerificationRecords();
  const record = records.find((r) => r.token === token);
  if (!record) return null;
  record.verified = true;
  record.verifiedAt = new Date().toISOString();
  saveVerificationRecords(records);
  return record.userId;
}

export function isEmailVerified(userId: string) {
  const records = loadVerificationRecords();
  const record = records.find((r) => r.userId === userId);
  return record?.verified === true;
}

export function getVerificationToken(userId: string) {
  const records = loadVerificationRecords();
  return records.find((r) => r.userId === userId)?.token;
}
