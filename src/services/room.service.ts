import { statusCode } from 'src/config/statuscode';

import { CustomError } from 'src/utils/customeerror';

import { IRoomRepository } from 'src/domain/interfaces/roomRepository';
import { IHotelRepository } from 'src/domain/interfaces/hotelRepository';

export default class RoomService {
  constructor(
    private roomRepo: IRoomRepository,
    private hotelRepo: IHotelRepository,
  ) {}

  async create(roomData: any): Promise<any> {
    try {
      const hotelAvilable = await this.hotelRepo.findById(roomData.hotel_id);

      if (!hotelAvilable) {
        throw new CustomError('hotel is not exist', statusCode.notFound);
      }
      const createRoom = await this.roomRepo.create({
        ...roomData,
        hotel_id: hotelAvilable.hotel_id,
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
      const Hotel = await this.roomRepo.findById(id);
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
  async findByHotel(id: string | undefined) {
    try {
      const Hotel = await this.hotelRepo.findById(id);
      if (!Hotel) {
        throw new CustomError('hotel is not avilable', statusCode.notFound);
      }
      const getRooms = await this.roomRepo.findByByHotel(Hotel.hotel_id);
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
      const Hotel = await this.roomRepo.findAll();
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
      const deleteHotel: any = await this.roomRepo.delete(id);
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
  async addHours(data:any){
     try {
      const hotelAvilable = await this.hotelRepo.findById(data.hotel_id);

      if (!hotelAvilable) {
        throw new CustomError('hotel is not exist', statusCode.notFound);
      }
      const createHours = await this.roomRepo.hourAdd({
        ...data,
        hotel_id: hotelAvilable.hotel_id,
      });
      if (!createHours) {
        throw new CustomError('hotel is not created', statusCode.notFound);
      }
      return createHours;
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
    async deleteHours(id: any[]) {
    try {
      const deleteHotel: any = await this.roomRepo.hoursDelete(id);
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
