const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createError = require('../../utils/appError');
const { User, Supplier } = require('../../models');
const { USER_ROLE } = require('../../config/constants');


const genToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.supplierRegister = async (req, res, next) => {
  try {
    const {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        confirmPassword,
        address,
        supplierName,
        description = null,
        profilePicture,
        lineId,
        bankName,
        bankAccount,
      } = req.body;
      if (!firstName) {
        createError('First name is required', 400);
      }
      if (!lastName) {
        createError('Last name is required', 400);
      }
      if (!email) {
        createError('Email is required', 400);
      }
      if (!password) {
        createError('Password is required', 400);
      }
      if (password !== confirmPassword) {
        createError('Password did not match', 400);
      }
      if (!address) {
        createError('Address is required', 400);
      }
      const isEmail = validator.isEmail('' + email);
      if (!isEmail) {
        createError('Email is invalid format', 400);
      }
      const isPhoneNumber = validator.isMobilePhone('' + phoneNumber, 'th-TH');
      if (!isPhoneNumber) {
        createError('PhoneNumber is invalid format', 400);
      }
      if (!supplierName) {
        createError('DisplayName is required', 400);
      }
      if (description?.length > 400) {
        createError('Description is too longer than 400', 400);
      }
      if (!lineId) {
        createError('LineId is required', 400);
      }
      if (!bankName) {
        createError('BankName is required', 400);
      }
      if (!bankAccount) {
        createError('BankAccount is required', 400);
      }
    const hashedPassword = await bcryptjs.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      address,
      role: USER_ROLE.SUPPLIER,
    });

    const supplier = await Supplier.create({
        userId: user.id,
        supplierName,
        description,
        profilePicture,
        lineId,
        bankName,
        bankAccount,
      });

    const token = genToken({ id: supplier.id });
    res.status(201).json({ token });
   
  } catch (err) {
    next(err);
  }
};