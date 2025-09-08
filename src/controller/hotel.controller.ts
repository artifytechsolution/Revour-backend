import { NextFunction, Request, Response } from 'express';
// import { statusCode, statusMessage } from '../config/statuscode';
import DIcontainer from '../DIcontainer';
import { CustomError } from '../utils/customeerror';
import { errorResponse, successResponse } from '../utils/responce';
import { handleYupError } from '../utils/yuperror';
import prisma from 'src/config/db.config';

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
  public async find(req: Request, resp: Response, next: NextFunction) {
    try {
      // 1. Destructure query parameters from the request
      const {
        page: pageQuery,
        limit: limitQuery,
        search,
        checkin: checkinQuery,
        checkout: checkoutQuery,
      } = req.query;

      const options: {
        page?: number;
        limit?: number;
        search?: string;
        checkin?: Date;
        checkout?: Date;
      } = {};

      // 2. Validate 'limit' if it exists
      if (limitQuery) {
        const limit = parseInt(limitQuery as string, 10);
        if (isNaN(limit) || limit < 1) {
          return errorResponse(
            resp,
            "Invalid 'limit' parameter. Must be a positive number.",
            400,
          );
        }
        options.limit = limit;
      }

      // 3. Validate 'page' if it exists
      if (pageQuery) {
        const page = parseInt(pageQuery as string, 10);
        if (isNaN(page) || page < 1) {
          return errorResponse(
            resp,
            "Invalid 'page' parameter. Must be a positive number.",
            400,
          );
        }
        options.page = page;
      }

      // 4. Add 'search' term if it exists
      if (search && typeof search === 'string' && search.trim() !== '') {
        options.search = search.trim();
      }

      // 5. Validate 'checkin' if it exists
      if (checkinQuery) {
        const checkinDate = new Date(checkinQuery as string);
        if (isNaN(checkinDate.getTime())) {
          return errorResponse(
            resp,
            "Invalid 'checkin' parameter. Must be a valid date.",
            400,
          );
        }
        options.checkin = checkinDate;
      }

      // 6. Validate 'checkout' if it exists
      if (checkoutQuery) {
        const checkoutDate = new Date(checkoutQuery as string);
        if (isNaN(checkoutDate.getTime())) {
          return errorResponse(
            resp,
            "Invalid 'checkout' parameter. Must be a valid date.",
            400,
          );
        }
        options.checkout = checkoutDate;
      }

      // 7. Additional logic: If both are provided, check that checkout > checkin
      if (
        options.checkin &&
        options.checkout &&
        options.checkout <= options.checkin
      ) {
        return errorResponse(
          resp,
          "'checkout' date must be after 'checkin' date.",
          400,
        );
      }

      // 8. Call the business logic
      const result = await this._HotelDIController.find(options);

      // 9. Send a consistent success response
      return successResponse(resp, 'Hotels retrieved successfully', result);
    } catch (err) {
      // 10. Pass unexpected errors to the central error handler
      return next(err);
    }
  }

  async findByHours(req: Request, resp: Response, next: NextFunction) {
    try {
      const {
        page: pageQuery,
        limit: limitQuery,
        search,
        checkin: checkinQuery,
        checkout: checkoutQuery,
      } = req.query;

      const options: {
        page?: number;
        limit?: number;
        search?: string;
        checkin?: Date;
        checkout?: Date;
      } = {};

      // 2. Validate 'limit' if it exists
      if (limitQuery) {
        const limit = parseInt(limitQuery as string, 10);
        if (isNaN(limit) || limit < 1) {
          return errorResponse(
            resp,
            "Invalid 'limit' parameter. Must be a positive number.",
            400,
          );
        }
        options.limit = limit;
      }

      // 3. Validate 'page' if it exists
      if (pageQuery) {
        const page = parseInt(pageQuery as string, 10);
        if (isNaN(page) || page < 1) {
          return errorResponse(
            resp,
            "Invalid 'page' parameter. Must be a positive number.",
            400,
          );
        }
        options.page = page;
      }

      // 4. Add 'search' term if it exists
      if (search && typeof search === 'string' && search.trim() !== '') {
        options.search = search.trim();
      }

      // 5. Validate 'checkin' if it exists
      if (checkinQuery) {
        const checkinDate = new Date(checkinQuery as string);
        if (isNaN(checkinDate.getTime())) {
          return errorResponse(
            resp,
            "Invalid 'checkin' parameter. Must be a valid date.",
            400,
          );
        }
        options.checkin = checkinDate;
      }

      // 6. Validate 'checkout' if it exists
      if (checkoutQuery) {
        const checkoutDate = new Date(checkoutQuery as string);
        if (isNaN(checkoutDate.getTime())) {
          return errorResponse(
            resp,
            "Invalid 'checkout' parameter. Must be a valid date.",
            400,
          );
        }
        options.checkout = checkoutDate;
      }

      // 7. Additional logic: If both are provided, check that checkout > checkin
      if (
        options.checkin &&
        options.checkout &&
        options.checkout <= options.checkin
      ) {
        return errorResponse(
          resp,
          "'checkout' date must be after 'checkin' date.",
          400,
        );
      }
      const Hotel = await this._HotelDIController.findByHours(options);
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
      return successResponse(
        resp,
        'profile uploaded successfully',
        hotelDelete,
      );
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
  async hotelunavilable(req: Request, resp: Response, next: NextFunction) {
    try {
      const hotel = await this._HotelDIController.hotelunavilable(req.body);
      console.log(hotel instanceof CustomError);
      if (hotel instanceof CustomError) {
        return next(hotel);
      }
      return successResponse(resp, 'user register successfully', hotel);
    } catch (err: any) {
      console.log('error is comminggggggg');
      console.log(err);
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
  async hotelunavilableById(req: Request, resp: Response, next: NextFunction) {
    try {
      const hotel = await this._HotelDIController.hotelunavilableById(
        parseInt(req.params.id ?? '0'),
      );
      console.log(hotel instanceof CustomError);
      if (hotel instanceof CustomError) {
        return next(hotel);
      }
      return successResponse(resp, 'user register successfully', hotel);
    } catch (err: any) {
      console.log('error is comminggggggg');
      console.log(err);
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
  async hotelunavilableList(req: Request, resp: Response, next: NextFunction) {
    try {
      console.log('hotel list is calllledd---------');
      const hotel = await this._HotelDIController.hotelunavilableList();
      console.log('hotel is commmiggggggggg');
      console.log(hotel);
      console.log(hotel instanceof CustomError);
      if (hotel instanceof CustomError) {
        return next(hotel);
      }
      return successResponse(resp, 'user register successfully', hotel);
    } catch (err: any) {
      console.log('error is comminggggggg');
      console.log(err);
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
  async addAmenities(req: Request, resp: Response, next: NextFunction) {
    try {
      const hotel = await this._HotelDIController.addAmenities(req.body);
      console.log(hotel instanceof CustomError);
      if (hotel instanceof CustomError) {
        return next(hotel);
      }
      return successResponse(resp, 'user register successfully', hotel);
    } catch (err: any) {
      console.log('error is comminggggggg');
      console.log(err);
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
  async addPolicy(req: Request, resp: Response, next: NextFunction) {
    try {
      const hotel = await this._HotelDIController.addPolicy(req.body);
      console.log('hotel is commmiggggggggg');
      console.log(hotel);
      console.log(hotel instanceof CustomError);
      if (hotel instanceof CustomError) {
        return next(hotel);
      }
      return successResponse(resp, 'user register successfully', hotel);
    } catch (err: any) {
      console.log('error is comminggggggg');
      console.log(err);
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
  async updatehours(req: Request, resp: Response, next: NextFunction) {
    try {
      const data = req.body;
      const { id, rate_per_hour, hotel_id, ...rest } = data;

      console.log('update data is comming xxx---------->');
      console.log(data);
      console.log(rest);

      const hotelupdate: any = await prisma.room_hourly_rates.update({
        where: { id },
        data: {
          duration_hours: data.duration_hours,
          rate_per_hour: data.rate_per_hour,
        },
      });

      // if (hotelupdate instanceof CustomError) {
      //   return next(hotelupdate);
      // }
      return successResponse(resp, 'hotel deleted successfully', hotelupdate);
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
  async updaterooms(req: Request, resp: Response, next: NextFunction) {
    try {
      const data: any = req.body;
      console.log('main rooms api is callleddddd--------');
      console.log(data);

      const hotelupdate: any = await prisma.room_types.update({
        where: { id: data.id },
        data: {
          type_name: data.type_name,
          base_price: data.base_price,
        },
      });

      if (hotelupdate instanceof CustomError) {
        return next(hotelupdate);
      }
      return successResponse(resp, 'hotel deleted successfully', hotelupdate);
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
export default HotelController;
