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


exports.adminLogIn = async (req, res, next) => {
  try {
    const { employeeId, password } = req.body;
    const admin = await Admin.findOne({
      where: { employeeId },
    });

    if (!admin) {
      createError('Invalid credential', 400);
    }

    const isMatch = await bcryptjs.compare(password, admin.password);
    if (!isMatch) {
      createError('Invalid credential', 400);
    }

    const token = genToken({ adminId: admin.id, role: admin.role });
    res.json({
      message: 'Admin signed in successfully',
      token,
    });
  } catch (err) {
    next(err);
  }
};