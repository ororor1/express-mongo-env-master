const express = require('express');
const db = require('../db/connection');

const users = db.get('user');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const allUsers = await users.find({});
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
