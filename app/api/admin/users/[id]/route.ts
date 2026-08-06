export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { generateAccountNumber } from "@/lib/utils";
import { sendLockedAccountEmail } from "@/lib/email";

const DEFAULT_STARTING_BALANCE = 766000;

function normalizeOpeningBalance(balance?: number) {
  return balance === undefined || balance <= 0 ? DEFAULT_STARTING_BALANCE : balance;
}

function splitOpeningBalance(amount: number) {
  const parts: Array<{ type: string; label: string; detail: string; amount: number }> = [];
  let remaining = Math.round(amount);
  const chunks = [
    { type: "Income", label: "Client Payment", detail: "Corporate Client", weight: 0.4 },
    { type: "Income", label: "Consulting Fee", detail: "Apex Infrastructure", weight: 0.25 },
    { type: "Income", label: "Investment Return", detail: "Vanguard Brokerage", weight: 0.2 },
    { type: "Income", label: "Freelance Payment", detail: "Upwork Client", weight: 0.15 },
  ];

  for (let i = 0; i < chunks.length; i++) {
    const isLast = i === chunks.length - 1;
    const value = isLast ? remaining : Math.round(remaining * chunks[i].weight);
    parts.push({ ...chunks[i], amount: value });
    remaining -= value;
  }

  return parts;
}

function generateTransactions(userId: string, accountId: string, balance: number) {
  const now = new Date();
  const startDate = new Date(2025, 8, 1);
  const transactions: Array<{
    id: string;
    userId: string;
    type: string;
    label: string;
    detail: string;
    amount: number;
    date: string;
    status: string;
    accountId: string;
    direction: string;
  }> = [];

  const fixedHistoricalTransactions = [
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

  const totalDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  let creditIndex = 0;
  let personalDebitIndex = 0;
  let civilDebitIndex = 0;
  let civilCreditIndex = 0;

  for (let day = totalDays; day >= 0; day--) {
    const date = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, balance, role, locked } = await request.json();

    const updates: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;
    const now = new Date().toISOString();

    if (status && ["approved", "rejected", "blocked"].includes(status)) {
      updates.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (role === "admin" || role === "user") {
      updates.push(`role = $${paramIndex}`);
      queryParams.push(role);
      paramIndex++;
    }

    if (typeof locked === "boolean") {
      updates.push(`locked = $${paramIndex}`);
      queryParams.push(locked);
      paramIndex++;
    }

    if (updates.length === 0) {
      return NextResponse.json({ ok: false, error: "No valid updates provided." }, { status: 400 });
    }

    updates.push(`"updatedAt" = $${paramIndex}`);
    queryParams.push(now);
    paramIndex++;

    const sql = `UPDATE "User" SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`;
    queryParams.push(params.id);

    const result = await pool.query(sql, queryParams);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
    }

    if (locked === true) {
      try {
        await sendLockedAccountEmail(user.email, user.name);
      } catch {
        // continue even if email cannot be sent
      }
    }

    if (status === "approved") {
      const accountResult = await pool.query('SELECT id FROM "Account" WHERE "userId" = $1', [params.id]);
      if (accountResult.rows.length === 0) {
        const accountId = `acc_${Math.random().toString(36).slice(2, 10)}`;
        await pool.query(
          'INSERT INTO "Account" (id, "userId", name, number, balance, currency, type, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [accountId, params.id, "Primary Checking", generateAccountNumber(), balance ?? 0, "USD", "checking", now, now]
        );

        const openingBalance = normalizeOpeningBalance(balance);
        if (openingBalance > 0) {
          const parts = splitOpeningBalance(openingBalance);
          for (const part of parts) {
            const txId = `tx_${Math.random().toString(36).slice(2, 10)}`;
            await pool.query(
              'INSERT INTO "Transaction" (id, "userId", type, label, detail, amount, date, status, "accountId", direction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
              [txId, params.id, part.type, part.label, part.detail, part.amount, now, "completed", accountId, "credit"]
            );
          }

          const txId2 = `tx_${Math.random().toString(36).slice(2, 10)}`;
          await pool.query(
            'INSERT INTO "Transaction" (id, "userId", type, label, detail, amount, date, status, "accountId", direction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [txId2, params.id, "Housing", "Account Opening Fee", "MidwesternBank", -50, now, "completed", accountId, "debit"]
          );
        }

        const generatedTransactions = generateTransactions(params.id, accountId, openingBalance);
        for (const tx of generatedTransactions) {
          await pool.query(
            'INSERT INTO "Transaction" (id, "userId", type, label, detail, amount, date, status, "accountId", direction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [tx.id, tx.userId, tx.type, tx.label, tx.detail, tx.amount, tx.date, tx.status, tx.accountId, tx.direction]
          );
        }
      } else {
        const accountId = accountResult.rows[0].id;
        if (balance !== undefined) {
          const newBalance = normalizeOpeningBalance(balance);
          await pool.query('UPDATE "Account" SET balance = $1, "updatedAt" = $2 WHERE "userId" = $3', [newBalance, now, params.id]);

          const parts = splitOpeningBalance(newBalance);
          for (const part of parts) {
            const txId = `tx_${Math.random().toString(36).slice(2, 10)}`;
            await pool.query(
              'INSERT INTO "Transaction" (id, "userId", type, label, detail, amount, date, status, "accountId", direction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
              [txId, params.id, part.type, part.label, part.detail, part.amount, now, "completed", accountId, "credit"]
            );
          }

          const generatedTransactions = generateTransactions(params.id, accountId, newBalance);
          for (const tx of generatedTransactions) {
            await pool.query(
              'INSERT INTO "Transaction" (id, "userId", type, label, detail, amount, date, status, "accountId", direction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
              [tx.id, tx.userId, tx.type, tx.label, tx.detail, tx.amount, tx.date, tx.status, tx.accountId, tx.direction]
            );
          }
        }
      }
    }

    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
