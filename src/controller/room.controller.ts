import { NextFunction, Request, Response } from 'express';
// import { statusCode, statusMessage } from '../config/statuscode';
import DIcontainer from '../DIcontainer';
import { CustomError } from '../utils/customeerror';
import { errorResponse, successResponse } from '../utils/responce';
import { handleYupError } from '../utils/yuperror';

class RoomController {
  private _RoomDIController = DIcontainer.getGetAllRoomUseCase();

  async create(req: Request, resp: Response, next: NextFunction) {
    try {
      const hotel = await this._RoomDIController.create(req.body);
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
      const Hotel = await this._RoomDIController.findById(Id);
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
  async findByHotel(req: Request, resp: Response, next: NextFunction) {
    try {
      const Id: string | undefined = req.params.id;
      console.log('room id is commiggggggg');
      console.log(Id);
      const Hotel = await this._RoomDIController.findByHotel(Id);
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
      const Hotel = await this._RoomDIController.find();
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
      const hotelDelete: any = await this._RoomDIController.delete(
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

  async createHours(req: Request, resp: Response, next: NextFunction) {
    try {
      const hotel = await this._RoomDIController.addHours(req.body);
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
    async deleteHours(req: Request, resp: Response, next: NextFunction) {
    try {
      console.log('delete body is comminfgggggg------');
      console.log(req.body);
      const hotelDelete: any = await this._RoomDIController.deleteHours(
        req.body.ids,
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




}
export default RoomController;
