// import { statusCode } from 'src/config/statuscode';
import prisma from 'src/config/db.config';
import { statusCode } from '../config/statuscode';
import { User, userLogin } from '../domain/entity/user';
import { UserRepository } from '../usecases/user.repository';
import { CustomError } from '../utils/customeerror';
import encryptPassword from '../utils/encyptpassword';
import JwtToken from '../utils/jwtToken';
import _ from 'lodash';

export default class UserService {
  constructor(private userRepo: UserRepository) {}

  async createUser(userData: User): Promise<User> {
    try {
      const userAvailable = await this.userRepo.findByEmail(userData.email);
      if (userAvailable) {
        throw new CustomError('User already exists', 404);
      }
      return await this.userRepo.create(userData);
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
  async Login(userData: userLogin) {
    const userAvailable = await this.userRepo.findByEmail(userData.email);
    if (!userAvailable) {
      return new CustomError('user is not Exist', statusCode.badRequest);
    }
    const isValidRole = userData.Role === userAvailable.Role;
    if (!isValidRole) {
      return new CustomError(
        'You are not allowed to login from here',
        statusCode.unauthorized,
      );
    }
    if (!userAvailable.isVerified) {
      return new CustomError(
        'First please verified your account check your mail',
        statusCode.unauthorized,
      );
    }
    const decryptPassword = encryptPassword.Decrypt(
      userData.password,
      userAvailable.password,
      userAvailable.salt,
    );
    if (!decryptPassword) {
      return new CustomError('Invalid credentials', statusCode.badRequest);
    }
    const updateUser = _.omit(userAvailable, [
      'password',
      'salt',
      'updatedAt',
      'createdAt',
      'deletedAt',
    ]);
    const createJwt = JwtToken.createJwt(
      updateUser,
      process.env.JWT_SECRET_KEY ?? '',
      {
        expiresIn: '1h',
      },
    );
    return {
      ...updateUser,
      Token: createJwt,
    };
  }
  async verifyUser(token: string, verified: boolean) {
    const findUser = await this.userRepo.findById(token);
    if (!findUser) {
      return new CustomError('user is not exist', statusCode.badRequest);
    }
    const updateUser = await this.userRepo.update(
      {
        isVerified: verified,
      },
      token,
    );
    if (!updateUser) {
      return new CustomError('user is not updated', statusCode.badRequest);
    }
    return 'updated ssucessfully';
  }
  async getalluser() {
    const user = await prisma.users.findMany({});
    return user;
  }
}
