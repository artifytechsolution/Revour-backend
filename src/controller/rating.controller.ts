import { NextFunction, Request, Response } from 'express';
// import { statusCode, statusMessage } from '../config/statuscode';
import DIcontainer from '../DIcontainer';
import { CustomError } from '../utils/customeerror';
import { errorResponse, successResponse } from '../utils/responce';
import { handleYupError } from '../utils/yuperror';

class RatingController {
  private _RatingDIController = DIcontainer.getGetAllRatingUseCase();

  async create(req: Request, resp: Response, next: NextFunction) {
    try {
      //@ts-ignore
      let user = req?.user;
      const hotel = await this._RatingDIController.create(req.body, user);
      console.log(hotel instanceof CustomError);
      if (hotel instanceof CustomError) {
        return next(hotel);
      }
      return successResponse(resp, 'user register successfully', hotel);
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
      const Hotel = await this._RatingDIController.findById(Id);
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
  async findByHotel(req: any, resp: Response, next: NextFunction) {
    try {
      const Id: string | undefined = req.params.id;
      const user = req.user;
      console.log('room id is commiggggggg');
      console.log(Id);
      const Hotel = await this._RatingDIController.findByHotel(Id, user);
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
      const Hotel = await this._RatingDIController.find();
      if (Hotel instanceof CustomError) {
        return next(Hotel);
      }
      return successResponse(resp, 'get all rating successfully', Hotel);
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
      console.log('delete body is comminfgggggg------');
      console.log(req.body);
      const hotelDelete: any = await this._RatingDIController.delete(
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
  
}
export default RatingController;
