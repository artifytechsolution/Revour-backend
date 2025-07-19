import { Response } from 'express';
//import { statusCode } from 'src/config/statuscode';

interface ErrorDetail {
  code?: string;
  message: string;
  field?: string;
}

interface SuccessResponse {
  status: string;
  message: string;
  data: any;
  errors: [];
}

interface ErrorResponse {
  status: 'error';
  message: string;
  data: null;
  errors: ErrorDetail[];
}

const successResponse = (
  res: Response,
  message: string,
  data: any = {},
): void => {
  const response: SuccessResponse = {
    status: 'success',
    message: message,
    data: data,
    errors: [],
  };
  res.status(200).json(response);
};

const errorResponse = (
  res: Response,
  message: string,
  errors: any,
  statusCode: number = 400,
): void => {
  const response: ErrorResponse = {
    status: 'error',
    message: message,
    data: null,
    errors: errors,
  };
  res.status(statusCode).json(response);
};

export { successResponse, errorResponse };
