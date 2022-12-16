const express = require('express');
const router = express.Router();

const adminAuthController = require('../../controllers/admin/adminAuthController');

router.post('/signup', adminAuthController.adminRegister);

module.exports = router;