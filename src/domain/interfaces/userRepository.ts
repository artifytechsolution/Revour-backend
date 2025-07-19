import { User } from '../entity/user';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User, Id: string): Promise<User>;
  delete(id: string): Promise<string>;
}
