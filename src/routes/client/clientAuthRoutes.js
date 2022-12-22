const express = require('express');
const router = express.Router();

const clientAuthController = require('../../controllers/client/clientAuthController');

router.post('/signup', clientAuthController.clientRegister);
router.post('/login', clientAuthController.clientLogIn);


module.exports = router;