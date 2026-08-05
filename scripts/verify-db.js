const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

(async () => {
  try {
    const res = await pool.query('SELECT COUNT(*) FROM "User"');
    console.log('Users count:', res.rows[0].count);
    const acc = await pool.query('SELECT COUNT(*) FROM "Account"');
    console.log('Accounts count:', acc.rows[0].count);
    const tx = await pool.query('SELECT COUNT(*) FROM "Transaction"');
    console.log('Transactions count:', tx.rows[0].count);
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
