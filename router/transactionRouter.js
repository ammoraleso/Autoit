const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/transactionSchema');
const logger = require('../logger/logger')(module);

const router = new express.Router();

router.get('/getTransactions', auth, async (req, res) => {
  try {
    const allTransaction = await Transaction.find({});
    res.send(allTransaction);
  } catch (error) {
    logger.error(error.message);
    res.status(401).send(error.message);
  }
});

module.exports = router;
