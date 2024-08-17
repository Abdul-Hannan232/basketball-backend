const { response } = require("express");
const User = require("../models/User");
const PasswordResetToken = require("../models/RestPassword");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const HttpStatus = require("../utils/ResponseStatus");
const { forgotPasswordMail } = require("../utils/EmailService");

require("dotenv").config(); // Load environment variables from .env file

const register = async (userData) => {
  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(userData.email)) {
    return { status: HttpStatus.BAD_REQUEST, message: "Invalid email format" };
  }

  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) {
    return { status: HttpStatus.CONFLICT, message: "Email already exists" };
  }

  // Check if password is provided and matches confirmation
  if (!userData.password) {
    return { status: HttpStatus.BAD_REQUEST, message: "Password is required" };
  }
  if (userData.password !== userData.confirm_password) {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: "Passwords do not match",
    };
  }

  // Hash user password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Create user record in database
  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
  });

  return newUser;
};

const login = async (req) => {
  const { email, password } = req.body;
  const user = await checkUserRedirection(req);
  if (user.status) {
    return user;
  }
  const passwordIsValid = await bcrypt.compare(password, user.password);

  let userForToken = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userForToken, process.env.SECRETKEY, {
    expiresIn: process.env.EXPIRETIME,
  });
  userForToken.token = token;

  // Return the updated userForToken object
  return userForToken;
};

const checkUserRedirection = async (req) => {
  let { email, password = "" } = req.body;

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email)) {
    return { status: HttpStatus.BAD_REQUEST, message: "Invalid Email Format" };
  }

  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return { status: HttpStatus.NOT_FOUND, message: "User Not Found" };
  }

  if (password != "") {
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return { status: HttpStatus.UNAUTHORIZED, message: "Invalid Password" };
    }
  }

  if (!user.isactive) {
    return { status: HttpStatus.FORBIDDEN, message: `${user.name}, your account is blocked.`
  };
  }

  return user;
};

const forgotPassword = async (req) => {
  const user = await checkUserRedirection(req);
  const resetToken = crypto.randomBytes(20).toString("hex");
  const tokenExpiry = Date.now() + 3600000; // 1 hour

  // Find or create a reset token
  if (user.message) {
    return user;
  }
  const [resetTokenRecord, created] = await PasswordResetToken.findOrCreate({
    where: { userId: user.id },
    defaults: {
      token: resetToken,
      expiresAt: tokenExpiry,
    },
  });

  if (!created) {
    // If the record already exists, update it
    resetTokenRecord.token = resetToken;
    resetTokenRecord.expiresAt = tokenExpiry;
  }

  let resetUrl = `${process.env.WEBSITE_URL}/resetPassword?user_id=${user.id}&token=${resetToken}`;
  const mailOptions = {
    from: process.env.TRANSPORTER_USER,
    to: user.email,
    subject: "Password Reset",
    html: `<p>To reset your password, please click the button below:</p>
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Reset Password</a><p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
          `,
  };

  const emailSent = await forgotPasswordMail(mailOptions);

  return { message: emailSent, resetTokenRecord, created };
};

const resetPassword = async (body) => {
  // Find the password reset token record
  const { token, password, confirm_password } = body;
  const resetTokenRecord = await PasswordResetToken.findOne({
    where: {
      token: token,
      // expiresAt: {
      //   [Op.gt]: new Date(), // Checks if the token has not expired
      // },
    },
  });

  if (!resetTokenRecord) {
    return {
      status: HttpStatus.UNAUTHORIZED,
      message: "invalid or expired password reset token",
    };
  }

  if (!password) {
    return { status: HttpStatus.BAD_REQUEST, message: "Password is required" };
  }

  if (password != confirm_password) {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: "Password does not  match",
    };
  }
  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the user's password
  const user = await User.findOne({ where: { id: resetTokenRecord.userId } });
  if (!user) {
    throw new Error("user not found");
  }

  user.password = hashedPassword;
  await user.save();

  const passwordUpdated = await resetTokenRecord.destroy();
  return passwordUpdated;
};

const validateToken = async (body) => {

  const { token } = body;

  if (!token) {
    return { status: 400, message: 'Token is required' };
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    // Optionally, check if the user still exists in your database
    return { status: 200, message: 'Token is valid' };
  } catch (error) {
    return { status: 401, message: 'Invalid or expired token' };
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  validateToken
};
