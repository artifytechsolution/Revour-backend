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
  // async find(req: Request, resp: Response, next: NextFunction) {
  //   try {
  //     const Hotel = await this._experienceDIcontroller.find();
  //     if (Hotel instanceof CustomError) {
  //       return next(Hotel);
  //     }
  //     return successResponse(resp, 'get experience successfully', Hotel);
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
  public async find(req: Request, resp: Response, next: NextFunction) {
    try {
      // 1. Destructure query parameters from the request
      const { page: pageQuery, limit: limitQuery, search } = req.query;

      const options: { page?: number; limit?: number; search?: string } = {};

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

      if (search && typeof search === 'string' && search.trim() !== '') {
        options.search = search.trim();
      }

      const result = await this._experienceDIcontroller.find(options);

      return successResponse(resp, 'Hotels retrieved successfully', result);
    } catch (err) {
      return next(err);
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
  async addameniities(req: Request, resp: Response, next: NextFunction) {}

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
