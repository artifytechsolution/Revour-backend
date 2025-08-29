import prisma from 'src/config/db.config';
import { IRoomRepository } from 'src/domain/interfaces/roomRepository';

export class RoomRepository implements IRoomRepository {
  async findByByHotel(id: number | undefined): Promise<any | null> {
    return await prisma.room_types.findMany({
      where: {
        hotel_id: id,
      },
    });
  }

  async findAll(): Promise<any> {
    return await prisma.room_types.findMany();
  }
  async findById(id: string): Promise<any | null> {
    return await prisma.room_types.findUnique({
      where: {
        id: id,
      },
      include: {
        hotel: true,
      },
    });
  }

  async create(room: any): Promise<any> {
    return await prisma.room_types.createMany({
      data: room,
    });
  }
  async update(room: any, Id: string): Promise<any> {
    return await prisma.room_types.update({
      where: {
        id: Id,
      },
      data: room,
    });
  }
  async delete(ids: string[]): Promise<any> {
    const data = await prisma.room_types.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return data;
  }
  async hourAdd(data: any): Promise<any> {
    console.log('main component custome data is heerree !!!===');
    console.log(data);
    return await prisma.room_hourly_rates.createMany({
      data: data,
    });
  }
  async hoursDelete(ids: any): Promise<any> {
    const data = await prisma.room_hourly_rates.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return data;
  }
  async hoursFind(Id: any): Promise<any> {
    const data = await prisma.room_hourly_rates.findUnique({
      where: {
        id: Id,
      },
    });
    return data;
  }
}
