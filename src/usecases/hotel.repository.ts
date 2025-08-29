import { IHotelRepository } from 'src/domain/interfaces/hotelRepository';

import { hotel } from 'src/domain/entity/hotel';
import prisma from 'src/config/db.config';

export class HotelRepository implements IHotelRepository {
  async FindByRooms(): Promise<hotel[]> {
    return await prisma.hotels.findMany({
      where: {
        isHourly: true,
      },
      include: {
        hotel_images: {
          where: {
            is_primary: true,
          },
        },
        room_hourly_rates: true,
        hotel_ratings: true,
      },
    });
  }
  findByEmail(email: string): Promise<hotel | null> {
    return prisma.hotels.findUnique({
      where: {
        email: email,
      },
    });
  }
  async findAll(): Promise<any> {
    return await prisma.hotels.findMany({
      include: {
        hotel_images: {
          where: {
            is_primary: true,
          },
        },
        room_hourly_rates: true,
        hotel_ratings: true,
        room_types: true,
      },
    });
  }
  async findById(id: string): Promise<hotel | null> {
    return await prisma.hotels.findUnique({
      where: {
        id: id,
      },
      include: {
        hotel_images: true,
        hotel_ratings: true,
        room_types: true,
        PrivacyPolicy: true,
        Amenity: true,
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
  async hotelunavilable(extraparams: any) {
    console.log('extraparms is commingggg for my side');
    console.log(extraparams);
    const hotelunavilable = prisma.hotelUnavailable.createMany({
      data: extraparams,
    });
    return hotelunavilable;
  }
  async hotelunavilableById(id: any) {
    const hotelunavilable = prisma.hotelUnavailable.findMany({
      where: {
        hotel_id: id,
      },
      include: {
        hotel: true,
      },
    });
    return hotelunavilable;
  }
  async hotelunavilableList() {
    const hotelunavilable = prisma.hotelUnavailable.findMany({
      include: {
        hotel: true,
      },
    });
    return hotelunavilable;
  }
  async addameniities(Data: any) {
    await prisma.amenity.createMany({
      data: Data,
    });
  }
  async addPrivacyPolicy(Data: any) {
    await prisma.privacyPolicy.create({
      data: Data,
    });
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
