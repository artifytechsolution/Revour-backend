import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/responce';
import { CustomError } from '../utils/customeerror';

import UserRequest from '../domain/entity/userRequest';
import { User } from '../domain/entity/user';

function verifyToken(req: UserRequest, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.split(' ')[1];

  console.log('Token received:', token);

  if (!token) {
    return errorResponse(
      res,
      'Your session has expired! Please log in again.',
      'Token is not found',
      401,
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as User;

    req.user = decoded;

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return errorResponse(
        res,
        'Invalid or expired token. Please log in again.',
        'Authentication error',
        401,
      );
    }
    return next(
      err instanceof CustomError
        ? err
        : new CustomError('An unexpected error occurred', 500),
    );
  }
}

export default verifyToken;
