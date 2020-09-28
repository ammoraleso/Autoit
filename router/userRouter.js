const express = require('express');
const User = require('../models/userSchema');
const Transaction = require('../models/transactionSchema');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const logger = require('../logger/logger')(module);

const router = new express.Router();

router.post('/addUser', async (req, res) => {
  try {
    const userToSave = await User.generateUserToSave(req.body);
    const user = new User(userToSave);
    await user.save();
    const transaction = new Transaction({ transaction: '/addUser' });
    await transaction.save();
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    logger.error(e.message);
    res.status(400).send(e.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    const transaction = new Transaction({ transaction: '/login' });
    await transaction.save();
    res.send({
      user: {
        name: user.name,
        email: user.email,
        password: user.password,
        gender: user.gender,
        location: user.location,
        birthday: user.birthday,
      },
      token: token,
    });
  } catch (e) {
    logger.error(e.message);
    res.status(400).send(e.message);
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    const transaction = new Transaction({ transaction: '/logout' });
    await transaction.save();
    res.send();
  } catch (e) {
    logger.error(e.message);
    res.status(500).send();
  }
});

router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    const transaction = new Transaction({ transaction: '/logoutAll' });
    await transaction.save();
    res.send();
  } catch (e) {
    logger.error(e.message);
    res.status(500).send();
  }
});

module.exports = router;
