const pool = require('../database/connection');
const { v4: uuidv4 } = require('uuid');
const { getBalance } = require('../logic/ledger.logic');

// CREATE ACCOUNT
exports.createAccount = async (req, res) => {
  const { user_name, account_type, currency } = req.body;

  const id = uuidv4();

  await pool.execute(
    `INSERT INTO accounts VALUES (?,?,?,?, 'active', NOW())`,
    [id, user_name, account_type, currency]
  );

  res.status(201).json({ accountId: id });
};

// GET ACCOUNT + BALANCE
exports.getAccount = async (req, res) => {
  const { accountId } = req.params;

  const [rows] = await pool.execute(
    `SELECT * FROM accounts WHERE id = ?`,
    [accountId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Account not found' });
  }

  const balance = await getBalance(accountId, pool);

  res.json({ ...rows[0], balance });
};
