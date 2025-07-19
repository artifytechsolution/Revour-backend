import { hotel } from '../entity/hotel';

export interface IHotelRepository {
  findAll(): Promise<hotel[]>;
  findById(id: string | undefined): Promise<hotel | null>;
  findByEmail(email: string): Promise<hotel | null>;
  create(hotel: hotel): Promise<hotel>;
  update(hotel: hotel, Id: string): Promise<hotel>;
  delete(id: string[]): Promise<string>;
  uploadImage(tablename: string, data: any): Promise<string>;
}
