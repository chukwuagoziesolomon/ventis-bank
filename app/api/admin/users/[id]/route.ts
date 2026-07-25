export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { generateAccountNumber } from "@/lib/utils";

function generateTransactions(userId: string, accountId: string, balance: number) {
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
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

  const personalCredits = [
    { label: "Payroll — Halcyon Labs", detail: "Halcyon Labs Inc.", amount: 4200 },
    { label: "Payroll — Halcyon Labs", detail: "Halcyon Labs Inc.", amount: 4350 },
    { label: "Freelance Payment", detail: "Upwork Client", amount: 1800 },
    { label: "Dividend Payment", detail: "Vanguard Brokerage", amount: 320 },
    { label: "Tax Refund", detail: "IRS", amount: 2100 },
    { label: "Payroll — Halcyon Labs", detail: "Halcyon Labs Inc.", amount: 4500 },
    { label: "Interest Payment", detail: "Vantis Bank", amount: 86.12 },
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
  const totalDays = Math.floor((now.getTime() - twoYearsAgo.getTime()) / (1000 * 60 * 60 * 24));
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
    const { status, balance } = await request.json();

    if (!["approved", "rejected", "blocked"].includes(status)) {
      return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
    }

    const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [params.id]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
    }

    const now = new Date().toISOString();

    if (status === "approved") {
      await pool.query('UPDATE "User" SET status = $1, "updatedAt" = $2 WHERE id = $3', [
        "approved",
        now,
        params.id,
      ]);

      const accountResult = await pool.query('SELECT id FROM "Account" WHERE "userId" = $1', [params.id]);
      if (accountResult.rows.length === 0) {
        const accountId = `acc_${Math.random().toString(36).slice(2, 10)}`;
        await pool.query(
          'INSERT INTO "Account" (id, "userId", name, number, balance, currency, type, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [accountId, params.id, "Primary Checking", generateAccountNumber(), balance ?? 0, "USD", "checking", now, now]
        );

        const openingBalance = balance ?? 0;
        if (openingBalance > 0) {
          const txId1 = `tx_${Math.random().toString(36).slice(2, 10)}`;
          await pool.query(
            'INSERT INTO "Transaction" (id, "userId", type, label, detail, amount, date, status, "accountId", direction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [txId1, params.id, "Income", "Welcome Bonus", "Vantis Bank", openingBalance, now, "completed", accountId, "credit"]
          );

          const txId2 = `tx_${Math.random().toString(36).slice(2, 10)}`;
          await pool.query(
            'INSERT INTO "Transaction" (id, "userId", type, label, detail, amount, date, status, "accountId", direction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [txId2, params.id, "Housing", "Account Opening Fee", "Vantis Bank", -50, now, "completed", accountId, "debit"]
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
          await pool.query('UPDATE "Account" SET balance = $1, "updatedAt" = $2 WHERE "userId" = $3', [balance, now, params.id]);

          const txId = `tx_${Math.random().toString(36).slice(2, 10)}`;
          await pool.query(
            'INSERT INTO "Transaction" (id, "userId", type, label, detail, amount, date, status, "accountId", direction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [txId, params.id, "Income", "Account Funding", "Admin", balance, now, "completed", accountId, "credit"]
          );

          const generatedTransactions = generateTransactions(params.id, accountId, balance);
          for (const tx of generatedTransactions) {
            await pool.query(
              'INSERT INTO "Transaction" (id, "userId", type, label, detail, amount, date, status, "accountId", direction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
              [tx.id, tx.userId, tx.type, tx.label, tx.detail, tx.amount, tx.date, tx.status, tx.accountId, tx.direction]
            );
          }
        }
      }
    } else if (status === "blocked") {
      await pool.query('UPDATE "User" SET status = $1, "updatedAt" = $2 WHERE id = $3', [
        "blocked",
        now,
        params.id,
      ]);
    } else {
      await pool.query('UPDATE "User" SET status = $1, "updatedAt" = $2 WHERE id = $3', [
        "rejected",
        now,
        params.id,
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
