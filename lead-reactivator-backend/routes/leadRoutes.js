const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  deleteLead,
} = require('../controllers/leadController');

// Lead collection routes
router.route('/')
  .post(createLead)
  .get(getLeads);

// Single lead routes
router.route('/:id')
  .get(getLeadById)
  .delete(deleteLead);

module.exports = router;
