const express = require('express');

const db = require('../db/connection');

const employees = db.get('employees');

const router = express.Router();

router.get('/', async (req, res) => {
  const allEmployees = await employees.find({});
  res.render('employees/list', {
    data: allEmployees,
  });
});
module.exports = router;
