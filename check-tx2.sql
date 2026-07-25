SELECT count(*) FROM "Transaction" WHERE "userId" = 'u_demo';
SELECT id, label, amount, direction, date FROM "Transaction" WHERE "userId" = 'u_demo' ORDER BY date DESC LIMIT 5;
