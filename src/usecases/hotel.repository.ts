import { IHotelRepository } from 'src/domain/interfaces/hotelRepository';

import { hotel } from 'src/domain/entity/hotel';
import prisma from 'src/config/db.config';

export class HotelRepository implements IHotelRepository {
  findByEmail(email: string): Promise<hotel | null> {
    return prisma.hotels.findUnique({
      where: {
        email: email,
      },
    });
  }
  async findAll(): Promise<hotel[]> {
    return await prisma.hotels.findMany();
  }
  async findById(id: string): Promise<hotel | null> {
    return await prisma.hotels.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(hotel: hotel): Promise<hotel> {
    return await prisma.hotels.create({
      data: hotel,
    });
  }
  async update(hotel: hotel, Id: string): Promise<hotel> {
    return await prisma.hotels.update({
      where: {
        id: Id,
      },
      data: hotel,
    });
  }
  async delete(ids: string[]): Promise<any> {
    const data = await prisma.hotels.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return data;
  }
  async uploadImage(tablename: string, data: any) {
    const createImage = (prisma as any)[tablename].createMany({
      data: data,
    });
    return createImage;
  }
  // async addHotelDes(Data: any): Promise<string> {
  //   const Hotel = await prisma.hotel_descriptions.create({
  //     where: {
  //       id: Data.id,
  //     },
  //     data: {
  //       description: 'chdihcjdc',
  //     },
  //   });
  //   return 'hotel discription added sucessfully';
  // }
}
