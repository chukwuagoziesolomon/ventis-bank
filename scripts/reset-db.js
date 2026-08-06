const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL must be set in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

function generateTransactions(userId, accountId, balance) {
  const latestHistoryAnchor = new Date("2026-07-31T23:59:59.999Z");
  const twoYearsAgo = new Date(latestHistoryAnchor.getFullYear() - 2, latestHistoryAnchor.getMonth(), latestHistoryAnchor.getDate());
  const transactions = [];

  const fixedHistoricalTransactions = [
    {
      id: `tx_special_exchange_${userId}`,
      userId,
      type: "Currency Exchange",
      label: "DC Money Exchange",
      detail: "Exchange Service",
      amount: -6000,
      date: "2026-08-01T11:00:00.000Z",
      status: "completed",
      accountId,
      direction: "debit",
    },
    {
      id: `tx_special_project_${userId}`,
      userId,
      type: "Equipment",
      label: "Project materials from China",
      detail: "China Supplier",
      amount: -161000,
      date: "2026-07-22T09:15:00.000Z",
      status: "completed",
      accountId,
      direction: "debit",
    },
    {
      id: `tx_special_food_${userId}`,
      userId,
      type: "Food & Drink",
      label: "Food",
      detail: "Local Restaurant",
      amount: -1000,
      date: "2026-07-21T14:02:00.000Z",
      status: "completed",
      accountId,
      direction: "debit",
    },
    {
      id: `tx_special_hotel_${userId}`,
      userId,
      type: "Housing",
      label: "Hotel payment",
      detail: "Grand Hotel",
      amount: -7000,
      date: "2026-07-20T11:22:00.000Z",
      status: "completed",
      accountId,
      direction: "debit",
    },
    {
      id: `tx_special_flight_${userId}`,
      userId,
      type: "Travel",
      label: "Flight ticket",
      detail: "Airline",
      amount: -750,
      date: "2026-07-20T16:45:00.000Z",
      status: "completed",
      accountId,
      direction: "debit",
    },
    {
      id: `tx_special_supplies_${userId}`,
      userId,
      type: "Supplies",
      label: "Office supplies",
      detail: "Stationery Co.",
      amount: -245,
      date: "2026-07-19T10:30:00.000Z",
      status: "completed",
      accountId,
      direction: "debit",
    },
    {
      id: `tx_special_utilities_${userId}`,
      userId,
      type: "Utilities",
      label: "Utilities payment",
      detail: "City Energy",
      amount: -120,
      date: "2026-07-18T08:15:00.000Z",
      status: "completed",
      accountId,
      direction: "debit",
    },
  ];

  const personalCredits = [
    { label: "Payroll — Halcyon Labs", detail: "Halcyon Labs Inc.", amount: 4200 },
    { label: "Payroll — Halcyon Labs", detail: "Halcyon Labs Inc.", amount: 4350 },
    { label: "Freelance Payment", detail: "Upwork Client", amount: 1800 },
    { label: "Dividend Payment", detail: "Vanguard Brokerage", amount: 320 },
    { label: "Tax Refund", detail: "IRS", amount: 2100 },
    { label: "Payroll — Halcyon Labs", detail: "Halcyon Labs Inc.", amount: 4500 },
    { label: "Interest Payment", detail: "MidwesternBank", amount: 86.12 },
    { label: "Consulting Fee", detail: "Apex Infrastructure", amount: 7500 },
    { label: "Rental Income", detail: "Nia Studio Rentals", amount: 1200 },
    { label: "Payroll — Halcyon Labs", detail: "Halcyon Labs Inc.", amount: 4100 },
    { label: "Freelance Payment", detail: "Fiverr Client", amount: 950 },
    { label: "Bonus Payment", detail: "Halcyon Labs Inc.", amount: 2000 },
    { label: "Payroll — Halcyon Labs", detail: "Halcyon Labs Inc.", amount: 4300 },
    { label: "Investment Return", detail: "BlackRock", amount: 540 },
    { label: "Consulting Fee", detail: "Metro Infrastructure", amount: 12000 },
  ];

  const personalDebits = [
    { label: "Nia Studio Rent", detail: "Nia Studio Rentals", amount: 1850 },
    { label: "Kaya Coffee Roasters", detail: "Kaya Coffee Roasters", amount: 8.5 },
    { label: "Ondo Electric Co.", detail: "Ondo Electric Co.", amount: 142.18 },
    { label: "Savings Round-Up", detail: "Growth Savings", amount: 75 },
    { label: "Netflix Subscription", detail: "Netflix", amount: 15.99 },
    { label: "Spotify Subscription", detail: "Spotify", amount: 9.99 },
    { label: "Grocery Market", detail: "Whole Foods", amount: 156.32 },
    { label: "Gas Station", detail: "Shell", amount: 45.0 },
    { label: "Restaurant", detail: "Olive Garden", amount: 67.8 },
    { label: "Gym Membership", detail: "FitLife Gym", amount: 49.99 },
    { label: "Phone Bill", detail: "T-Mobile", amount: 85.0 },
    { label: "Internet Bill", detail: "Comcast", amount: 79.99 },
    { label: "Insurance Premium", detail: "State Farm", amount: 180.0 },
    { label: "Amazon Purchase", detail: "Amazon", amount: 234.5 },
    { label: "Pharmacy", detail: "CVS Pharmacy", amount: 42.3 },
    { label: "Car Maintenance", detail: "AutoZone", amount: 189.99 },
    { label: "Clothing", detail: "Nike Store", amount: 129.99 },
    { label: "Home Repair", detail: "Home Depot", amount: 312.45 },
    { label: "Dental Checkup", detail: "Bright Smile Dental", amount: 150.0 },
    { label: "Movie Tickets", detail: "AMC Theaters", amount: 28.0 },
  ];

  const civilEngineeringDebits = [
    { label: "Civil Engineering Tools — Total Station", detail: "SurveyTech Supplies", amount: 4200 },
    { label: "Civil Engineering Tools — Laser Level", detail: "BuildRight Tools", amount: 1850 },
    { label: "Civil Engineering Tools — Theodolite", detail: "Precision Instruments Ltd.", amount: 3100 },
    { label: "Civil Engineering Tools — Compaction Tester", detail: "SoilTest Engineering", amount: 980 },
    { label: "Site Plan Prints — Downtown Bridge", detail: "PrintWorks Drafting", amount: 320 },
    { label: "AutoCAD License Renewal", detail: "AutoDesk", amount: 285 },
    { label: "Civil Engineering Tools — Drone Survey Kit", detail: "AeroMap Tech", amount: 5200 },
    { label: "Civil Engineering Tools — Concrete Testing Kit", detail: "MatTest Solutions", amount: 1450 },
    { label: "Civil Engineering Tools — Safety Helmets & Vests", detail: "SiteSafe Supplies", amount: 620 },
    { label: "Civil Engineering Tools — Total Station Battery Pack", detail: "SurveyTech Supplies", amount: 340 },
    { label: "Civil Engineering Tools — Laser Distance Measurer", detail: "BuildRight Tools", amount: 480 },
    { label: "Civil Engineering Tools — Soil Boring Equipment", detail: "GeoDrill Pro", amount: 2100 },
    { label: "Civil Engineering Tools — GPS Rover Set", detail: "GeoPosition Systems", amount: 3800 },
    { label: "Civil Engineering Tools — Concrete Mixer", detail: "HeavyEquip Rentals", amount: 950 },
    { label: "Blueprint Printing — Large Format", detail: "PrintWorks Drafting", amount: 185 },
    { label: "Civil Engineering Tools — Rebar Cutter", detail: "SteelTools Inc.", amount: 720 },
    { label: "Site Inspection — Travel Expenses", detail: "Delta Airlines", amount: 485 },
    { label: "Civil Engineering Tools — Surveyor Vest", detail: "SiteSafe Supplies", amount: 89.99 },
    { label: "Permit Application Fee", detail: "City Building Dept", amount: 450 },
    { label: "Civil Engineering Tools — Moisture Meter", detail: "ProBuilder Tools", amount: 210 },
  ];

  const civilEngineeringCredits = [
    { label: "Consulting Fee — Structural Review", detail: "Apex Infrastructure", amount: 7500 },
    { label: "Consulting Fee — Road Alignment Design", detail: "Metro Infrastructure", amount: 12000 },
    { label: "Project Payment — Bridge Design", detail: "EngiCorp", amount: 8500 },
    { label: "Consulting Fee — Site Survey", detail: "BuildRight Construction", amount: 3200 },
    { label: "Reimbursement — Travel Expenses", detail: "Apex Infrastructure", amount: 485 },
    { label: "Project Payment — Drainage System", detail: "City Municipal", amount: 15000 },
    { label: "Consulting Fee — Foundation Analysis", detail: "GeoDrill Pro", amount: 2800 },
    { label: "Project Payment — Highway Expansion", detail: "Metro Infrastructure", amount: 22000 },
  ];

  let runningBalance = balance;
  for (const tx of fixedHistoricalTransactions) {
    transactions.push(tx);
    runningBalance += tx.amount;
  }

  const totalDays = Math.floor((latestHistoryAnchor.getTime() - twoYearsAgo.getTime()) / (1000 * 60 * 60 * 24));
  let creditIndex = 0;
  let personalDebitIndex = 0;
  let civilDebitIndex = 0;
  let civilCreditIndex = 0;

  for (let day = totalDays; day >= 0; day--) {
    const date = new Date(latestHistoryAnchor.getTime() - day * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString();

    const hasPayroll = day % 14 === 0;
    const hasPersonalPurchase = Math.random() < 0.35;
    const hasCivilPurchase = Math.random() < 0.15;
    const hasCivilIncome = Math.random() < 0.05;

    if (hasPayroll && creditIndex < personalCredits.length) {
      const tx = personalCredits[creditIndex];
      runningBalance += tx.amount;
      transactions.push({
        id: `tx_pay_${userId.slice(-4)}_${day}`,
        userId,
        type: "Income",
        label: tx.label,
        detail: tx.detail,
        amount: tx.amount,
        date: dateStr,
        status: "completed",
        accountId,
        direction: "credit",
      });
      creditIndex++;
    }

    if (hasPersonalPurchase && personalDebitIndex < personalDebits.length) {
      const tx = personalDebits[personalDebitIndex];
      if (runningBalance >= tx.amount) {
        runningBalance -= tx.amount;
        transactions.push({
          id: `tx_pur_${userId.slice(-4)}_${day}`,
          userId,
          type: tx.label.split(" — ")[0] || "Personal",
          label: tx.label,
          detail: tx.detail,
          amount: -tx.amount,
          date: dateStr,
          status: "completed",
          accountId,
          direction: "debit",
        });
      }
      personalDebitIndex++;
    }

    if (hasCivilPurchase && civilDebitIndex < civilEngineeringDebits.length) {
      const tx = civilEngineeringDebits[civilDebitIndex];
      if (runningBalance >= tx.amount) {
        runningBalance -= tx.amount;
        transactions.push({
          id: `tx_civ_${userId.slice(-4)}_${day}`,
          userId,
          type: "Equipment",
          label: tx.label,
          detail: tx.detail,
          amount: -tx.amount,
          date: dateStr,
          status: "completed",
          accountId,
          direction: "debit",
        });
      }
      civilDebitIndex++;
    }

    if (hasCivilIncome && civilCreditIndex < civilEngineeringCredits.length) {
      const tx = civilEngineeringCredits[civilCreditIndex];
      runningBalance += tx.amount;
      transactions.push({
        id: `tx_civinc_${userId.slice(-4)}_${day}`,
        userId,
        type: "Income",
        label: tx.label,
        detail: tx.detail,
        amount: tx.amount,
        date: dateStr,
        status: "completed",
        accountId,
        direction: "credit",
      });
      civilCreditIndex++;
    }
  }

  return transactions;
}

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

    const transactions = generateTransactions('u_demo', 'acc_checking', 766000);
    for (const tx of transactions) {
      await client.query(
        `INSERT INTO "Transaction" (id, "userId", type, label, detail, amount, date, status, "accountId", direction) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [tx.id, tx.userId, tx.type, tx.label, tx.detail, tx.amount, tx.date, tx.status, tx.accountId, tx.direction]
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
