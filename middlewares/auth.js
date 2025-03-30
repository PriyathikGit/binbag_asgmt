import jwt from 'jsonwebtoken';
import { User } from '../models/users.model.js';
import { ErrorResponse } from '../utils/ErrorHandler.js';

export const verifyJWT = async (req, _, next) => {
  let token;
  // 1. Check Authorization Header first (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Check Cookies if no Authorization header
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return ErrorResponse('token not valid', 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new ErrorResponse('No user found with this id', 404));
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};
