export interface IRatingRepository {
  findAll(): Promise<any[]>;
  findById(id: string | undefined): Promise<any | null>;
  findByHotel(id: number | undefined,user_id:number): Promise<any | null>;
  avgRating(id: number | undefined): Promise<any | null>;
  create(hotel: any): Promise<any>;
  update(hotel: any, Id: string): Promise<any>;
  delete(id: string[]): Promise<string>;
}
