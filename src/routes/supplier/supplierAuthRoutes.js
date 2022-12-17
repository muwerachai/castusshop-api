const express = require('express');
const router = express.Router();

const supplierAuthController = require('../../controllers/supplier/supplierAuthController');

router.post('/signup', supplierAuthController.supplierRegister);

module.exports = router;