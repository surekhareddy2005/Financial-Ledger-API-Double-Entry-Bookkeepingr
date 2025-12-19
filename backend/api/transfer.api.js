const express = require('express');
const router = express.Router();
const controller = require('../handlers/transfer.handler');




router.post('/', controller.transfer);


module.exports = router;