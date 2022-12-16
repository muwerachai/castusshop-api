const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createError = require('../../utils/appError');
const { Admin } = require('../../models');

const genToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.adminRegister = async (req, res, next) => {
  try {
    const { employeeId, password, confirmPassword, role } = req.body;
    if (!password) {
      createError('Password is required', 400);
    }
    if (password !== confirmPassword) {
      createError('Password did not match', 400);
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    const admin = await Admin.create({
      employeeId,
      password: hashedPassword,
      role,
    });

    const token = genToken({ id: admin.id });
    res.status(201).json({ token });
   
  } catch (err) {
    next(err);
  }
};