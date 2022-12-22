const express = require('express');
const router = express.Router();

const supplierAuthController = require('../../controllers/supplier/supplierAuthController');

router.post('/signup', supplierAuthController.supplierRegister);
router.post('/login', supplierAuthController.supplierLogIn);


module.exports = router;