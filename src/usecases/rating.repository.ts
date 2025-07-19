import prisma from 'src/config/db.config';
import { IRatingRepository } from 'src/domain/interfaces/ratingRepository';

//find by user last me rakhege
export class RatingRepository implements IRatingRepository {
  avgRating(id: number | undefined): Promise<any | null> {
    throw new Error('Method not implemented.');
  }

  async findByHotel(
    id: number | undefined,
    user_id: number,
  ): Promise<any | null> {
    return await prisma.hotel_ratings.findMany({
      where: {
        hotel_id: id,
      },
    });
  }

  async findAll(): Promise<any> {
    return await prisma.hotel_ratings.findMany();
  }
  async findById(id: string): Promise<any | null> {
    return await prisma.hotel_ratings.findUnique({
      where: {
        rating_id: id,
      },
    });
  }

  async create(ratingData: any): Promise<any> {
    return await prisma.hotel_ratings.create({
      data: ratingData,
    });
  }
  async update(ratingData: any, Id: string): Promise<any> {
    return await prisma.hotel_ratings.update({
      where: {
        rating_id: Id,
      },
      data: ratingData,
    });
  }
  async delete(ids: string[]): Promise<any> {
    const data = await prisma.hotel_ratings.deleteMany({
      where: {
        rating_id: {
          in: ids,
        },
      },
    });
    return data;
  }
}
