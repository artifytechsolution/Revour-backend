export interface IexperienceRepository {
  findAll(): Promise<any>;
  findById(id: string | undefined): Promise<any | null>;
  findByEmail(email: string): Promise<any | null>;
  create(hotel: any): Promise<any>;
  update(hotel: any, Id: string): Promise<any>;
  delete(id: string[]): Promise<string>;
  uploadImage(tablename: string, data: any): Promise<string>;
}
