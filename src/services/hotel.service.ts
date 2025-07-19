import { statusCode } from 'src/config/statuscode';
import { IHotelRepository } from 'src/domain/interfaces/hotelRepository';
import { CustomError } from 'src/utils/customeerror';
import fs from 'fs';

import cloudinary from 'src/config/cloudinary.config';
import { IexperienceRepository } from 'src/domain/interfaces/experienceRepository';

export default class HotelServices {
  constructor(
    private hotelRepo: IHotelRepository,
    private experenceRepo: IexperienceRepository,
  ) {}

  async create(ProductData: any): Promise<any> {
    try {
      const hotelAvilable = await this.hotelRepo.findByEmail(ProductData.email);

      if (hotelAvilable) {
        throw new CustomError('hotel is already exist', statusCode.notFound);
      }
      const createHotel = await this.hotelRepo.create(ProductData);
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
      const Hotel = await this.hotelRepo.findById(id);
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
  async find() {
    try {
      const Hotel = await this.hotelRepo.findAll();
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
      const deleteHotel: any = await this.hotelRepo.delete(id);
      console.log('hello delete api is calledddd');
      console.log(deleteHotel);
      if (deleteHotel.count == 0) {
        throw new CustomError('hotel is not avilable', statusCode.notFound);
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

  async fileupload(files: any[], extraparams: any) {
    console.log('Extra parameters:', extraparams);

    let findHotel: any;
    let findExperience: any;

    if (extraparams.hotel_id) {
      findHotel = await this.findById(extraparams.hotel_id);
    } else if (extraparams.experience_id) {
      findExperience = await this.experenceRepo.findById(
        extraparams.experience_id,
      );
    }

    console.log('Fetched experience:', findExperience);

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: 'uploads',
        resource_type: 'image',
      }),
    );

    const results = await Promise.all(uploadPromises);
    console.log('Image upload results:', results);

    const hotelResult = results.map((item: any) => ({
      image_url: item.secure_url,
      hotel_id: findHotel?.hotel_id,
    }));

    const experienceResult = results.map((item: any) => ({
      image_url: item.secure_url,
      experience_id: findExperience?.experience_id,
    }));

    if (extraparams.serviceName === 'hotel') {
      await this.ImageUpload('hotel_images', hotelResult);
    } else if (extraparams.serviceName === 'experience') {
      console.log('Uploading experience images...');
      await this.ImageUpload('experience_images', experienceResult);
    }

    // Clean up local files
    files.forEach((file) => {
      fs.unlinkSync(file.path);
    });

    const imageUrls = results.map((result) => result.secure_url);
    console.log('Uploaded image URLs:', imageUrls);

    return imageUrls;
  }

  async ImageUpload(tableName: string, data: any[]) {
    const uploadImage = await this.hotelRepo.uploadImage(tableName, data);
    console.log('IMAGE UPLOAD SUCCESSFULLY', uploadImage);
    if (!uploadImage) {
      throw new Error('image not uploaded successfully');
    }
    return uploadImage;
  }
}
