import { hotel } from 'src/domain/entity/hotel';
import prisma from 'src/config/db.config';
import { IexperienceRepository } from 'src/domain/interfaces/experienceRepository';

export class ExperienceRepository implements IexperienceRepository {
  findByEmail(email: string): Promise<any | null> {
    return prisma.experience.findUnique({
      where: {
        email: email,
      },
    });
  }
  async findAll(): Promise<any[]> {
    return await prisma.experience.findMany({
      include: {
        images: {
          where: {
            is_primary: true,
          },
        },
      },
    });
  }
  async findById(id: string): Promise<any | null> {
    const data = await prisma.experience.findUnique({
      where: {
        id: id,
      },
    });
    console.log(data);
    return data;
  }

  async create(hotel: any): Promise<any> {
    return await prisma.experience.create({
      data: hotel,
    });
  }
  async update(hotel: hotel, Id: string): Promise<any> {
    return await prisma.experience.update({
      where: {
        id: Id,
      },
      data: hotel,
    });
  }
  async delete(ids: string[]): Promise<any> {
    const data = await prisma.experience.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return data;
  }
  async uploadImage(tablename: string, data: any) {
    if (tablename == 'users') {
      // const createImage = (prisma as any)[tablename].update({
      //   data: data,
      // });
      console.log('user data is commiggggg');
      console.log(data);
    }
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
