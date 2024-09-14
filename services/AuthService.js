const { response } = require("express");
const User = require("../models/User");
const PasswordResetToken = require("../models/RestPassword");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const HttpStatus = require("../utils/ResponseStatus");
const { forgotPasswordMail } = require("../utils/EmailService");
const BASE_URL = process.env.BASE_URL;
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
  if (userData.login_type === "social") {

    return { message: "Account Created Successfully ", status: 201, data: newUser };
  }

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
    image: user.image ? `${BASE_URL}upload${user.image}` : ""
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
    return {
      status: HttpStatus.FORBIDDEN, message: `${user.name}, your account is blocked.`
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

  let resetUrl = `${process.env.WEBSITE_URL}/reset-password?user_id=${user.id}&token=${resetToken}`;
  const mailOptions = {
    from: process.env.TRANSPORTER_USER,
    to: user.email,
    subject: "HoopSquad - Password Reset",
    html: ` <body
    style="
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 50px auto;
        background-color: #ffffff;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      "
    >
      <div style="text-align: center; padding: 10px 0">
        <h1 style="color: #ffa500; font-size: 28px; margin: 0">HoopSquad</h1>
        <img
          src="https://backend.basketball.mayonity.com/upload/LOGO.png"
          alt="HoopSquad Logo"
          style="max-width: 150px; margin: 20px 0"
        />
      </div>

      <div style="text-align: center; padding: 10px 0">
        <h2 style="color: #333333; font-size: 24px; margin: 0">
          Reset Your Password
        </h2>
        <p
          style="
            font-size: 16px;
            color: #666666;
            line-height: 1.5;
            margin: 20px 0;
          "
        >
          Hello, it looks like you requested a password reset. No worries, we've
          got you covered!
        </p>
        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            background-color: #ffa500;
            color: white;
            padding: 15px 25px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            margin: 20px 0;
          "
          >Reset Password</a
        >
        <p
          style="
            font-size: 16px;
            color: #666666;
            line-height: 1.5;
            margin: 20px 0;
          "
        >
          If you did not request a password reset, please ignore this email or
          contact our support team at HoopSquad for assistance.
        </p>
        <p style="font-size: 14px; color: #999999; margin: 20px 0">
          Thanks for being a part of the HoopSquad community!
        </p>
      </div>
    </div>
  </body>`,
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

const changePassword = async (body) => {
  const { id, password, old_password, confirm_password } = body;

   if (!password) {
    return { status: HttpStatus.BAD_REQUEST, message: "Password is required" };
  }

   if (password !== confirm_password) {
    return { status: HttpStatus.BAD_REQUEST, message: "Passwords do not match" };
  }

   const user = await User.findOne({ where: { id } });
  if (!user) {
    return { status: HttpStatus.NOT_FOUND, message: "User not found" };
  }

   const isMatch = await bcrypt.compare(old_password, user.password);
  if (!isMatch) {
    return { status: HttpStatus.BAD_REQUEST, message: "Old password is incorrect" };
  }

   const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  
  const passwordUpdated = await user.save();
  const passwordUpdatedObject = passwordUpdated.get({ plain: true });
  delete passwordUpdatedObject.password;

   return { status: HttpStatus.OK, message: "Password updated successfully", user: passwordUpdatedObject };
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

const socialMediaLogin = async (body) => {
  const response = await register(body)
  const req = { body }
  if (response.status === 409 || response?.status === 201) {
    const user = await User.findOne({ where: { email: req.body.email } });

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
    return userForToken
  }


}


module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  validateToken,
  socialMediaLogin,
  changePassword
};
