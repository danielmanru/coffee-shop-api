import dotenv from 'dotenv';
dotenv.config();
import {validate} from "../validations/validation.js"
import {
  changePasswordValidation,
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  resetPasswordValidation,
  updateUserValidation,
  forgetPasswordValidation,
} from "../validations/user-validation.js"
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getEmailHtml, sendEmail } from '../utils/mailer.js';
import User from "../models/user.model.js";
import cartService from "./cart-service.js";
import Outlet from "../models/outlet.model.js";

const { ACCESS_TOKEN_SECRET, VERIFY_TOKEN_SECRET, REFRESH_TOKEN_SECRET, API_URI } = process.env;

const register = async(request) => {
  const user = validate(registerUserValidation, request.body);
  let outlet;
  if(user.role === 'staff') {
    if (!request.query.outletId) {
      throw new ResponseError(400, "outletId is required")
    }
    outlet = await Outlet.findById(request.query.outletId);
  }
  const countUser =  await User.countDocuments({ email: user.email });

  if(countUser === 1){
    throw new ResponseError(409, "Email already registered");
  }

  user.password = await bcrypt.hash(user.password, 10);

  await sendVerificationEmail(user.email)


  const userCreated = await User.create(user);
  await cartService.initializeNewCart(userCreated._id)
  if(user.role === 'staff') {
    outlet.staff.push({
      staffId: userCreated._id,
      isActive: true
    })
    await outlet.save();
  }

  return User.findById(userCreated._id).select('name email');
};

const login = async(request) => {
  const loginRequest = validate(loginUserValidation, request);
  const user = await User.findOne({ email: loginRequest.email });

  if (!user){
    throw new ResponseError(401, "Email or password is wrong");
  };

  const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
  if(!isPasswordValid){
    throw new ResponseError(401, "Email or password is wrong");
  }

  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };
  const accessToken = generateAccessToken(payload, "1d")
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn : "7d" })

  const userLoginDoc = await User.findByIdAndUpdate(
    user._id,
    { $set: { refreshToken: refreshToken } },
  {new: true}
  ).select("refreshToken");

  const userLogin = userLoginDoc.toObject()
  userLogin.accessToken = accessToken;

  return userLogin
};

const updateUserDetail = async (request, userEmail) => {
  const updateRequest = validate(updateUserValidation, request);
  const searchUser = await User.findOneAndUpdate(
    {email : userEmail},
    { $set: updateRequest },
    { new :true }
  ).select('-password -createdAt -updatedAt -refreshToken -__v');

  if(!searchUser){
    throw new ResponseError(404, "User is not found");
  };

  return searchUser;
};

const sendVerificationEmail =  async (userEmail) => {
  const verificationToken = await jwt.sign({ email: userEmail}, VERIFY_TOKEN_SECRET, { expiresIn : "1d" });
  const verificationLink = `${API_URI}/users/verifyUser?token=${verificationToken}`
  const emailTemplate = await getEmailHtml('verification-email.ejs', { link : verificationLink})

  sendEmail(userEmail, 'Verify your email', emailTemplate)
}

const verifyUser = async (request) => {
  const { email } = request.user;
  const user = await User.findOne({email: email});
  if (!user) {
    throw new ResponseError(404, 'User is not found!');
  }

  if (user.isVerified === true) {
    throw new ResponseError(400, 'Your email has been verified.');
  }
  user.isVerified = true;
  await user.save();

  return null;
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

const getUser = async (email) => {
  email = validate((getUserValidation), email);

  const user = await User.findOne({ email: email })
    .select('-password -createdAt -updatedAt -__v -refreshToken');

  if (!user){
    throw new ResponseError(404, "user is not found");
  };

  return user;
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
    throw new ResponseError(400, "New password and confirm password is different!");
  };

  const newPassword = await bcrypt.hash(resetPasswordRequest.newPassword, 10);
  await User.findByIdAndUpdate(
    user._id,
    { $set: { password : newPassword } }
  );

  return null
};

const changePassword = async (request) => {
  const changePasswordRequest = validate(changePasswordValidation, request.body);
  const user =  await User.findOne({ email: request.user.email })
    .select('email password role isVerified');

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
    role : user.role,
    isVerified: user.isVerified
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
  const user = await User.findOneAndUpdate(
    {email : request.email},
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