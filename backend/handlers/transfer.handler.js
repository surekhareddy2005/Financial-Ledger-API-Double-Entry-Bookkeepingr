const { transferMoney } = require('../logic/ledger.logic');



exports.transfer = async (req, res) => {
const { fromAccount, toAccount, amount, description } = req.body;


try {
const result = await transferMoney(
fromAccount,
toAccount,
amount,
description
);


res.status(201).json(result);
} catch (err) {
if (err.message === 'INSUFFICIENT_FUNDS') {
return res.status(422).json({ message: 'Insufficient balance' });
}


res.status(500).json({ message: 'Transfer failed' });
}
};