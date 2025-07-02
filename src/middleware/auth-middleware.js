import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { tokenValidation } from '../validation/user-validation.js';
import {validate} from "../validation/validation.js"
dotenv.config();

export const authMiddleware = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    let token = req.headers['authorization']?.split(' ')[1] || req.query.token;

    if (token == null) {
      return res.status(401).json({
        errors : 'Unauthorized'
      });
    }

    token =  validate(tokenValidation, token)

    let verifyToken = process.env.ACCESS_TOKEN_SECRET
    if (req.path === '/api/users/refreshToken'){
      verifyToken = process.env.REFRESH_TOKEN_SECRET
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
      } else if (req.path != '/api/users/verifyUser' && user.isVerified === false) {
        return res.status(401).json({
          errors : "User's email is not verified"
        })
      }
      req.user = user;
    })
    next();
  }
}
