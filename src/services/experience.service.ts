import { statusCode } from 'src/config/statuscode';
import { CustomError } from 'src/utils/customeerror';

import { IexperienceRepository } from 'src/domain/interfaces/experienceRepository';

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
  async find() {
    try {
      const Experience = await this.expRepo.findAll();
      if (!Experience) {
        throw new CustomError('hotel is not avilable', statusCode.notFound);
      }
      return Experience;
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
