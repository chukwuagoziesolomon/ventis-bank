const { Pool } = require('pg');
require('dotenv').config();

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  try {
    const res = await pool.query('SELECT id, label, type, amount, date, status, direction FROM "Transaction" WHERE "userId" = $1 ORDER BY date DESC', ['u_demo']);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();