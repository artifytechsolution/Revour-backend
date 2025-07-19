import prisma from 'src/config/db.config';
import razorpay from 'src/config/razorpay.config';
import { IOrderRepository } from 'src/domain/interfaces/orderRepository';

export class OrderRepository implements IOrderRepository {
    async createReservations(order: any): Promise<any> {
        return await prisma.reservations.create({
            data:order
        })
    }
    async orderFindById(id: string): Promise<any> {
      return await prisma.orders.findUnique({
        where:{
            razorpay_order_id:id
        }
      })
    }
    async reservationFindById(id: number): Promise<any> {
        return await prisma.reservations.findUnique({
            where: { reservation_id:id },
            include: { bills: true },
    });
    }
    async reateReservations(Reservation: any): Promise<any> {
        return await prisma.reservations.create({
            data:Reservation
        })
    }
    async create(order: any): Promise<any> {
        return await prisma.orders.create({
      data:order
    });
    }
    verify(order: any): Promise<any> {
        throw new Error('Method not implemented.');
    }
    async razorPayOrderCreate(order:any):Promise<any>{
        return await razorpay.orders.create(order);
    }
}
