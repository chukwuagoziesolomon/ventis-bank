import { pool } from "@/lib/db";

interface VerificationRecord {
  id: string;
  userId: string;
  code: string;
  verified: boolean;
  createdAt: string;
  expiresAt: string;
}

export function createVerificationCode(userId: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
  const id = `vc_${Math.random().toString(36).slice(2, 10)}`;

  pool.query(
    'INSERT INTO "VerificationCode" (id, "userId", code, "expiresAt", verified, "createdAt") VALUES ($1, $2, $3, $4, $5, $6)',
    [id, userId, code, expiresAt, false, now.toISOString()]
  );

  return code;
}

export async function verifyCode(code: string): Promise<string | null> {
  const result = await pool.query('SELECT "userId" FROM "VerificationCode" WHERE code = $1 AND verified = false AND "expiresAt" > $2', [code, new Date().toISOString()]);
  
  if (!result.rows[0]) {
    return null;
  }

  const userId = result.rows[0].userId;
  await pool.query('UPDATE "VerificationCode" SET verified = true WHERE code = $1', [code]);

  return userId;
}

export function createLoginCode(userId: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
  const id = `lc_${Math.random().toString(36).slice(2, 10)}`;

  pool.query(
    'INSERT INTO "VerificationCode" (id, "userId", code, "expiresAt", verified, "createdAt") VALUES ($1, $2, $3, $4, $5, $6)',
    [id, userId, code, expiresAt, false, now.toISOString()]
  );

  return code;
}

export async function verifyLoginCode(code: string): Promise<string | null> {
  const result = await pool.query('SELECT "userId" FROM "VerificationCode" WHERE code = $1 AND verified = false AND "expiresAt" > $2', [code, new Date().toISOString()]);
  
  if (!result.rows[0]) {
    return null;
  }

  const userId = result.rows[0].userId;
  await pool.query('UPDATE "VerificationCode" SET verified = true WHERE code = $1', [code]);

  return userId;
}

export async function isEmailVerified(userId: string): Promise<boolean> {
  const result = await pool.query('SELECT COUNT(*) as count FROM "VerificationCode" WHERE "userId" = $1 AND verified = true', [userId]);
  const count = parseInt(result.rows[0]?.count || "0", 10);
  return count > 0;
}
