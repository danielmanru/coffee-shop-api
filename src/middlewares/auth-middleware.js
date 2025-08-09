import jwt from 'jsonwebtoken'
import { tokenValidation } from '../validations/user-validation.js';
import {validate} from "../validations/validation.js"
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, VERIFY_TOKEN_SECRET } =  process.env;
import userRouter from "../routes/user-api.js";
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.query.token;

    if (token == null) {
      return res.status(401).json({
        errors : 'Unauthorized'
      });
    }

    validate(tokenValidation, token)
    const userPaths = userRouter.stack
      .map(layer => layer.route?.path)
      .filter(Boolean);
    let verifyToken = ACCESS_TOKEN_SECRET

    if (req.path === '/refreshToken'){
      verifyToken = REFRESH_TOKEN_SECRET
    } else if(req.path === '/verifyUser') {
      verifyToken = VERIFY_TOKEN_SECRET
    }

    jwt.verify(token, verifyToken, (err, user) =>{
      if (err){
        return res.status(403).json({
          errors : err
        })
      } else if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(401).json({
          errors : 'Unauthorized'
        })
      } else if (!userPaths.includes(req.path) && user.isVerified === false) {
        return res.status(401).json({
          errors : "User's email is not verified"
        })
      } else if (req.baseUrl.includes("/orders") && req.path === '/update/status') {
        if (user.role === 'customer' && req.query.orderStatus !== "cancelled"){
          return res.status(401).json({
            errors : "Unauthorized"
          })
        } else if(user.role === 'staff' && req.query.orderStatus === "pending" || req.query.orderStatus === "completed"){
          return res.status(401).json({
            errors : "Unauthorized"
          })
        }
      } else if(req.baseUrl.includes("/payment") && req.path === '/update/status') {
        if(user.role === 'customer' && req.query.paymentStatus !== "cancelled"){
          return res.status(401).json({
            errors : "Unauthorized"
          })
        }
      }
      req.user = user;
      next();
    })
  }
}
