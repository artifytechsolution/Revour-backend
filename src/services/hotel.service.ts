import { statusCode } from 'src/config/statuscode';
import { IHotelRepository } from 'src/domain/interfaces/hotelRepository';
import { CustomError } from 'src/utils/customeerror';
import fs from 'fs';

import cloudinary from 'src/config/cloudinary.config';
import { IexperienceRepository } from 'src/domain/interfaces/experienceRepository';
import prisma from 'src/config/db.config';
import { IUserRepository } from 'src/domain/interfaces/userRepository';

export default class HotelServices {
  constructor(
    private hotelRepo: IHotelRepository,
    private experenceRepo: IexperienceRepository,
    private userRepo: IUserRepository,
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
  // async find() {
  //   try {
  //     const Hotel = await this.hotelRepo.findAll();
  //     if (!Hotel) {
  //       throw new CustomError('hotel is not avilable', statusCode.notFound);
  //     }
  //     return Hotel;
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

  public async find(options: {
    page?: number;
    limit?: number;
    search?: string;
    checkin?: Date;
    checkout?: Date;
  }): Promise<any> {
    const { page, limit, search, checkin, checkout } = options;
    console.log('options is commigggggggggg');
    console.log(options);
    // Build base WHERE clause
    const whereClause: any = {};

    // Search filter
    if (search) {
      whereClause.AND = [
        {
          OR: [
            { city: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    // If checkin & checkout provided → filter out unavailable hotels
    if (checkin && checkout) {
      // Find all unavailable hotels in this range
      const unavailableHotels = await prisma.hotelUnavailable.findMany({
        where: {
          // Overlap logic:
          // A booking is considered conflicting if:
          // checkin < booking's checkout && checkout > booking's checkin
          check_in_datetime: { lt: checkout },
          check_out_datetime: { gt: checkin },
        },
        select: { hotel_id: true },
      });

      const unavailableHotelIds = [
        ...new Set(unavailableHotels.map((h) => h.hotel_id)),
      ];

      console.log('unavilable hotel id is heererereeerrerre');
      console.log(unavailableHotelIds);

      // Exclude these hotels from the main query
      whereClause.hotel_id = { notIn: unavailableHotelIds };
    }

    // Pagination handling
    if (limit) {
      const currentPage = page && page > 0 ? page : 1;
      const skip = (currentPage - 1) * limit;

      const [hotels, totalItems] = await prisma.$transaction([
        prisma.hotels.findMany({
          where: whereClause,
          take: limit,
          skip: skip,
          include: {
            hotel_images: true,
            room_hourly_rates: true,
            hotel_ratings: true,
            room_types: true,
          },
        }),
        prisma.hotels.count({ where: whereClause }),
      ]);

      return {
        hotels,
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage,
          limit,
        },
      };
    }

    // If no pagination, return all matching hotels
    const allHotels = await prisma.hotels.findMany({
      where: whereClause,
      include: {
        hotel_images: { where: { is_primary: true } },
        room_hourly_rates: true,
        hotel_ratings: true,
        room_types: true,
      },
    });

    return { hotels: allHotels };
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

  //old file upload code
  // async fileupload(files: any[], extraparams: any) {
  //   console.log('Extra parameters:', extraparams);

  //   let findHotel: any;
  //   let findExperience: any;
  //   let user: any;

  //   if (extraparams.hotel_id) {
  //     findHotel = await this.findById(extraparams.hotel_id);
  //   } else if (extraparams.experience_id) {
  //     findExperience = await this.experenceRepo.findById(
  //       extraparams.experience_id,
  //     );
  //   } else if (extraparams.user_id) {
  //     user = await this.userRepo.findById(extraparams.experience_id);
  //   }

  //   console.log('hotel details is hereeeeeeee');
  //   console.log(findHotel);

  //   console.log('Fetched experience:', findExperience);

  //   const uploadPromises = files.map((file) =>
  //     cloudinary.uploader.upload(file.path, {
  //       folder: 'uploads',
  //       resource_type: 'image',
  //     }),
  //   );

  //   const results = await Promise.all(uploadPromises);
  //   console.log('Image upload results:', results);

  //   const hotelResult = results.map((item: any) => ({
  //     image_url: item.secure_url,
  //     hotel_id: findHotel?.hotel_id,
  //   }));

  //   const experienceResult = results.map((item: any) => ({
  //     image_url: item.secure_url,
  //     experience_id: findExperience?.experience_id,
  //   }));

  //   const userResult = results.map((item: any) => ({
  //     image_url: item.secure_url,
  //     user_id: user?.userId,
  //   }));

  //   if (extraparams.serviceName === 'hotel') {
  //     await this.ImageUpload('hotel_images', hotelResult);
  //   } else if (extraparams.serviceName === 'experience') {
  //     console.log('Uploading experience images...');
  //     await this.ImageUpload('experience_images', experienceResult);
  //   } else if (extraparams.serviceName === 'user') {
  //     console.log('Uploading experience images...');
  //     await this.ImageUpload('users', experienceResult);
  //   }

  //   // Clean up local files
  //   files.forEach((file) => {
  //     fs.unlinkSync(file.path);
  //   });

  //   const imageUrls = results.map((result) => result.secure_url);
  //   console.log('Uploaded image URLs:', imageUrls);

  //   return imageUrls;
  // }

  async fileupload(files: any[], extraparams: any) {
    try {
      console.log('Extra parameters:', extraparams);
      // Validate required parameters
      if (!files || files.length === 0) {
        throw new Error('No files provided for upload');
      }

      if (!extraparams.serviceName) {
        throw new Error('Service name is required');
      }

      let findHotel: any = null;
      let findExperience: any = null;
      let user: any = null;

      // Fetch entities conditionally based on extraparams
      try {
        if (extraparams.hotel_id) {
          findHotel = await this.findById(extraparams.hotel_id);
          console.log('Hotel details:', findHotel);

          if (!findHotel) {
            throw new Error(`Hotel with ID ${extraparams.hotel_id} not found`);
          }
        } else if (extraparams.experience_id) {
          findExperience = await this.experenceRepo.findById(
            extraparams.experience_id,
          );
          console.log('Fetched experience:', findExperience);

          if (!findExperience) {
            throw new Error(
              `Experience with ID ${extraparams.experience_id} not found`,
            );
          }
        } else if (extraparams.user_id) {
          // Fixed: Use user_id instead of experience_id
          user = await this.userRepo.findById(extraparams.user_id);
          console.log('Fetched user:', user);

          if (!user) {
            throw new Error(`User with ID ${extraparams.user_id} not found`);
          }
        }
      } catch (error: any) {
        console.error('Error fetching entity:', error);
        throw new Error(`Failed to fetch entity: ${error.message}`);
      }

      // Upload files to Cloudinary
      console.log(`Uploading ${files.length} files to Cloudinary...`);
      const uploadPromises = files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: `uploads/${extraparams.serviceName}`,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        }),
      );

      const results = await Promise.all(uploadPromises);
      console.log('Image upload results:', results);

      // Prepare data for database insertion
      let uploadData: any[] = [];

      switch (extraparams.serviceName) {
        case 'hotel':
          if (!findHotel) {
            throw new Error('Hotel data is required for hotel image upload');
          }
          uploadData = results.map((item: any) => ({
            image_url: item.secure_url,
            hotel_id: findHotel.hotel_id,
          }));
          break;

        case 'experience':
          if (!findExperience) {
            throw new Error(
              'Experience data is required for experience image upload',
            );
          }
          uploadData = results.map((item: any) => ({
            image_url: item.secure_url,
            experience_id: findExperience.experience_id,
          }));
          break;

        case 'user':
          if (!user) {
            throw new Error('User data is required for user image upload');
          }
          uploadData = results.map((item: any) => ({
            image_url: item.secure_url,
            user_id: user.userId,
          }));
          break;

        default:
          throw new Error(
            `Unsupported service name: ${extraparams.serviceName}`,
          );
      }

      // Save to database based on service type
      try {
        switch (extraparams.serviceName) {
          case 'hotel':
            console.log('Uploading hotel images to database...');
            await this.ImageUpload('hotel_images', uploadData);
            break;

          case 'experience':
            console.log('Uploading experience images to database...');
            await this.ImageUpload('experience_images', uploadData);
            break;

          case 'user':
            console.log('Uploading user images to database...');
            // Fixed: Use uploadData instead of experienceResult
            await this.ImageUpload('users', uploadData);
            break;
        }
      } catch (error: any) {
        console.error('Database upload failed:', error);

        // Rollback: Delete uploaded images from Cloudinary if database insertion fails
        const deletePromises = results.map((result) =>
          cloudinary.uploader.destroy(result.public_id),
        );
        await Promise.all(deletePromises);

        throw new Error(`Failed to save images to database: ${error.message}`);
      }

      // Clean up local files
      try {
        files.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
        console.log('Local files cleaned up successfully');
      } catch (error) {
        console.error('Error cleaning up local files:', error);
        // Don't throw here as the main operation was successful
      }

      // Return success response
      const imageUrls = results.map((result) => result.secure_url);
      console.log('Successfully uploaded image URLs:', imageUrls);

      return {
        success: true,
        message: `Successfully uploaded ${imageUrls.length} images`,
        imageUrls,
        uploadedData: uploadData,
      };
    } catch (error: any) {
      console.error('File upload failed:', error);

      // Clean up local files in case of error
      try {
        files.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }

      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async ImageUpload(tableName: string, data: any[]) {
    console.log('hello upload image data is dtaataaa !!!!-------');
    console.log(data);
    if (tableName == 'users') {
      let updateuser = prisma.users.update({
        where: {
          userId: data[0].user_id,
        },
        data: {
          avtar: data[0].image_url,
        },
      });
      return updateuser;
    }
    const uploadImage = await this.hotelRepo.uploadImage(tableName, data);
    console.log('IMAGE UPLOAD SUCCESSFULLY', uploadImage);
    if (!uploadImage) {
      throw new Error('image not uploaded successfully');
    }
    return uploadImage;
  }
  public async findByHours(options: {
    page?: number;
    limit?: number;
    checkin?: Date;
    checkout?: Date;
  }): Promise<any> {
    try {
      const { page, limit, checkin, checkout } = options;

      // 1. Build the base WHERE clause for the query
      const whereClause: any = {
        // We can add specific filters for hourly hotels here if needed
        // e.g., is_hourly_available: true
      };

      // 2. If checkin & checkout are provided, filter out unavailable hotels
      if (checkin && checkout) {
        // Find all hotels that have a conflicting booking in the requested range.
        // A booking conflicts if: its start time is before the new checkout time,
        // AND its end time is after the new checkin time.
        const unavailableHotels = await prisma.hotelUnavailable.findMany({
          where: {
            check_in_datetime: { lt: checkout },
            check_out_datetime: { gt: checkin },
          },
          select: { hotel_id: true }, // Only need the hotel ID
        });

        // Create a unique list of unavailable hotel IDs
        const unavailableHotelIds = [
          ...new Set(unavailableHotels.map((h) => h.hotel_id)),
        ];

        // Add a condition to the main query to exclude these hotels
        if (unavailableHotelIds.length > 0) {
          whereClause.hotel_id = { notIn: unavailableHotelIds };
        }
      }

      // 3. Handle pagination if 'limit' is provided
      if (limit) {
        const currentPage = page && page > 0 ? page : 1;
        const skip = (currentPage - 1) * limit;

        // Use a transaction to get both the data and the total count efficiently
        const [hotels, totalItems] = await prisma.$transaction([
          prisma.hotels.findMany({
            where: {
              ...whereClause,
              isHourly: true,
            },
            take: limit,
            skip: skip,
            include: {
              // Essential for hourly bookings
              room_hourly_rates: true,
              // Other useful related data
              hotel_images: true,
              hotel_ratings: true,
              room_types: true,
            },
          }),
          prisma.hotels.count({ where: whereClause }),
        ]);

        // Return the data in a paginated format
        return {
          hotels,
          pagination: {
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage,
            limit,
          },
        };
      }

      // 4. If no pagination, return all matching hotels
      const allHotels = await prisma.hotels.findMany({
        where: whereClause,
        include: {
          room_hourly_rates: true,
          hotel_images: { where: { is_primary: true } },
          hotel_ratings: true,
        },
      });

      return { hotels: allHotels };
    } catch (error: unknown) {
      // 5. Keep your robust error handling
      if (error instanceof CustomError) {
        throw error; // Re-throw known custom errors
      }
      // Check for Prisma-specific errors if needed, otherwise generalize
      if (error instanceof Error) {
        // You could log the original error here for debugging
        // console.error(error);
        throw new CustomError(
          `Database operation failed: ${error.message}`,
          500,
        );
      }
      throw new CustomError(
        'An unknown error occurred while finding hotels.',
        500,
      );
    }
  }
  async hotelunavilable(extradata: any) {
    // const hotelData = await this.findById(extradata.hotel_id);
    // if (!hotelData) {
    //   throw new CustomError('hotel is not avilable', 404);
    // }
    // console.log('hotel id is commmingggg-----');
    // console.log(hotelData.hotel_id);
    const hotel = this.hotelRepo.hotelunavilable({
      hotel_id: extradata.hotel_id,
      check_in_datetime: extradata.check_in_datetime,
      check_out_datetime: extradata.check_out_datetime,
      total_days: parseInt(extradata.total_days),
    });
    return hotel;
  }
  async hotelunavilableById(hotel_id: any) {
    // const hotelData = await this.findById(hotel_id);
    // if (!hotelData) {
    //   throw new CustomError('hotel is not avilable', 404);
    // }
    console.log('hotel id is commmingggg-----');
    console.log(hotel_id);
    const hotel = this.hotelRepo.hotelunavilableById(hotel_id);
    return hotel;
  }
  async hotelunavilableList() {
    // const hotelData = await this.findById(hotel_id);
    // if (!hotelData) {
    //   throw new CustomError('hotel is not avilable', 404);
    // }
    // console.log('hotel id is commmingggg-----');
    // console.log(hotel_id);
    const hotel = this.hotelRepo.hotelunavilableList();
    return hotel;
  }
  async addAmenities(data: any) {
    try {
      console.log('data is comming-------');
      console.log(data);
      const findHotel = await this.findById(data[0].hotel_id);
      console.log(findHotel);
      const mappedData = data.map((item: any) => {
        const newItem = { ...item };
        newItem.hotel_id = findHotel.hotel_id; // ✅ overwrite with new hotel_id
        return newItem;
      });

      console.log('new data is hererereere---------');
      console.log(mappedData);
      const createAmenities = await this.hotelRepo.addameniities(mappedData);
      return createAmenities;
    } catch (error: unknown) {
      // 5. Keep your robust error handling
      if (error instanceof CustomError) {
        throw error; // Re-throw known custom errors
      }
      // Check for Prisma-specific errors if needed, otherwise generalize
      if (error instanceof Error) {
        // You could log the original error here for debugging
        // console.error(error);
        throw new CustomError(
          `Database operation failed: ${error.message}`,
          500,
        );
      }
      throw new CustomError(
        'An unknown error occurred while finding hotels.',
        500,
      );
    }
  }
  async addPolicy(data: any) {
    try {
      const findHotel = await this.findById(data.hotel_id);
      console.log(findHotel);
      const createPolicy = await this.hotelRepo.addPrivacyPolicy({
        ...data,
        hotel_id: findHotel.hotel_id,
      });
      return createPolicy;
    } catch (error: unknown) {
      // 5. Keep your robust error handling
      if (error instanceof CustomError) {
        throw error; // Re-throw known custom errors
      }
      // Check for Prisma-specific errors if needed, otherwise generalize
      if (error instanceof Error) {
        // You could log the original error here for debugging
        // console.error(error);
        throw new CustomError(
          `Database operation failed: ${error.message}`,
          500,
        );
      }
      throw new CustomError(
        'An unknown error occurred while finding hotels.',
        500,
      );
    }
  }
}
