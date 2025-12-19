const express = require('express');
const app = express();


app.use(express.json());


app.use('/accounts', require('./api/account.api'));
app.use('/transfers', require('./api/transfer.api'));



module.exports = app;