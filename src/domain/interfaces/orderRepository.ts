export interface IOrderRepository {
  create(order: any): Promise<any>;
  verify(order: any): Promise<any>;
  createReservations(order: any): Promise<any>;
  reservationFindById(id: number): Promise<any>;
  orderFindById(id: string): Promise<any>;
  razorPayOrderCreate(data: any): Promise<any>;
  orderlist(): Promise<any>;
  orderListByid(id: number): Promise<any>;
  orderlistByuser(id: number): Promise<any>;
}
