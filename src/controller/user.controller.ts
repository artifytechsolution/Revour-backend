import { NextFunction, Request, Response } from 'express';
// import { statusCode, statusMessage } from '../config/statuscode';
import DIcontainer from '../DIcontainer';
import { CustomError } from '../utils/customeerror';
import encryptPassword from '../utils/encyptpassword';
import { errorResponse, successResponse } from '../utils/responce';
import { handleYupError } from '../utils/yuperror';
import {
  LoginSchema,
  RegisterSchema,
  verifyUserSchema,
} from '../validator/userValidation';
import {
  sendForgotPasswordEmail,
  sendVerificationEmail,
} from 'src/utils/sendmail';
import prisma from 'src/config/db.config';

// import sendVerificationEmail from '../utils/sendmail';

class userController {
  private _userDIController = DIcontainer.getGetAllUsersUseCase();

  async Create(req: Request, resp: Response, next: NextFunction) {
    try {
      await RegisterSchema.validate(req.body, { abortEarly: false });
      const userInfo = req.body;
      const { password, salt } = encryptPassword.Encrypt(userInfo.password);
      const userData = await this._userDIController.createUser({
        ...userInfo,
        salt: salt,
        password: password,
      });
      if (userData instanceof CustomError) {
        return next(userData);
      }
      sendVerificationEmail(userData.email, userData.id);
      return successResponse(resp, 'user register sucessfully', userData);
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const formattedErrors = handleYupError(err);
        return errorResponse(resp, 'Validation failed', formattedErrors, 400);
      }
      return next(
        err instanceof CustomError
          ? err
          : new CustomError('An unexpected error occurred', 500),
      );
    }
  }

  async Login(req: Request, resp: Response, next: NextFunction) {
    try {
      await LoginSchema.validate(req.body, { abortEarly: false });
      const loginData = req.body;
      const LoginUser = await this._userDIController.Login(loginData);
      if (LoginUser instanceof CustomError) {
        return next(LoginUser);
      }
      return successResponse(resp, 'Login sucessfully', LoginUser);
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const formattedErrors = handleYupError(err);
        return errorResponse(resp, 'Validation failed', formattedErrors, 400);
      }
      return next(
        err instanceof CustomError
          ? err
          : new CustomError('An unexpected error occurred', 500),
      );
    }
  }

  async verifyUser(req: Request, resp: Response, next: NextFunction) {
    await verifyUserSchema.validate(req.body, { abortEarly: false });
    const { isVerified } = req.body;
    const token = req.query.token as string;
    const verifyUser = await this._userDIController.verifyUser(
      token,
      isVerified,
    );
    if (verifyUser instanceof CustomError) {
      return next(verifyUser);
    }
    return successResponse(resp, verifyUser);
  }
  async allusers(req: Request, resp: Response, next: NextFunction) {
    const user = await this._userDIController.getalluser();

    return successResponse(resp, 'user get sucessfully', user);
  }
  async Forgetpassword(req: Request, resp: Response, next: NextFunction) {
    try {
      const { password, salt } = encryptPassword.Encrypt(req.body.password);
      const userData = await this._userDIController.forgetpassword(
        {
          password: password,
          salt: salt,
        },
        req.query.token as string,
      );
      if (userData instanceof CustomError) {
        return next(userData);
      }
      sendForgotPasswordEmail(userData.email, userData.id);
      return successResponse(resp, 'password updated sucessfully', userData);
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const formattedErrors = handleYupError(err);
        return errorResponse(resp, 'Validation failed', formattedErrors, 400);
      }
      return next(
        err instanceof CustomError
          ? err
          : new CustomError('An unexpected error occurred', 500),
      );
    }
  }
  async sendMail(req: Request, resp: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        throw new CustomError('user not found', 404);
      }
      sendForgotPasswordEmail(user.email, user.id);
      return successResponse(
        resp,
        'Please check your email, I have sent you a password reset link',
        user,
      );
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const formattedErrors = handleYupError(err);
        return errorResponse(resp, 'Validation failed', formattedErrors, 400);
      }
      return next(
        err instanceof CustomError
          ? err
          : new CustomError('An unexpected error occurred', 500),
      );
    }
  }
}
export default userController;
