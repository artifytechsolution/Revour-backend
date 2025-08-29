export interface IRoomRepository {
  findAll(): Promise<any[]>;
  findById(id: string | undefined): Promise<any | null>;
  findByByHotel(id: number | undefined): Promise<any | null>;
  create(hotel: any): Promise<any>;
  update(hotel: any, Id: string): Promise<any>;
  delete(id: string[]): Promise<string>;
  hourAdd(data: any): Promise<any>;
  hoursDelete(ids: any): Promise<any>;
  hoursFind(id: any): Promise<any>;
}
