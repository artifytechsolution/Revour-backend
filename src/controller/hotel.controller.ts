import { NextFunction, Request, Response } from 'express';
// import { statusCode, statusMessage } from '../config/statuscode';
import DIcontainer from '../DIcontainer';
import { CustomError } from '../utils/customeerror';
import { errorResponse, successResponse } from '../utils/responce';
import { handleYupError } from '../utils/yuperror';

class HotelController {
  private _HotelDIController = DIcontainer.getGetAllhotelUseCase();

  async create(req: Request, resp: Response, next: NextFunction) {
    try {
      const hotel = await this._HotelDIController.create(req.body);
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
      const Hotel = await this._HotelDIController.findById(Id);
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
      const Hotel = await this._HotelDIController.find();
      if (Hotel instanceof CustomError) {
        return next(Hotel);
      }
      return successResponse(resp, 'get hotels successfully', Hotel);
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
      const hotelDelete: any = await this._HotelDIController.delete(
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
  async uploadImage(req: Request, resp: Response, next: NextFunction) {
    try {
      if (!req.files || req.files.length === 0) {
        new CustomError('file is not found', 404);
      }
      const hotelDelete: any = await this._HotelDIController.fileupload(
        req.files as any[],
        req.body,
      );
      if (hotelDelete instanceof CustomError) {
        return next(hotelDelete);
      }
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
  //     const hotelupadte: any = await this._HotelDIController.update(
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
export default HotelController;
