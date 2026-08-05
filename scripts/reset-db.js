const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL must be set in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function reset() {
  const client = await pool.connect();
  try {
    console.log('Dropping existing tables (if any)...');
    await client.query('BEGIN');
    await client.query('DROP TABLE IF EXISTS "Transaction" CASCADE');
    await client.query('DROP TABLE IF EXISTS "Account" CASCADE');
    await client.query('DROP TABLE IF EXISTS "User" CASCADE');

    console.log('Creating tables...');
    await client.query(`
      CREATE TABLE "User" (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        password TEXT,
        status TEXT DEFAULT 'pending',
        role TEXT DEFAULT 'user',
        locked BOOLEAN DEFAULT FALSE,
        image TEXT,
        phone TEXT,
        address TEXT,
        "createdAt" TIMESTAMPTZ DEFAULT now(),
        "updatedAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    await client.query(`
      CREATE TABLE "Account" (
        id TEXT PRIMARY KEY,
        "userId" TEXT REFERENCES "User"(id) ON DELETE CASCADE,
        name TEXT,
        number TEXT,
        balance NUMERIC DEFAULT 0,
        currency TEXT,
        type TEXT,
        apy NUMERIC,
        "createdAt" TIMESTAMPTZ DEFAULT now(),
        "updatedAt" TIMESTAMPTZ DEFAULT now()
      )
    `);

    await client.query(`
      CREATE TABLE "Transaction" (
        id TEXT PRIMARY KEY,
        "userId" TEXT REFERENCES "User"(id) ON DELETE CASCADE,
        type TEXT,
        label TEXT,
        detail TEXT,
        amount NUMERIC,
        date TIMESTAMPTZ,
        status TEXT,
        "accountId" TEXT REFERENCES "Account"(id) ON DELETE CASCADE,
        direction TEXT
      )
    `);

    console.log('Seeding demo user and accounts...');
    // Seed demo user
    await client.query(
      `INSERT INTO "User" (id, email, name, password, status, role, locked, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      ['u_demo', 'demo@vantis.bank', 'Amara Okafor', 'demo', 'approved', 'user', false, '2023-02-11T10:00:00.000Z', '2023-02-11T10:00:00.000Z']
    );

    // Seed accounts
    await client.query(
      `INSERT INTO "Account" (id, "userId", name, number, balance, currency, type, apy, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      ['acc_checking', 'u_demo', 'Everyday Checking', '4821093157', 766000, 'USD', 'checking', null, '2023-02-11T10:00:00.000Z', '2023-02-11T10:00:00.000Z']
    );

    await client.query(
      `INSERT INTO "Account" (id, "userId", name, number, balance, currency, type, apy, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      ['acc_savings', 'u_demo', 'Growth Savings', '7734215608', 24310.9, 'USD', 'savings', 4.25, '2023-02-11T10:00:00.000Z', '2023-02-11T10:00:00.000Z']
    );

    // Seed a few transactions
    const txs = [
      ['tx_1', 'u_demo', 'Equipment', 'Project materials from China', 'China Supplier', -161000, '2026-07-22T09:15:00.000Z', 'completed', 'acc_checking', 'debit'],
      ['tx_2', 'u_demo', 'Food & Drink', 'Food', 'Local Restaurant', -1000, '2026-07-21T14:02:00.000Z', 'completed', 'acc_checking', 'debit'],
      ['tx_11', 'u_demo', 'Transfer', 'To Femi Balogun', 'Femi Balogun', -300, '2026-07-10T17:47:00.000Z', 'pending', 'acc_checking', 'debit'],
    ];

    for (const t of txs) {
      await client.query(
        `INSERT INTO "Transaction" (id, "userId", type, label, detail, amount, date, status, "accountId", direction) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        t
      );
    }

    await client.query('COMMIT');
    console.log('Database reset and seeded successfully.');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Error resetting DB:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

reset();
