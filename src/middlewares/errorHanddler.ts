import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customeerror';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      errorCode: err.errorCode,
      timestamp: err.timestamp,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
};
