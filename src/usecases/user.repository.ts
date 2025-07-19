import prisma from '../config/db.config';
import { UpdateUser, User } from '../domain/entity/user';
import { IUserRepository } from '../domain/interfaces/userRepository';

export class UserRepository implements IUserRepository {
  async findAll(): Promise<any[]> {
    return await prisma.users.findMany();
  }
  async findById(Id: string): Promise<any | null> {
    return await prisma.users.findFirst({
      where: {
        id: Id,
      },
    });
  }
  async findByEmail(email: string): Promise<any | null> {
    return await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
  }
  async create(user: User): Promise<any | null> {
    return await prisma.users.create({
      data: user,
    });
  }
  async update(user: UpdateUser, Id: string): Promise<any | null> {
    return await prisma.users.update({
      where: {
        id: Id,
      },
      data: user,
    });
  }
  async delete(Id: string): Promise<string> {
    await prisma.users.delete({
      where: {
        id: Id,
      },
    });
    return 'delete record successfully';
  }
}
