import { statusCode } from 'src/config/statuscode';

import { CustomError } from 'src/utils/customeerror';

import { IRatingRepository } from 'src/domain/interfaces/ratingRepository';
import { IHotelRepository } from 'src/domain/interfaces/hotelRepository';

export default class RatingService {
  constructor(
    private ratingRepo: IRatingRepository,
    private hotelRepo: IHotelRepository,
  ) {}

  async create(RatingData: any, userdata: any): Promise<any> {
    try {
      const hotelAvilable = await this.hotelRepo.findById(RatingData.hotel_id);

      if (!hotelAvilable) {
        throw new CustomError('hotel is not exist', statusCode.notFound);
      }
      const createRoom = await this.ratingRepo.create({
        ...RatingData,
        hotel_id: hotelAvilable.hotel_id,
        user_id: userdata.userId,
      });
      if (!createRoom) {
        throw new CustomError('hotel is not created', statusCode.notFound);
      }
      return createRoom;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error; // Re-throw known custom errors
      }
      if (error instanceof Error) {
        throw new CustomError(error.message, 500);
      }
      throw new CustomError('An unknown error occurred', 500);
    }
  }

  async findById(id: string | undefined) {
    try {
      const Hotel = await this.ratingRepo.findById(id);
      if (!Hotel) {
        throw new CustomError('hotel is not avilable', statusCode.notFound);
      }
      return Hotel;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new CustomError(error.message, 500);
      }
      throw new CustomError('An unknown error occurred', 500);
    }
  }
  async findByHotel(id: string | undefined, user: any) {
    try {
      const Hotel = await this.ratingRepo.findById(id);
      if (!Hotel) {
        throw new CustomError('hotel is not avilable', statusCode.notFound);
      }
      const getRooms = await this.ratingRepo.findByHotel(
        Hotel.hotel_id,
        user.user_id,
      );
      if (!getRooms) {
        return [];
      }
      return getRooms;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new CustomError(error.message, 500);
      }
      throw new CustomError('An unknown error occurred', 500);
    }
  }
  async find() {
    try {
      const Hotel = await this.ratingRepo.findAll();
      if (!Hotel) {
        throw new CustomError('hotel is not avilable', statusCode.notFound);
      }
      return Hotel;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error; // Re-throw known custom errors
      }
      if (error instanceof Error) {
        throw new CustomError(error.message, 500);
      }
      throw new CustomError('An unknown error occurred', 500);
    }
  }
  async delete(id: any[]) {
    try {
      const deleteHotel: any = await this.ratingRepo.delete(id);
      if (deleteHotel.count == 0) {
        throw new CustomError('room is not avilable', statusCode.notFound);
      }
      return deleteHotel;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error; // Re-throw known custom errors
      }
      if (error instanceof Error) {
        throw new CustomError(error.message, 500);
      }
      throw new CustomError('An unknown error occurred', 500);
    }
  }
  // async update(id: string, data: any) {
  //   try {
  //     const updatedHotel = await this.findById(id);
  //     const updateData = await this.update(id, data);
  //     if (!updateData) {
  //       throw new CustomError('hotel is not updated', statusCode.notFound);
  //     }
  //     return updateData;
  //   } catch (error: unknown) {
  //     if (error instanceof CustomError) {
  //       throw error; // Re-throw known custom errors
  //     }
  //     if (error instanceof Error) {
  //       throw new CustomError(error.message, 500);
  //     }
  //     throw new CustomError('An unknown error occurred', 500);
  //   }
  // }
}
