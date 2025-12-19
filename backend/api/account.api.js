const express = require('express');
const router = express.Router();
const controller = require('../handlers/account.handler');


router.post('/', controller.createAccount);
router.get('/:accountId', controller.getAccount);


module.exports = router;