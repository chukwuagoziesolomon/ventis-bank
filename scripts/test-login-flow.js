require('dotenv').config();


const BASE = 'http://localhost:3000';

async function run() {
  const email = `testuser_${Date.now()}@example.com`;
  const name = 'Test User';
  const password = 'password123';

  console.log('Signing up:', email);
  let res = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  console.log('signup status', res.status);
  let data = await res.json().catch(() => null);
  console.log('signup body', data);

  // fetch admin users to find our user id
  res = await fetch(`${BASE}/api/admin/users`);
  const adminList = await res.json();
  const found = adminList.users.find((u) => u.email === email);
  if (!found) {
    console.error('User not found in admin list. Aborting.');
    return;
  }
  console.log('Found user id', found.id);

  // approve user
  res = await fetch(`${BASE}/api/admin/users/${found.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'approved', balance: 1000 }),
  });
  console.log('approve status', res.status);
  data = await res.json().catch(() => null);
  console.log('approve body', data);

  // now attempt login which should send code
  res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  console.log('login status', res.status);
  data = await res.json().catch(() => null);
  console.log('login body', data);
}

run().catch((err)=>{ console.error(err); process.exit(1); });
