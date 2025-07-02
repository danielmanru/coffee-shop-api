import dotenv from 'dotenv';
dotenv.config();
import {validate} from "../validation/validation.js"
import {
  changePasswordValidation,
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  resetPasswordValidation,
  updateUserValidation,
  forgetPasswordValidation,
} from "../validation/user-validation.js"
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getEmailHtml, sendEmail } from '../lib/mailer.js';
import User from "../model/user.model.js";

const { ACCESS_TOKEN_SECRET, VERIFY_TOKEN_SECRET, REFRESH_TOKEN_SECRET, API_URI } = process.env;

const register = async(request) => {
  const user = validate(registerUserValidation, request);
  const countUser =  await User.countDocuments({ email: user.email });

  if(countUser === 1){
    throw new ResponseError(400, "Email already registered");
  }

  user.password = await bcrypt.hash(user.password, 10);

  await sendVerificationEmail(user.email)

  const userCreated = await User.create(user);
  return User.findById(userCreated._id).select('name email');
};

const sendVerificationEmail =  async (userEmail) => {
  const verificationToken = await jwt.sign({ email: userEmail}, VERIFY_TOKEN_SECRET, { expiresIn : "1d" });
  const verificationLink = `${API_URI}/users/verifyUser?token=${verificationToken}`
  const emailTemplate = await getEmailHtml('verification-email.ejs', { link : verificationLink})

  sendEmail(userEmail, 'Verify your email', emailTemplate)
}

const verifyUser = async (request) => {
  const { email } = request.user;
  const user = await User.findOneAndUpdate(
    { email: email },
    { $set: { isVerified: true } },
    { new: true }
  ).select('email isVerified');


  if (!user) {
    throw new ResponseError(404, 'User is not found!');
  }

  if (user.isVerified === "TRUE") {
    throw new ResponseError(400, 'Your email has been verified.');
  }

  return user;
}

const generateAccessToken = (payload, expireTime) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn : expireTime });
}

const refreshToken = async (request) => {
  const accessToken = generateAccessToken({
    email : request.email,
    role : request.role,
  }, "1d");

  return accessToken
}

const login = async(request) => {
  const loginRequest = validate(loginUserValidation, request);
  const user = await User.findOne({ email: loginRequest.email })
    .select('email password role');

  if (!user){
    throw new ResponseError(401, "email or password is wrong");
  };

  const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
  if(!isPasswordValid){
    throw new ResponseError(401, "email or password is wrong");
  }

  const payload = {
    email : user.email,
    role : user.role,
  };

  const accessToken = generateAccessToken(payload, "1d")
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn : "7d" })

  await User.findByIdAndUpdate(
    user._id,
    { $set: { refreshToken: refreshToken } },
  );

  return {
    accesToken : accessToken,
    refreshToken : refreshToken,
  }
};

const getUser = async (email) => {
  email = validate((getUserValidation), email);

  const user = await User.findOne({ email: email })
    .select('email name phone location');

  if (!user){
    throw new ResponseError(404, "user is not found");
  };

  return user;
};

const updateUserDetail = async (request) => {
  const updateRequest = validate(updateUserValidation, request.body);
  const searchUser = await User.findOneAndUpdate(
    {email : request.user.email},
    { $set: updateRequest },
    { new :true }
  ).select('name email phone location');

  if(!searchUser){
    throw new ResponseError(404, "User is not found");
  };

  return searchUser;
};

const forgetPassword = async (request) => {
  const forgetPasswordRequest = validate(forgetPasswordValidation, request);
  const user = await User.findOne({ email: forgetPasswordRequest.email })
    .select('email');

  if (!user) {
    throw new ResponseError(400, 'User is not found!')
  };

  const resetPasswordToken = generateAccessToken({ email : user.email }, "600s")
  const resetPasswordLink = `${API_URI}/users/resetPassword?token=${resetPasswordToken}`;
  const emailTemplate = await getEmailHtml('reset-password.ejs', {
    name : user.name,
    link : resetPasswordLink
  });

  sendEmail(user.email, "Reset Your Password", emailTemplate);

  return {
    status : "PENDING",
    message : "A reset password link is being sent to your email!"
  }
};

const resetPassword = async (request) => {
  const resetPasswordRequest = validate(resetPasswordValidation, request.body);

  const user = await User.findOne({ email: request.user.email })
    .select('email');

  if (!user) {
    throw new ResponseError(404, 'User is not found!');
  };

  if(resetPasswordRequest.newPassword !== resetPasswordRequest.confirmNewPassword){
    throw new ResponseError(401, "New password and confirm password is different!");
  };

  const newPassword = await bcrypt.hash(resetPasswordRequest.newPassword, 10);

  return User.findByIdAndUpdate(
    user._id,
    { $set: { password : newPassword } },
    { new :true }
  ).select('email');
};

const changePassword = async (request) => {
  const changePasswordRequest = validate(changePasswordValidation, request.body);
  const user =  await User.findOne({ email: request.user.email })
    .select('email password role');

  if(!user){
    throw new ResponseError(404, "User is not found");
  };

  if (changePasswordRequest.currentPassword && changePasswordRequest.newPassword) {
    const isPasswordValid = await bcrypt.compare(changePasswordRequest.currentPassword, user.password);
    if(!isPasswordValid){
      throw new ResponseError(401, "password is wrong");
    };
  };

  const newPassword = await bcrypt.hash(changePasswordRequest.newPassword, 10);

  const payload = {
    email : user.email,
    role : user.role
  };

  const newRefreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn : "7d" })

  return User.findByIdAndUpdate(
    user._id,
    { $set: {
      password : newPassword,
      refreshToken : newRefreshToken } },
    { new: true }
  ).select('refreshToken');
};

const logout = async (request) => {
  const user = await User.findByIdAndUpdate(
    user._id,
    { $set: { refreshToken : "" } },
  )

  if(!user){
    throw new ResponseError(404, "User is not found");
  };

  return null;
};

export default{
  register,
  login,
  getUser,
  updateUserDetail,
  changePassword,
  refreshToken,
  verifyUser,
  forgetPassword,
  resetPassword,
  sendVerificationEmail,
  logout,
}