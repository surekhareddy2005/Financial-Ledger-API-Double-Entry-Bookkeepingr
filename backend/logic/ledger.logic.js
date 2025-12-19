const pool = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

async function getBalance(accountId, conn) {
  const [rows] = await conn.execute(
    `SELECT COALESCE(SUM(
      CASE WHEN entry_type = 'credit' THEN amount
           ELSE -amount END
    ), 0) AS balance
     FROM ledger_entries
     WHERE account_id = ?`,
    [accountId]
  );
  return Number(rows[0].balance);
}

async function transferMoney(fromId, toId, amount, description) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const fromBalance = await getBalance(fromId, conn);
    if (fromBalance < amount) {
      throw new Error('INSUFFICIENT_FUNDS');
    }

    const transactionId = uuidv4();

    await conn.execute(
      `INSERT INTO transactions VALUES (?,?,?,?,NOW())`,
      [transactionId, 'transfer', 'completed', description]
    );

    await conn.execute(
      `INSERT INTO ledger_entries VALUES (?,?,?,?,?,NOW())`,
      [uuidv4(), fromId, transactionId, 'debit', amount]
    );

    await conn.execute(
      `INSERT INTO ledger_entries VALUES (?,?,?,?,?,NOW())`,
      [uuidv4(), toId, transactionId, 'credit', amount]
    );

    await conn.commit();
    return { success: true, transactionId };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { transferMoney, getBalance };
