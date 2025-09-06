import { NextFunction, Request, Response } from 'express';
// import { statusCode, statusMessage } from '../config/statuscode';
import DIcontainer from '../DIcontainer';
import { CustomError } from '../utils/customeerror';
import { errorResponse, successResponse } from '../utils/responce';
import prisma from 'src/config/db.config';

class OrderController {
  private _OrderDIController = DIcontainer.getGetOrderUseCase();

  async create(req: Request, resp: Response, next: NextFunction) {
    try {
      const hotel = await this._OrderDIController.create(req.body);
      console.log(hotel instanceof CustomError);
      if (hotel instanceof CustomError) {
        return next(hotel);
      }
      return successResponse(
        resp,
        'Your booking has been confirmed successfully',
        hotel,
      );
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
  async verify(req: Request, resp: Response, next: NextFunction) {
    try {
      console.log('verify controller is callleeeeeerdddd');
      const hotel: any = await this._OrderDIController.verify(req.body);
      console.log(hotel instanceof CustomError);
      if (hotel instanceof CustomError) {
        return next(hotel);
      }
      return successResponse(
        resp,
        'Your booking has been confirmed successfully',
        hotel,
      );
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
  async orderList(req: Request, resp: Response, next: NextFunction) {
    try {
      const hotel: any = await this._OrderDIController.allOrders();
      console.log(hotel instanceof CustomError);
      if (hotel instanceof CustomError) {
        return next(hotel);
      }
      return successResponse(resp, 'book your hotel sucessfully', hotel);
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
  async orderListByid(req: Request, resp: Response, next: NextFunction) {
    try {
      const hotel: any = await this._OrderDIController.orderFindById(
        parseInt(req.params.id ?? '0'),
      );
      console.log('hotel data is comming', req.params.id);
      console.log(hotel instanceof CustomError);
      if (hotel instanceof CustomError) {
        return next(hotel);
      }
      return successResponse(resp, 'book your hotel sucessfully', hotel);
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
  async orderListByuser(req: Request, resp: Response, next: NextFunction) {
    console.log('user id is commminggggg');
    console.log(req.params.id);
    try {
      const hotel: any = await this._OrderDIController.orderFindByuser(
        req.params.id ?? '0',
      );
      console.log('hotel data is comming', req.params.id);
      console.log(hotel instanceof CustomError);
      if (hotel instanceof CustomError) {
        return next(hotel);
      }
      return successResponse(resp, 'book your hotel sucessfully', hotel);
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
  async orderCancel(req: Request, resp: Response, next: NextFunction) {
    try {
      const hotel = await prisma.reservations.update({
        where: {
          reservation_id: parseInt(req.params.id ?? '0'), // make sure this is the correct type (string or number)
        },
        data: {
          status: 'cancel',
        },
      });

      console.log('hotel data is comming', req.params.id);
      console.log(hotel instanceof CustomError);
      if (hotel instanceof CustomError) {
        return next(hotel);
      }
      return successResponse(resp, 'book hotel is sucessfully cancel');
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
}

export default OrderController;
