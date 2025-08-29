import { statusCode } from 'src/config/statuscode';
import { CustomError } from 'src/utils/customeerror';

import { IexperienceRepository } from 'src/domain/interfaces/experienceRepository';
import prisma from 'src/config/db.config';

export default class ExperienceServices {
  constructor(private expRepo: IexperienceRepository) {}

  async create(ProductData: any): Promise<any> {
    try {
      const expAvilable = await this.expRepo.findByEmail(ProductData.email);

      if (expAvilable) {
        throw new CustomError(
          'experience is already exist',
          statusCode.notFound,
        );
      }
      const createHotel = await this.expRepo.create(ProductData);
      if (!createHotel) {
        throw new CustomError('hotel is not created', statusCode.notFound);
      }
      return createHotel;
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
      const Experience = await this.expRepo.findById(id);
      if (!Experience) {
        throw new CustomError(
          'experience is not avilable',
          statusCode.notFound,
        );
      }
      return Experience;
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
  // async find() {
  //   try {
  //     const Experience = await this.expRepo.findAll();
  //     if (!Experience) {
  //       throw new CustomError('hotel is not avilable', statusCode.notFound);
  //     }
  //     return Experience;
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
  async find(options: any) {
    const { page, limit, search } = options;
    console.log('search is hereeee');
    console.log(options);

    // 1. Dynamic whereClause banaya gaya hai
    const whereClause: any = {};
    // Agar search parameter diya gaya hai, to use query mein jodein
    if (search) {
      whereClause.AND = {
        OR: [
          { city: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    // 2. Agar 'limit' di gayi hai, to paginated/limited result return karein
    if (limit) {
      const currentPage = page && page > 0 ? page : 1;
      const skip = (currentPage - 1) * limit;

      // Dono queries mein updated 'whereClause' ka istemal kiya gaya hai
      const [experience, totalItems] = await prisma.$transaction([
        prisma.experience.findMany({
          where: whereClause, // Bug Fixed
          take: limit,
          skip: skip,
          include: {
            images: true,
          },
        }),
        prisma.experience.count({ where: whereClause }), // Bug Fixed
      ]);

      return {
        experience: experience,
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: currentPage,
          limit,
        },
      };
    } else {
      // 3. Agar 'limit' nahi hai, to search ke hisab se saare records layein
      const allHotels = await prisma.experience.findMany({
        where: whereClause, // Bug Fixed
        include: {
          images: { where: { is_primary: true } },
        },
      });
      return {
        hotels: allHotels,
      };
    }
  }
  async delete(id: any[]) {
    try {
      const deleteExperience: any = await this.expRepo.delete(id);
      console.log('hello delete api is calledddd');
      console.log(deleteExperience);
      if (deleteExperience.count == 0) {
        throw new CustomError(
          'Experience is not avilable',
          statusCode.notFound,
        );
      }
      return deleteExperience;
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
