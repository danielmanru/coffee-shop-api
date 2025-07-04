import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { tokenValidation } from '../validations/user-validation.js';
import {validate} from "../validations/validation.js"
dotenv.config();
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, VERIFY_TOKEN_SECRET } =  process.env;

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
    const authPath = "/api/v1/users"
    let verifyToken = ACCESS_TOKEN_SECRET

    if (req.path === authPath+'/refreshToken'){
      verifyToken = REFRESH_TOKEN_SECRET
    } else if(req.path === authPath+'/verifyUser') {
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
      } else if (!req.path.includes(authPath) && user.isVerified === false) {
        return res.status(401).json({
          errors : "User's email is not verified"
        })
      }
      req.user = user;
    })
    next();
  }
}
