import { NextFunction, Request, Response } from 'express';
// import { statusCode, statusMessage } from '../config/statuscode';
import DIcontainer from '../DIcontainer';
import { CustomError } from '../utils/customeerror';
import { errorResponse, successResponse } from '../utils/responce';
import { handleYupError } from '../utils/yuperror';

class ExperienceController {
  private _experienceDIcontroller = DIcontainer.getGetAllExperienceUseCase();

  async create(req: Request, resp: Response, next: NextFunction) {
    try {
      const hotel = await this._experienceDIcontroller.create(req.body);
      console.log(hotel instanceof CustomError);
      if (hotel instanceof CustomError) {
        return next(hotel);
      }
      return successResponse(resp, 'service created successfully', hotel);
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        return errorResponse(resp, 'Validation failed', 400);
      }
      return next(
        err instanceof CustomError
          ? err
          : new CustomError('An unexpected error occurred', 500),
      );
    }
  }

  async findById(req: Request, resp: Response, next: NextFunction) {
    try {
      const Id: string | undefined = req.params.id;
      const Hotel = await this._experienceDIcontroller.findById(Id);
      if (Hotel instanceof CustomError) {
        return next(Hotel);
      }
      return successResponse(resp, 'hotel successfully', Hotel);
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
  async find(req: Request, resp: Response, next: NextFunction) {
    try {
      const Hotel = await this._experienceDIcontroller.find();
      if (Hotel instanceof CustomError) {
        return next(Hotel);
      }
      return successResponse(resp, 'get experience successfully', Hotel);
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
  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      const hotelDelete: any = await this._experienceDIcontroller.delete(
        req.body.ids,
      );
      if (hotelDelete instanceof CustomError) {
        return next(hotelDelete);
      }
      console.log('final data os comming');
      return successResponse(resp, 'hotel deleted successfully', hotelDelete);
    } catch (err: any) {
      console.log(err.message);
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

  // async update(req: Request, resp: Response, next: NextFunction) {
  //   try {
  //     const hotelupadte: any = await this._experienceDIcontroller.update(
  //       req.body,
  //       req.params.id,
  //     );
  //     if (hotelupadte instanceof CustomError) {
  //       return next(hotelupadte);
  //     }
  //     return successResponse(hotelupadte, 'hotel deleted successfully');
  //   } catch (err: any) {
  //     if (err.name === 'ValidationError') {
  //       const formattedErrors = handleYupError(err);
  //       return errorResponse(resp, 'Validation failed', formattedErrors, 400);
  //     }
  //     return next(
  //       err instanceof CustomError
  //         ? err
  //         : new CustomError('An unexpected error occurred', 500),
  //     );
  //   }
  // }
}
export default ExperienceController;
